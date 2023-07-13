import styled from "styled-components/macro";
import { Link } from "react-router-dom";

const getSizes = (size) => {
  switch (size) {
    case "small":
      return `
        padding: 0.75rem 1.5rem;
        font-size: 15px;
      `;
    case "regular":
      return `
          padding: 1.5rem 2rem;
          font-size: 20px;
        `;
    case "large":
      return `
            padding: 2rem 3rem;
            font-size: 20px;
          `;
    default:
      return `
          padding: 1.5rem 2rem;
          font-size: 20px;
        `;
  }
};

export const StyledLink = styled(Link)<{
  to: string;
  $secondary: boolean;
  $size: string;
}>`
  ${(props) => getSizes(props.$size)};

  display: inline-block;
  font-family: inherit;
  font-weight: var(--wght-medium);
  background-color: ${(props) =>
    !props.$secondary ? "var(--green)" : "var(--background)"};
  color: ${(props) =>
    !props.$secondary ? "var(--background)" : "var(--green)"};
  border: 1px solid var(--green);
  margin: 0 1rem 0 0.5rem;
  cursor: pointer;
  text-decoration: none;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
