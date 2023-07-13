import { StyledFieldset } from "./styles";

type FieldsetTypes = {
  children: string | React.ReactNode;
  disabled?: boolean;
};

export const Fieldset = ({ children, disabled }: FieldsetTypes) => {
  return <StyledFieldset disabled={disabled}>{children}</StyledFieldset>;
};
