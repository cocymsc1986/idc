import styled from "styled-components/macro";

export const StyledTableHead = styled.th`
  padding-top: 0;
  font-weight: var(--wght-light);
  width: ${(props) => props.width};

  &:first-child {
    padding: 0rem 2rem;
  }
`;
