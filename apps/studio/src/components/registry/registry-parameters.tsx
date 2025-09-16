import type { ComponentProps } from "react";

import { AsteriskIcon, TextTIcon } from "@phosphor-icons/react";
import type { MasterRegistryEntry } from "../types";
import { Badge, BadgeGroup, BadgeIcon, BadgeLabel } from "../ui/badge";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
} from "../ui/empty-state";
import {
  List,
  ListItem,
  ListItemDescription,
  ListItemDetails,
  ListItemTitle,
} from "../ui/list";

interface RegistryParametersProps extends ComponentProps<typeof List> {
  parameters: MasterRegistryEntry["parameters"];
}

export function RegistryParameters({
  parameters,
  ...props
}: RegistryParametersProps) {
  if (parameters.length === 0) {
    return (
      <EmptyState>
        <EmptyStateTitle>No parameters</EmptyStateTitle>
        <EmptyStateDescription>
          This MCP server does not have any parameters.
        </EmptyStateDescription>
      </EmptyState>
    );
  }

  return (
    <List {...props}>
      {parameters
        .filter(
          (parameter, index, array) =>
            array.findIndex((p) => p.name === parameter.name) === index,
        )
        .map((parameter) => (
          <ListItem key={parameter.name}>
            <ListItemDetails>
              <ListItemTitle className="font-mono">
                {parameter.name}
              </ListItemTitle>
              {parameter.description && (
                <ListItemDescription>
                  {parameter.description}
                </ListItemDescription>
              )}
            </ListItemDetails>

            <BadgeGroup>
              {parameter.required && (
                <Badge variant="destructive">
                  <BadgeIcon>
                    <AsteriskIcon weight="bold" />
                  </BadgeIcon>
                  <BadgeLabel uppercase>Required</BadgeLabel>
                </Badge>
              )}
              {parameter.type === "string" && (
                <Badge>
                  <BadgeIcon>
                    <TextTIcon />
                  </BadgeIcon>
                  <BadgeLabel uppercase>String</BadgeLabel>
                </Badge>
              )}
            </BadgeGroup>
          </ListItem>
        ))}
    </List>
  );
}
