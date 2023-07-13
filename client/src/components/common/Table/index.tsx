import { TableHead } from "../TableHead";
import { StyledTable } from "./styles";

export const Table = <T extends string[]>({
  titles,
  widths,
  scope = "col",
  children,
}: {
  titles: [...T];
  widths: [...{ [I in keyof T]: number }];
  scope?: "col" | "colgroup" | "row" | "rowgroup";
  children: string | React.ReactNode;
}) => {
  return (
    <StyledTable>
      <thead>
        <tr>
          {titles.map((title, i) => (
            <TableHead
              key={`th_${title}_${i}`}
              scope={scope}
              width={`${widths[i]}%`}
            >
              {title}
            </TableHead>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </StyledTable>
  );
};
