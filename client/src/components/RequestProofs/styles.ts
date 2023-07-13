import styled from "styled-components/macro";

export const InputWrapper = styled.div`
  margin-bottom: 2rem;
`;

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
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
`;

export const Value = styled.span`
  font-size: 2rem;
  font-weight: 500;
  word-break: break-word;
  color: var(--green);
`;

export const Actions = styled.div`
  margin: 1rem 0;
`;

export const Wrapper = styled.div`
  display: flex;
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
  max-height: 42rem;
  overflow-y: auto;
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

export const LoadingContainer = styled.div`
  margin-top: 1rem;
`;

export const CreatedResultWrapper = styled.div``;

export const ButtonWrapper = styled.div`
  margin-top: 1rem;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: -7px;
  right -20px;
  height: 17px;
  width: 17px;
  padding-left: 5px;
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  background var(--green);
  font-weight: bold;
`;

export const AddedField = styled.span`
  position: relative;
`;

export const AddedFieldDetails = styled.div`
  font-size: 1rem;
  text-overflow: ellipsis;
  overflow: auto;
`;
