import Styles from './PrimaryKeyContainer.module.scss';
import React, { useState } from 'react';
/**
 * @param {{
 * show:boolean,
 * }} props
 */

function PrimaryKeyContainer({ children, show }) {
  const [open, setOpen] = useState(false);
  function toogleArrow() {
    setOpen((open) => !open);
  }
  if (!show && open) {
    setOpen(false);
  }
  return (
    <li
      className={
        show ? [Styles.container, Styles.show].join(' ') : Styles.container
      }>
      <span
        onClick={toogleArrow}
        className={
          open
            ? [Styles.liContainer, Styles.down].join(' ')
            : Styles.liContainer
        }>
        primary key
      </span>
      <ul
        className={
          show ? [Styles.container, Styles.show].join(' ') : Styles.container
        }>
        <li
          className={
            open
              ? [Styles.elementShow, Styles.elementContainer].join(' ')
              : Styles.elementContainer
          }>
          {children}
        </li>
      </ul>
    </li>
  );
}

export default PrimaryKeyContainer;
