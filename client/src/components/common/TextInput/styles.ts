import styled from "styled-components/macro";

export const Label = styled.label`
  display: block;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export const StyledTextInput = styled.input`
  padding: 1rem;
  font-size: 1.8rem;
  border: 1px solid var(--green);
  border-radius: 1rem;
  width: 100%;
  max-width: 70rem;

  &:disabled {
    background-color: white;
    color: grey;
  }
`;
