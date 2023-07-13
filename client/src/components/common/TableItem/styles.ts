import { Link } from "react-router-dom";
import styled from "styled-components/macro";

export const StyledLink = styled(Link)`
  color: var(--green);
  font-weight: var(--wght-light);

  &:hover {
    color: var(--white);
  }
`;
