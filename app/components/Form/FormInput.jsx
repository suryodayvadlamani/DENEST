import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@UI/form";

import { Input } from "@UI/input";

function FormInput({ name, form, id, type = "text", label, ...props }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem id={`formItem${name}`} className="relative pt-2">
          <FormControl>
            <Input
              {...field}
              id={id}
              type={type}
              placeholder=" "
              {...props}
              className="peer placeholder-transparent mt-1  w-full rounded-md py-1.5 sm:text-sm sm:leading-6"
            />
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

export default FormInput;
