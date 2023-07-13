import styled from "styled-components/macro";

export const Wrapper = styled.div`
  display: flex;
`;

export const ButtonWrapper = styled.div`
  margin: 1rem 0;
`;

export const FormContainer = styled.div`
  @media only screen and (min-width: 521px) {
    width: 55%;
  }
`;

export const ResultContainer = styled.div`
  @media only screen and (min-width: 521px) {
    padding: 0 4rem 0 2rem;
    width: 45%;
  }
`;

export const ResultHeader = styled.h5`
  font-size: 2rem;
  margin: 0 0 1rem;
`;

export const ResultWrapper = styled.div`
  min-height: 25%;
  margin-bottom: 2rem;
`;

export const ResultLabel = styled.span`
  display: block;
  margin-bottom: 1rem;
`;

export const ResultValue = styled.span`
  word-break: break-all;
  font-size: 2rem;
  font-weight: bold;
`;

export const CopyButtonWrapper = styled.div`
  margin-top: 1rem;
`;
