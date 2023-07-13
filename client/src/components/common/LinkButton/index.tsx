import { StyledLink } from "./styles";

type LinkProps = {
  children: string | React.ReactNode;
  type?: "primary" | "secondary";
  to: string;
};

export const LinkButton = ({ children, to, type = "primary" }: LinkProps) => {
  return (
    <StyledLink to={to} $secondary={type === "secondary"} $size="small">
      {children}
    </StyledLink>
  );
};
