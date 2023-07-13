import styled from "styled-components/macro";

export const SearchContainer = styled.div`
  margin: 2rem 0;
`;

export const SearchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const H3 = styled.h3`
  margin: 0;
`;

export const Input = styled.input`
  border: 1px solid var(--green);
  border-radius: 10px;
  font-size: 2rem;
  padding: 0.75rem 1.25rem;
  max-width: 380px;
  width: 100%;

  ::placeholder {
    opacity: 0.6;
  }
`;

export const HiddenLabel = styled.label`
  :not(:focus):not(:active) {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;

export const PageInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;
