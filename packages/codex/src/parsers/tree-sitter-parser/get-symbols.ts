import { Symbol } from "@/types/parser";
import type { Node } from "web-tree-sitter";

const NODE_TYPES = {
  FUNCTION: "function_declaration",
  METHOD: "method_definition",
  FUNCTION_ITEM: "function_item",
  FUNCTION_DEF: "function_definition",
  METHOD_DECL: "method_declaration",
  GENERATOR_FUNC: "generator_function_declaration",
  CLASS: "class_declaration",
  VARIABLE: "variable_declaration",
  PROPERTY: "property_declaration",
  ENUM: "enum_declaration",
  INTERFACE: "interface_declaration",
  COMMENT: "comment",
  IMPORT: "import_statement",
  TYPE_ALIAS: "type_alias_declaration",
  NAMESPACE: "namespace_declaration",
};

interface GetSymbolsOptions {
  includeComments?: boolean;
  includeImports?: boolean;
  // Add more options as needed
}

function addSymbol(symbols: Symbol[], node: Node, pathname: string, type: string, name: string | null, accessModifier: string | null = null, isStatic: boolean = false, annotations: string[] = [], parentContext: string | null = null, relationships: string[] = [], parserName: string) {
  if (name) {
    symbols.push({
      parserName,
      pathname,
      name,
      type,
      contents: node.text,
      range: {
        start: {
          character: node.startPosition.column,
          line: node.startPosition.row,
        },
        end: {
          character: node.endPosition.column,
          line: node.endPosition.row,
        },
      },
      accessModifier,
      isStatic,
      annotations,
      parentContext,
      relationships,
    });
  }
}

export function getSymbols(tree: Node, pathname: string, parserName: string, options: GetSymbolsOptions = {}): Symbol[] {
  const symbols: Symbol[] = [];
  const cursor = tree.walk();

  const visit = (parentContext: string | null = null): void => {
    const node = cursor.currentNode;
    let nameNode: Node | null = null;
    let accessModifier: string | null = null;
    let isStatic: boolean | null = null;
    let annotations: string[] = [];
    let relationships: string[] = [];

    try {
      switch (node.type) {
        case NODE_TYPES.FUNCTION:
        case NODE_TYPES.METHOD:
        case NODE_TYPES.FUNCTION_DEF:
        case NODE_TYPES.GENERATOR_FUNC:
          nameNode = node.childForFieldName("name");
          accessModifier = node.childForFieldName("access_modifier")?.text ?? null;
          isStatic = node.childForFieldName("static") !== null;
          annotations = node.children.filter((child) => child?.type === "annotation").map((annotation) => (annotation as Node).text);
          const currentContext = nameNode?.text ?? null;
          addSymbol(symbols, node, pathname, node.type, currentContext, accessModifier, isStatic, annotations, parentContext, relationships, parserName);

          if (cursor.gotoFirstChild()) {
            do {
              visit(currentContext);
            } while (cursor.gotoNextSibling());
            cursor.gotoParent();
          }
          break;
        case NODE_TYPES.FUNCTION_ITEM:
        case NODE_TYPES.METHOD_DECL:
          nameNode = node.children?.find((child) => child?.type === "identifier" || child?.type === "property_identifier") ?? null;
          addSymbol(symbols, node, pathname, node.type, nameNode?.text ?? null, undefined, undefined, undefined, parentContext, relationships, parserName);
          break;
        case NODE_TYPES.CLASS:
          nameNode = node.childForFieldName("name");
          const classContext = nameNode?.text ?? null;
          relationships = node.children.filter((child) => child?.type === "inheritance_clause").map((inheritance) => `inherits ${inheritance?.text}`);
          addSymbol(symbols, node, pathname, node.type, classContext, undefined, undefined, undefined, parentContext, relationships, parserName);

          if (cursor.gotoFirstChild()) {
            do {
              visit(classContext);
            } while (cursor.gotoNextSibling());
            cursor.gotoParent();
          }
          break;
        case NODE_TYPES.ENUM:
          nameNode = node.childForFieldName("name");
          relationships = node.children.filter((child) => child?.type === "interface_implementation").map((impl) => `implements ${impl?.text}`);
          addSymbol(symbols, node, pathname, node.type, nameNode?.text ?? null, undefined, undefined, undefined, parentContext, relationships, parserName);
          break;
        case NODE_TYPES.INTERFACE:
          nameNode = node.childForFieldName("name");
          relationships = node.children.filter((child) => child?.type === "interface_implementation").map((impl) => `implements ${impl?.text}`);
          addSymbol(symbols, node, pathname, node.type, nameNode?.text ?? null, undefined, undefined, undefined, parentContext, relationships, parserName);
          break;
        case NODE_TYPES.PROPERTY:
          nameNode = node.childForFieldName("name");
          const propertyContext = nameNode?.text ?? null;
          addSymbol(symbols, node, pathname, node.type, propertyContext, undefined, undefined, undefined, parentContext, relationships, parserName);

          if (cursor.gotoFirstChild()) {
            do {
              visit(propertyContext);
            } while (cursor.gotoNextSibling());
            cursor.gotoParent();
          }
          break;
        case NODE_TYPES.VARIABLE:
          const declarations = node.namedChildren.filter((n): n is NonNullable<typeof n> => n !== null).filter((n) => n.type === "variable_declarator");

          for (const declaration of declarations) {
            nameNode = declaration.childForFieldName("name");
            addSymbol(symbols, declaration, pathname, node.type, nameNode?.text ?? null, undefined, undefined, undefined, parentContext, relationships, parserName);
          }
          break;
        case NODE_TYPES.COMMENT:
          if (options.includeComments) {
            addSymbol(symbols, node, pathname, node.type, `comment#${node.startPosition.row}`, undefined, undefined, undefined, parentContext, relationships, parserName);
          }
          break;
        case NODE_TYPES.IMPORT:
          if (options.includeImports) {
            nameNode = node.childForFieldName("source");
            relationships = nameNode?.text ? [`imports ${nameNode.text}`] : [];
            addSymbol(symbols, node, pathname, node.type, nameNode?.text ? `import ${nameNode.text}` : null, undefined, undefined, undefined, parentContext, relationships, parserName);
          }
          break;
        case NODE_TYPES.TYPE_ALIAS:
        case NODE_TYPES.NAMESPACE:
          nameNode = node.childForFieldName("name");
          addSymbol(symbols, node, pathname, node.type, nameNode?.text ?? null, undefined, undefined, undefined, parentContext, relationships, parserName);
          break;
        default:
          if (cursor.gotoFirstChild()) {
            do {
              visit(parentContext);
            } while (cursor.gotoNextSibling());
            cursor.gotoParent();
          }
      }
    } catch (error) {
      console.error(`Error processing node of type ${node.type}:`, error);
    }
  };

  visit();

  return symbols;
}
