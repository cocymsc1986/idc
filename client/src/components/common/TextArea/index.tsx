import { Label, StyledTextArea } from "./styles";

type TextAreaProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  minHeight?: string;
};

export const TextArea = ({
  label,
  name,
  value,
  onChange,
  minHeight = "15rem",
}: TextAreaProps) => {
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <StyledTextArea
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        minHeight={minHeight}
      />
    </>
  );
};
