import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@UI/form";
import { RxEyeClosed, RxEyeOpen, RxMagnifyingGlass } from "react-icons/rx";
import { Input } from "@UI/input";

function FormInput({
  name,
  form,
  id,
  type = "text",
  isSearchable,
  searchCallback,
  label,
  ...props
}) {
  const [showPassword, showPasswordToggle] = useState(false);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem id={`formItem${name}`} className="relative pt-2">
          <FormControl>
            <>
              <Input
                {...field}
                onChange={(e) => {
                  field.onChange(
                    type == "number" && e.target.value
                      ? e.target.valueAsNumber
                      : e.target.value
                  );
                }}
                id={id}
                type={showPassword ? "text" : type}
                placeholder=" "
                {...props}
                className="peer placeholder-transparent mt-1  w-full rounded-md py-1.5 sm:text-sm sm:leading-6"
              />
              {isSearchable && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                  <RxMagnifyingGlass
                    className="h-6 w-6"
                    onClick={() => {
                      searchCallback(field.value);
                    }}
                  />
                </div>
              )}
              {type == "password" && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                  {showPassword ? (
                    <RxEyeOpen
                      className="h-6 w-6"
                      onClick={() => showPasswordToggle(false)}
                    />
                  ) : (
                    <RxEyeClosed
                      className="h-6 w-6"
                      onClick={() => showPasswordToggle(true)}
                    />
                  )}
                </div>
              )}
            </>
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
