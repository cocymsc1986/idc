import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components/macro";

import logo from "../../images/logo.png";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  let timeout = null;

  const onBlurHandler = () => {
    timeout = setTimeout(() => {
      setIsOpen(false);
    });
  };

  const onFocusHandler = () => {
    clearTimeout(timeout);
  };

  return (
    <StyledSidebar
      /* these three handle closing nav on no focus for mobile */
      onBlur={() => onBlurHandler()}
      onFocus={() => onFocusHandler()}
      isMobileOpen={isOpen}
    >
      <SkipLink href="#skip">Skip to main content</SkipLink>
      <ToggleContainer>
        <H1>
          <Link to="/">
            <Image src={logo} alt="ID Crypt Global" />
          </Link>
        </H1>
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={`Toggle Navigation`}
          aria-expanded={isOpen}
        >
          <Toggle />
        </Button>
      </ToggleContainer>
      <Navigation isMobileOpen={isOpen}>
        <List>
          <ListItem>
            <StyledLink to="/">Agent Dashboard</StyledLink>
          </ListItem>
          <ListItem>
            <StyledLink to="/connections">Connections</StyledLink>
          </ListItem>
          <ListItem>
            <StyledLink to="/messaging">Messaging</StyledLink>
          </ListItem>
          <ListItem>
            <StyledLink to="/credentials">Credentials</StyledLink>
          </ListItem>
          <ListItem>
            <StyledLink to="/esg">ESG</StyledLink>
          </ListItem>
          <ListItem>
            <StyledLink to="/discover">Discover</StyledLink>
          </ListItem>
        </List>
      </Navigation>
    </StyledSidebar>
  );
};

const SkipLink = styled.a`
  position: absolute;
  top: -1000%;

  &:focus {
    top: 0;
    left: 0;
    width: 100%;
    background-color: var(--green);
    color: var(--background);
    padding: 1rem 2rem;
    text-align: center;
    text-decoration: none;
    z-index: 4;
  }
`;

const StyledSidebar = styled.header`
  /* for expanding/closing navigation on mobile: */
  --mobile-nav-anim: 0.75s;

  position: fixed;
  width: var(--menu-width);
  height: 100%;
  padding: 3rem;
  background-color: var(--background);
  border-right: 1px solid var(--white);
  z-index: 1;

  @media only screen and (max-width: 425px) {
    width: 100%;
    height: ${(props) =>
      props.isMobileOpen ? "100%" : "var(--menu-hght-mobile)"};
    padding: 0rem;
    border-right: none;
    transition: height var(--mobile-nav-anim);
    overflow: hidden;
    text-transform: uppercase;
  } ;
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: space-between;

  @media only screen and (max-width: 425px) {
    box-shadow: inset 0 -10px 1px -10px white;
    padding: 1rem;
  } ;
`;

const H1 = styled.h1`
  margin: 0;
`;

const Image = styled.img`
  width: 100%;
  max-width: 160px;
  display: block;

  @media only screen and (max-width: 425px) {
    max-width: 100px;
  } ;
`;

const Button = styled.button`
  display: none;
  background: transparent;
  color: var(--white);
  border: none;
  padding: 0;
  padding-left: 1rem;

  @media only screen and (max-width: 425px) {
    display: block;
  } ;
`;

const Toggle = styled.span`
  display: inline-block;
  width: 30px;
  height: 30px;
  vertical-align: middle;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100%;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.55%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
`;

const Navigation = styled.nav`
  margin-top: 1rem;

  @media only screen and (max-width: 425px) {
    visibility: ${(props) => (!props.isMobileOpen ? "hidden" : "initial")};
    transition: visibility var(--mobile-nav-anim); // syncs visibility on focus tree with Header's height animation
    padding: 0rem 1rem;
  } ;
`;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 1.5rem 0;
  font-size: 1.5rem;

  :first-child {
    padding-top: 3rem;

    @media only screen and (max-width: 425px) {
      padding-top: 1rem;
    }
  }

  @media only screen and (max-width: 425px) {
    font-size: 1.25rem;
  } ;
`;

const StyledLink = styled(NavLink)`
  display: flex;
  color: var(--green);
  text-decoration: none;
  transition: all 0.15s ease-out;
  align-items: center;

  ::after {
    content: "";
    width: 0.5em;
    height: 0.5em;
    background-color: var(--green);
    mask: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDI5OSA1MzUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM6c2VyaWY9Imh0dHA6Ly93d3cuc2VyaWYuY29tLyIgc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxLjU7Ij4KICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsLTExNDkuODUsLTkxMy42MzIpIj4KICAgICAgICA8cGF0aCBkPSJNMTE4MS4xLDk0NC44ODJMMTQxNy4zMiwxMTgxLjFMMTE4MS4xLDE0MTcuMzIiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOndoaXRlO3N0cm9rZS13aWR0aDo2Mi41cHg7Ii8+CiAgICA8L2c+Cjwvc3ZnPgo=")
      no-repeat;
    transition: all 0.15s ease-out;
    margin-left: 0.5rem;
  }

  &:hover {
    color: var(--white);
    transition: all 0.25s ease-out;
  }

  &:hover::after {
    background-color: var(--white);
    transition: all 0.25s ease-out;
  }

  &[class*="active"] {
    color: var(--white);

    ::after {
      background-color: var(--white);
    }
  }
`;
