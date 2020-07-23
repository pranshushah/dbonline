import React from 'react';
import {
  NavLink,
  SubMenuContiainer,
  SubNavLink,
} from './components/UI/Navbar/NavLink/NavLink';

import NavbarContainer from './components/UI/Navbar/NavContainer';
import NavLogo from './components/UI/Navbar/NavLogo/NavLogo';
import NavLinksContainer from './components/UI/Navbar/NavLinksContainer/NavLinksContainer';
/**
 * @param {{showGrid:boolean,
 * showSideBar:boolean,
 * onGridClick:Function,
 * onCreateTableClick:Function,
 * onSideBarClick:Function}} props
 */

function Nav(props) {
  return (
    <NavbarContainer>
      <NavLogo text='DB ONLINE' />
      <NavLinksContainer>
        <NavLink text='Insert'>
          <SubMenuContiainer>
            <SubNavLink onClick={props.onCreateTableClick} text='add Table' />
            <SubNavLink text='add Todo' />
          </SubMenuContiainer>
        </NavLink>
        <NavLink text='View'>
          <SubMenuContiainer>
            <SubNavLink
              text={props.showGrid ? 'hide grid' : 'show grid'}
              onClick={props.onGridClick}
            />
            <SubNavLink
              text={props.showSideBar ? 'hide sidebar' : 'show sidebar'}
              onClick={props.onSideBarClick}
            />
          </SubMenuContiainer>
        </NavLink>
        <NavLink text='download' />
        <NavLink text='Login/Signup' />
      </NavLinksContainer>
    </NavbarContainer>
  );
}

export default Nav;
