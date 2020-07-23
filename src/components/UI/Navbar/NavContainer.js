import React from 'react';
import Styles from './NavContainer.module.scss';

function NavContainer({ children }) {
  return <nav className={Styles.headerContainer}>{children}</nav>;
}

export default NavContainer;
