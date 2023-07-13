import { Label, StyledSelectInput } from "./styles";

type SelectInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: {
    name: string;
    value: string;
  }[];
  disabled?: boolean;
};

export const SelectInput = ({
  name,
  value,
  label,
  onChange,
  options,
  disabled,
}: SelectInputProps) => {
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <StyledSelectInput
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={`select-option-${option.value}`} value={option.value}>
            {option.name}
          </option>
        ))}
      </StyledSelectInput>
    </>
  );
};
