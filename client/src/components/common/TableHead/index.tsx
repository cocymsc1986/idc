import { StyledTableHead } from "./styles";

type TableHeadProps = {
  children: string | React.ReactNode;
  scope?: "col" | "colgroup" | "row" | "rowgroup";
  width?: string;
};

export const TableHead = ({ children, scope, width }: TableHeadProps) => {
  return (
    <StyledTableHead scope={scope} width={width}>
      {children}
    </StyledTableHead>
  );
};
