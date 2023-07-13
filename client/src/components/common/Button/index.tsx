import { LoadingIcon } from "../LoadingIcon";
import { StyledButton } from "./styles";

type ButtonProps = {
  children: string | React.ReactNode;
  htmlType?: string;
  onClick?: (arg0: any) => any;
  type?: "primary" | "secondary";
  size?: "small" | "regular" | "large";
  disabled?: boolean;
  loading?: boolean;
  name?: string;
  ariaLabel?: string;
};

export const Button = ({
  children,
  onClick,
  htmlType = "button",
  type = "primary",
  disabled = false,
  size,
  loading,
  name,
  ariaLabel,
}: ButtonProps) => {
  return (
    <StyledButton
      onClick={onClick}
      type={htmlType}
      $secondary={type === "secondary"}
      disabled={disabled || loading}
      $size={size}
      name={name}
      aria-label={ariaLabel}
    >
      {loading ? (
        <LoadingIcon color={type !== "secondary" && "black"} size="small" />
      ) : (
        children
      )}
    </StyledButton>
  );
};
