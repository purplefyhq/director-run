"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { Controller, type ControllerProps, type FieldPath, type FieldValues, FormProvider, useFormContext } from "react-hook-form";

const Form = FormProvider;

type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ ...props }: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

type FormItemProps = React.ComponentPropsWithRef<"div">;

const FormItem = ({ className, ...props }: FormItemProps) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("flex flex-col gap-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
};
FormItem.displayName = "FormItem";

type FormLabelProps = React.ComponentPropsWithRef<typeof LabelPrimitive.Root> & React.ComponentPropsWithRef<typeof Label>;

const FormLabel = ({ className, ...props }: FormLabelProps) => {
  const { error, formItemId } = useFormField();

  return <Label className={cn(error && "", className)} htmlFor={formItemId} {...props} />;
};
FormLabel.displayName = "FormLabel";

type FormControlProps = React.ComponentPropsWithRef<typeof Slot>;

const FormControl = ({ ...props }: FormControlProps) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return <Slot id={formItemId} aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`} aria-invalid={!!error} {...props} />;
};
FormControl.displayName = "FormControl";

type FormDescriptionProps = React.ComponentPropsWithRef<"p">;

const FormDescription = ({ className, ...props }: FormDescriptionProps) => {
  const { formDescriptionId } = useFormField();

  return <p id={formDescriptionId} className={cn("text-[0.8rem] text-muted-foreground", className)} {...props} />;
};
FormDescription.displayName = "FormDescription";

type FormMessageProps = React.ComponentPropsWithRef<"p">;

const FormMessage = ({ className, children, ...props }: FormMessageProps) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p id={formMessageId} className={cn("text-base text-destructive", className)} {...props}>
      {body}
    </p>
  );
};
FormMessage.displayName = "FormMessage";

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };
