import { Label, StyledTextInput } from "./styles";

type TextInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const TextInput = ({
  name,
  value,
  label,
  onChange,
  placeholder,
  disabled,
}: TextInputProps) => {
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <StyledTextInput
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </>
  );
};
