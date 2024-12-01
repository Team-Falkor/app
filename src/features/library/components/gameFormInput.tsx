import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface GameFormInputProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  text: string;
  description: string;
  required?: boolean;
  field: ControllerRenderProps<T>;
  Button?: JSX.Element;
}

const GameFormInput = <T extends FieldValues>({
  description,
  required,
  field,
  Button,
  text,
  ...props
}: GameFormInputProps<T>) => {
  return (
    <FormItem>
      <FormLabel>
        {text}
        {required ? "*" : null}
      </FormLabel>
      <div className="flex flex-row flex-1">
        <FormControl>
          <Input placeholder={description} {...props} {...field} />
        </FormControl>
        {Button}
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default GameFormInput;
