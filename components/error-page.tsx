import { errorMessages } from "@/lib/constants";
import { getRandomItemFromArray } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { FallbackProps } from "react-error-boundary";

export default function ErrorPage(props: FallbackProps) {
  const errorMessage = getRandomItemFromArray(errorMessages);

  const handleRefreshState = () => {
    props.resetErrorBoundary();
    window.location.reload();
  };

  return (
    <div
      className="relative flex-1 flex h-screen items-center justify-center p-16"
      role="alert"
    >
      <div className="flex flex-col gap-4 text-center">
        <h1 className="font-mono text-xl">{errorMessage}</h1>

        <Image
          src="/error-illustration.svg"
          alt="Loading"
          width={512}
          height={512}
        />

        <h2 className="text-">{"We're"} working hard on the fix!</h2>

        <div>
          <Button onClick={handleRefreshState}>Try again</Button>
        </div>
      </div>
    </div>
  );
}
