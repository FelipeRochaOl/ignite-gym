import { ComponentProps } from "react";
import { Image } from "./ui/image";

type UserPhotoProps = ComponentProps<typeof Image>

export function UserPhoto({ ...props }: UserPhotoProps) {
  return (
    <Image {...props} className="rounded-full border-2 border-gray-400 bg-gray-500" />
  )
}