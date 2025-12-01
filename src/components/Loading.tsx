import { Center } from "./ui/center";
import { Spinner } from "./ui/spinner";

export function Loading() {
  return (
    <Center className="flex-1 bg-grey-700">
      <Spinner className="color-green-500" />
    </Center>
  )
}