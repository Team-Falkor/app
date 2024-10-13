import { Log } from "@/@types";
import {
  ConsoleErrorDisplay,
  ConsoleInfoDisplay,
  ConsoleWarningDisplay,
} from "./logTypes";

const LogSwitch = ({ id, message, timestamp, type }: Log) => {
  switch (type) {
    case "error":
      return (
        <ConsoleErrorDisplay
          key={id}
          description={message}
          timestamp={timestamp}
        />
      );
    case "warn":
      return (
        <ConsoleWarningDisplay
          key={id}
          description={message}
          timestamp={timestamp}
        />
      );

    case "info":
      return (
        <ConsoleInfoDisplay
          key={id}
          description={message}
          timestamp={timestamp}
        />
      );

    default:
      return (
        <ConsoleErrorDisplay
          key={id}
          description={message}
          timestamp={timestamp}
        />
      );
  }
};

export default LogSwitch;
