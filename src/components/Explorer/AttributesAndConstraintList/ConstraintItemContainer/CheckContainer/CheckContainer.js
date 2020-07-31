import Styles from './Check.module.scss';
import React, { useState } from 'react';
import Checks from './Checks/Checks';
/**
 * @param {{
 * table:mainTableDetailsType
 * show:boolean,
 * }} props
 */

function PrimaryKeyContainer({ table, show }) {
  const [open, setOpen] = useState(false);
  function toogleArrow() {
    setOpen((open) => !open);
  }
  if (!show && open) {
    setOpen(false);
  }
  return (
    <li
      onClick={toogleArrow}
      className={
        show ? [Styles.container, Styles.show].join(' ') : Styles.container
      }>
      <span
        className={
          open
            ? [Styles.liContainer, Styles.down].join(' ')
            : Styles.liContainer
        }>
        check constraint
      </span>
      <ul
        className={
          show ? [Styles.show, Styles.container].join(' ') : Styles.container
        }>
        <Checks table={table} show={open} />
      </ul>
    </li>
  );
}

export default PrimaryKeyContainer;
