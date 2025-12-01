import { Input as GluestackInput, InputField } from "@components/ui/input";
import { ComponentProps } from "react";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "./ui/form-control";

type InputProps = ComponentProps<typeof InputField> & {
  isError?: boolean;
  isReadOnly?: boolean;
  messageError?: string;
};

export function Input({
  isError = false,
  isReadOnly = false,
  messageError,
  ...props
}: InputProps) {
  return (
    <FormControl isInvalid={isError} className="w-full mb-4">
      <GluestackInput
        isInvalid={isError}
        className={`
        h-14 
        border 
        border-transparent
        data-[focus=true]:border-1'  
        data-[focus=true]:border-green-500
        rounded-md
        ${isReadOnly ? "opacity-50" : ""}
      `}
        isReadOnly={isReadOnly}
      >
        <InputField
          className="color-white font-body bg-gray-700 px-4"
          placeholderClassName="color-gray-300"
          cursorColor="color-green-500"
          {...props}
        />
      </GluestackInput>
      {isError && messageError && (
        <FormControlError className="w-full text-error-500">
          <FormControlErrorText>{messageError}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
