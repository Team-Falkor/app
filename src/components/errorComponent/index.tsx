import { cn } from "@/lib";
import { ErrorComponentProps, Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

const ErrorComponent = (props: ErrorComponentProps) => {
  return (
    <div className="flex flex-col items-start justify-start h-screen w-full p-4 gap-3">
      <div className="flex flex-col items-start justify-center w-full gap-0.5">
        <h1 className="text-3xl font-bold">{props.error.name}</h1>
        <h2 className="text-lg text-muted-foreground">{props.error.message}</h2>
      </div>
      <div className="flex-1 overflow-hidden p-1 w-full">
        <ScrollArea
          className={cn(
            "rounded-lg shadow-lg transition-all ease-in-out size-full ring-1 ring-muted p-3 overflow-y-auto"
          )}
        >
          <pre className="text-balance text-sm font-mono text-muted-foreground whitespace-pre-wrap w-full">
            {props.error.stack}
          </pre>
        </ScrollArea>
      </div>
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-row gap-2 justify-between w-full">
          <Link to="/" className={buttonVariants({ variant: "secondary" })}>
            Go to Home
          </Link>
          <h1 className="text-xl font-bold">
            Report This Error to the Developer
          </h1>
          <Button onClick={props.reset} variant={"destructive"}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;
