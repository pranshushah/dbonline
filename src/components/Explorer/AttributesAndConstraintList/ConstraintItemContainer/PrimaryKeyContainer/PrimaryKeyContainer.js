import Styles from './PrimaryKeyContainer.module.scss';
import React, { useState } from 'react';
import PrimaryKey from './PrimaryKey/PrimaryKey';
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
        primary key
      </span>
      <ul
        className={
          show ? [Styles.container, Styles.show].join(' ') : Styles.container
        }>
        <PrimaryKey show={open} table={table} />
      </ul>
    </li>
  );
}

export default PrimaryKeyContainer;
