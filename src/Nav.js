import React from 'react';
import {
  Navbar,
  NavLogo,
  NavLinksContainer,
  NavLink,
  SubNavLinkContainer,
  SubNavLink,
} from 'react-ui-lib-pranshu';
import AccountStatus from './Navbar/Navbar';

/**
 * @param {{showGrid:boolean,
 * showSideBar:boolean,
 * onGridClick:Function,
 * onCreateTableClick:Function,
 * onSideBarClick:Function}} props
 */

function Nav(props) {
  return (
    <Navbar style={{ width: '100%' }}>
      <NavLogo>DB ONLINE</NavLogo>
      <NavLinksContainer>
        <NavLink text='Insert'>
          <SubNavLinkContainer>
            <SubNavLink onClick={props.onCreateTableClick} text='add Table' />
            <SubNavLink text='add Todo' />
          </SubNavLinkContainer>
        </NavLink>
        <NavLink text='View'>
          <SubNavLinkContainer>
            <SubNavLink
              text={props.showGrid ? 'hide grid' : 'show grid'}
              onClick={props.onGridClick}
            />
            <SubNavLink
              text={props.showSideBar ? 'hide sidebar' : 'show sidebar'}
              onClick={props.onSideBarClick}
            />
          </SubNavLinkContainer>
        </NavLink>
        <NavLink text='download' />
        <NavLink text='About' />
      </NavLinksContainer>
      <AccountStatus>Login/Signup</AccountStatus>
    </Navbar>
  );
}

export default Nav;
