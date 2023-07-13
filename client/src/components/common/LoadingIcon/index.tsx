import ScaleLoader from "react-spinners/ScaleLoader";

type LoadingIconProps = {
  color?: string;
  size?: "small" | "regular" | "large";
};

const sizes = {
  small: {
    width: 3,
    height: 15,
    margin: 2,
  },
  regular: {
    width: 4,
    height: 35,
    margin: 2,
  },
  large: {
    width: 6,
    height: 60,
    margin: 6,
  },
};

export const LoadingIcon = ({ color, size = "large" }: LoadingIconProps) => {
  return (
    <ScaleLoader
      color={color || "var(--green)"}
      width={sizes[size].width}
      height={sizes[size].height}
      margin={sizes[size].margin}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};
