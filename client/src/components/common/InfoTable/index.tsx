import {
  Header,
  TableContent,
  TableWrapper,
  TableItem,
  Label,
  Value,
} from "./styles";

type InfoTableProps = {
  title: string;
  data: Record<string, string | number>;
};

export const InfoTable = ({ title, data }: InfoTableProps) => {
  if (!data) {
    return null;
  }

  const keys = Object.keys(data);

  if (!keys.length) {
    return null;
  }

  return (
    <TableWrapper>
      <Header>{title}</Header>
      <TableContent>
        {keys.map((key) => (
          <TableItem>
            <Label>{key}</Label>
            <Value>{data[key]}</Value>
          </TableItem>
        ))}
      </TableContent>
    </TableWrapper>
  );
};
