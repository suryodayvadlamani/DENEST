import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@UI/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@UI/select";

function FormSelect({ name, form, options, id, label }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem id={`formItem${name}`} className="relative pt-2">
          <FormControl>
            <Select
              id={id}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent className="h-fit max-h-56 overflow-y-auto">
                <SelectGroup>
                  {options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormLabel
            htmlFor={id}
            className="absolute left-0 -top-5 mt-4 px-3 text-white-900 text-sm transition-all 
                    peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                    peer-focus:-top-5
                    peer-focus:text-sm
                    peer-focus:text-white-900
                    peer-placeholder-shown:top-2"
          >
            {label}
          </FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormSelect;
