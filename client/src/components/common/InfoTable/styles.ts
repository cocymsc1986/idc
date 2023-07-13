import styled from "styled-components/macro";

export const Header = styled.h3`
  margin: 0 0 1.5rem;
`;

export const TableWrapper = styled.div`
  border: 1px solid var(--green);
  border-radius: 1rem;
  padding: 2rem;
`;

export const TableContent = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const TableItem = styled.div`
  width: 50%;
  margin-bottom: 2rem;
  padding-right: 2rem;
`;

export const Label = styled.span`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 100;
`;

export const Value = styled.span`
  display: block;
  font-size: 2rem;
  font-weight: 500;
  word-break: break-word;
`;
