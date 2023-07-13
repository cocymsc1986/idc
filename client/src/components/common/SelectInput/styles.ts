import styled from "styled-components/macro";

import dropdownArrow from "../../../images/dropdown-arrow.svg";

export const Label = styled.label`
  display: block;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export const StyledSelectInput = styled.select`
  padding: 1rem 3rem 1rem 1rem;
  font-size: 1.8rem;
  border: 1px solid var(--green);
  border-radius: 1rem;
  width: 100%;
  max-width: 70rem;
  cursor: pointer;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-image: url(${dropdownArrow});
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.3rem;

  &:-ms-expand {
    display: none;
  }
`;
