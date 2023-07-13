import styled from "styled-components/macro";

export const Wrapper = styled.div`
  max-width: 1100px;
`;

export const ButtonWrapper = styled.div`
  margin: 2rem 0;
`;

export const Statistic = styled.div`
  display: inline-block;
  border: 3px dashed var(--green);
  border-radius: 12px;
  padding: 3rem;
  padding-bottom: 2rem;
  text-align: center;
  margin: 1rem 2rem;
  background-color: #222222;

  &:first-child {
    margin-left: 0;
  }
`;

export const StatInfo = styled.p`
  font-size: 2rem;
  font-weight: var(--wght-light);
  margin: 0;
`;

export const StatNumber = styled.span`
  display: block;
  font-size: 5rem;
  font-weight: var(--wght-bold);
  padding-bottom: 1rem;
  color: var(--white);
  line-height: 5rem;
`;

export const H3 = styled.h3`
  margin-bottom: 0;
`;
