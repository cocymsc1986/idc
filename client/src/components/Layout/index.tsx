import styled from "styled-components/macro";
import { createGlobalStyle } from "styled-components";

import "@fontsource/rubik/400.css";
import "@fontsource/rubik/variable.css";

import { Sidebar } from "../Sidebar";

export const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <Sidebar />
        <main id="skip">{children}</main>
      </Wrapper>
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  };

  :root {
    --background: #121212;
    --white: #eaeaea;
    --grey: #cfceca;
    --green: #00ca78;
    --red: red;
    --menu-width: 275px;
    --menu-hght-mobile: 60px;
    --wght-bold: 700;
    --wght-medium: 500;
    --wght-light: 300;
  };

  body {
    background-color: var(--background);
    color: var(--grey);
  };

  body, html {
    padding: 0;
    margin: 0;
    font-family: "Rubik", sans-serif;
    font-size: 10px;

    @supports (font-variation-settings: normal) {
      font-family: "RubikVariable";
    };
  };

  main {
    padding: 0 2rem;
    grid-column: 2;

    @media only screen and (max-width: 425px) {
      padding: 1rem;
      grid-column: 1;
      grid-row: 2;
    };
  };

  h1 {
    font-size: 4rem;
    font-weight: var(--wght-bold);
  };

  h2 {
    font-size: 3rem;
    font-weight: var(--wght-light);
  };

  h3 {
    font-size: 2.5rem;
    font-weight: var(--wght-medium);
  };

  h1, h2, h3 {
    color: var(--white);
  };

  p {
    font-size: 1.5rem;
  };
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: var(--menu-width) 1fr;
  height: 100vh;
  font-size: 1.6rem;

  @media only screen and (max-width: 425px) {
    grid-template-columns: none;
    grid-template-rows: var(--menu-hght-mobile) auto;
  } ;
`;
