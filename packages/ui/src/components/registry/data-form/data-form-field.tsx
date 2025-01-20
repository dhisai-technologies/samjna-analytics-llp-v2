"use client";

import type { DataFormFieldProps } from "@config/utils";
import { InputDate, InputPassword } from "@ui/components/registry/inputs";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@ui/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/components/ui/select";
import { Textarea } from "@ui/components/ui/textarea";
import { cn } from "@ui/utils";
import { type ArrayPath, type FieldValues, useFieldArray } from "react-hook-form";
import { match } from "ts-pattern";
import { useDataForm } from "./data-form";

function DataFormField<TFieldValues extends FieldValues>(props: DataFormFieldProps<TFieldValues>) {
  const { form, state } = useDataForm<TFieldValues>();
  return match(props)
    .with({ type: "text" }, ({ name, label, description, className, placeholder, onInput, disabled }) => (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <FormControl>
              <Input placeholder={placeholder} disabled={disabled} onInput={onInput} {...field} />
            </FormControl>
            <FormMessage>{state?.errors?.[name]}</FormMessage>
          </FormItem>
        )}
      />
    ))
    .with({ type: "number" }, ({ name, label, description, className, placeholder, onInput, disabled }) => (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <FormControl>
              <Input placeholder={placeholder} type="number" onInput={onInput} disabled={disabled} {...field} />
            </FormControl>
            <FormMessage>{state?.errors?.[name]}</FormMessage>
          </FormItem>
        )}
      />
    ))
    .with({ type: "password" }, ({ name, label, description, className, disabled, onInput, placeholder }) => (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <FormControl>
              <InputPassword placeholder={placeholder} disabled={disabled} onInput={onInput} {...field} />
            </FormControl>
            <FormMessage>{state?.errors?.[name]}</FormMessage>
          </FormItem>
        )}
      />
    ))
    .with({ type: "select" }, ({ name, label, description, className, disabled, placeholder, options }) => (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage>{state?.errors?.[name]}</FormMessage>
          </FormItem>
        )}
      />
    ))
    .with({ type: "textarea" }, ({ name, label, description, className, placeholder, disabled }) => (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <FormControl>
              <Textarea placeholder={placeholder} disabled={disabled} {...field} />
            </FormControl>
            <FormMessage>{state?.errors?.[name]}</FormMessage>
          </FormItem>
        )}
      />
    ))
    .with({ type: "date" }, ({ name, label, description, className, placeholder, disabled }) => (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <InputDate field={field} placeholder={placeholder} disabled={disabled} />
            <FormMessage>{state?.errors?.[name]}</FormMessage>
          </FormItem>
        )}
      />
    ))
    .with({ type: "datetime" }, ({ name, label, description, className, placeholder, disabled, showSeconds }) => (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <InputDate
              type="datetime"
              field={field}
              placeholder={placeholder}
              disabled={disabled}
              showSeconds={showSeconds}
            />
            <FormMessage>{state?.errors?.[name]}</FormMessage>
          </FormItem>
        )}
      />
    ))
    .with({ type: "file" }, ({ name, label, description, className, placeholder, disabled }) => (
      <FormField
        control={form.control}
        name={name}
        render={() => {
          return (
            <FormItem className={className}>
              {label && <FormLabel>{label}</FormLabel>}
              {description && <FormDescription>{description}</FormDescription>}
              <FormControl>
                <Input type="file" placeholder={placeholder} disabled={disabled} {...form.register(name)} />
              </FormControl>
              <FormMessage>{state?.errors?.[name]}</FormMessage>
            </FormItem>
          );
        }}
      />
    ))
    .with({ type: "radio" }, ({ name, label, description, className, options, disabled }) => (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
                disabled={disabled}
              >
                {options.map(({ label, value }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0" key={value}>
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    <FormLabel className="font-normal">{label}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage>{state?.errors?.[name]}</FormMessage>
          </FormItem>
        )}
      />
    ))
    .with({ type: "array" }, ({ name, label, description, className, element, renderAppend }) => {
      const { fields, append, remove } = useFieldArray({
        name: name as ArrayPath<TFieldValues>,
        control: form.control,
      });
      return (
        <div className={cn("flex flex-col space-y-2", className)}>
          <div className="space-y-2">
            {label && <h3 className="text-sm font-semibold">{label}</h3>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {fields.map((field, index) => element({ field, index, remove }))}
          <FormMessage>{state?.errors?.[name]}</FormMessage>
          {renderAppend({ append })}
        </div>
      );
    })
    .with({ type: "others" }, ({ name, label, description, className, render }) => (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <FormControl>{render({ field })}</FormControl>
            <FormMessage>{state?.errors?.[name]}</FormMessage>
          </FormItem>
        )}
      />
    ))
    .exhaustive();
}

export { DataFormField };
