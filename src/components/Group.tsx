import { ComponentProps } from "react";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

type GroupProps = ComponentProps<typeof Button> & {
  name: string;
  isActive: boolean;
}

export function Group({ name, isActive, ...props }: GroupProps) {
  return (
    <Button
      className={`
        mr-3
        min-w-24 
        h-10 
        rounded-md 
        justify-center 
        items-center 
        bg-gray-600 
        ${isActive ? 'border border-green-500' : 'border-0'}
        data-[active=true]:border
        data-[active=true]:border-green-500
      `}
      {...props}
    >
      <Text className={`
        text-${isActive ? 'green-500' : 'gray-200'} 
        uppercase 
        text-xs 
        font-heading`
      }>
        {name}
      </Text>
    </Button>
  )
}