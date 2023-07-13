import styled from "styled-components/macro";

export const StyledTableData = styled.td`
  color: var(--white);
  border: 1px solid var(--green);
  border-style: solid none;
  font-weight: var(--wght-medium);
  background-color: #222222;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2rem 1rem;

  &:first-child {
    padding: 2rem;
    padding-right: 4rem;
    border-left-style: solid;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  &:last-child {
    border-right-style: solid;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    white-space: unset;
    text-overflow: unset;
  }
`;
