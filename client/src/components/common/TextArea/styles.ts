import styled from "styled-components/macro";

export const Label = styled.label`
  display: block;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export const StyledTextArea = styled.textarea<{ minHeight: string }>`
  padding: 1rem;
  font-size: 1.6rem;
  border: 1px solid var(--green);
  border-radius: 1rem;
  width: 100%;
  max-width: 70rem;
  min-height: ${(props) => props.minHeight};

  &:disabled {
    background-color: white;
    color: grey;
  }
`;
