import { Center } from "./ui/center";
import { Heading } from "./ui/heading";

type ScreenHeaderProps = {
  title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <Center className="bg-gray-600 pb-6 pt-16">
      <Heading className="text-gray-100 text-xl font-heading">
        {title}
      </Heading>
    </Center>
  );
}