import React from 'react';
import {
  NavLink,
  SubMenuContiainer,
  SubNavLink,
} from './components/UI/Navbar/NavLink/NavLink';
import NavbarContainer from './components/UI/Navbar/NavContainer';
import NavLogo from './components/UI/Navbar/NavLogo/NavLogo';
import NavLinksContainer from './components/UI/Navbar/NavLinksContainer/NavLinksContainer';
import './utils/Types';
import { code } from './utils/helper-function/createCode';

/**
 * @param {{showGrid:boolean,
 * showSideBar:boolean,
 * mainTableDetails:mainTableDetailsType[],
 * onGridClick:Function,
 * onCreateTableClick:Function,
 * onSideBarClick:Function}} props
 */

function Nav({ mainTableDetails, ...props }) {
  function createPDf() {
    window.print();
  }

  return (
    <NavbarContainer>
      <NavLogo text='DB ONLINE' />
      <NavLinksContainer>
        <NavLink text='Insert'>
          <SubMenuContiainer>
            <SubNavLink
              onClick={props.onCreateTableClick}
              text='add Table'
              shortcut={'alt + t'}
            />
            <SubNavLink text='add Todo' />
          </SubMenuContiainer>
        </NavLink>
        <NavLink text='View'>
          <SubMenuContiainer>
            <SubNavLink
              text={props.showGrid ? 'hide grid' : 'show grid'}
              onClick={props.onGridClick}
              shortcut={'alt + g'}
            />
            <SubNavLink
              text={props.showSideBar ? 'hide sidebar' : 'show sidebar'}
              onClick={props.onSideBarClick}
              shortcut={'alt + s'}
            />
          </SubMenuContiainer>
        </NavLink>
        <NavLink text='download'>
          <SubMenuContiainer>
            <SubNavLink
              text='export as PDF'
              onClick={createPDf}
              shortcut={'alt + p'}
            />
            <SubNavLink
              text='export as Code'
              onClick={() => code(mainTableDetails)}
              shortcut={'alt + c'}
            />
          </SubMenuContiainer>
        </NavLink>
        <NavLink text='Guest' />
      </NavLinksContainer>
    </NavbarContainer>
  );
}

export default Nav;
