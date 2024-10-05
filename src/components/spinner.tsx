import { Loader } from "lucide-react";

interface SpinnerProps {
  size?: number; // Allow customization of the size
  className?: string; // Additional custom styling
}

const Spinner = ({ size = 24, className = "" }: SpinnerProps) => {
  return (
    <Loader
      className={`animate-spin ${className}`}
      width={size}
      height={size}
    />
  );
};

export default Spinner;
