import React from 'react';
import {
  NavLink,
  SubMenuContiainer,
  SubNavLink,
} from './components/UI/Navbar/NavLink/NavLink';
import NavbarContainer from './components/UI/Navbar/NavContainer';
import NavLogo from './components/UI/Navbar/NavLogo/NavLogo';
import NavLinksContainer from './components/UI/Navbar/NavLinksContainer/NavLinksContainer';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';

/**
 * @param {{showGrid:boolean,
 * showSideBar:boolean,
 * onGridClick:Function,
 * onCreateTableClick:Function,
 * onSideBarClick:Function}} props
 */

function Nav({ Main, mainTableDetails, tableDndDetails, ...props }) {
  function createPDf() {
    window.print();
    window.onafterprint = function (e) {
      console.log(e);
    };
  }
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
        <NavLink text='download'>
          <SubMenuContiainer>
            <SubNavLink text='as PDF' onClick={createPDf} />
            <SubNavLink text='as Code' />
          </SubMenuContiainer>
        </NavLink>
        <NavLink text='code' />
        <NavLink text='Guest' />
      </NavLinksContainer>
    </NavbarContainer>
  );
}

export default Nav;
