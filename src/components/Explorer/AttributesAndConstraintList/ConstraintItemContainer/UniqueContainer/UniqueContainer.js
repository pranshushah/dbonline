import Styles from './Unique.module.scss';
import React, { useState } from 'react';
import Uniques from './Uniques/Uniques';
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
        unique constraints
      </span>
      <ul
        className={
          show ? [Styles.show, Styles.container].join(' ') : Styles.container
        }>
        <Uniques table={table} show={open} />
      </ul>
    </li>
  );
}

export default PrimaryKeyContainer;
