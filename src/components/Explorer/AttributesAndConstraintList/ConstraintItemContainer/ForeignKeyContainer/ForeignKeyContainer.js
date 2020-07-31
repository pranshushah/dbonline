import Styles from './ForeignKeyContainer.module.scss';
import React, { useState } from 'react';
import ForeignKeys from './ForeignKeys/ForeignKeys';
/**
 * @param {{
 * table:mainTableDetailsType
 * show:boolean,
 * }} props
 */

function ForeignKeyContainer({ table, show }) {
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
        foreign keys
      </span>
      <ul
        className={
          show ? [Styles.show, Styles.container].join(' ') : Styles.container
        }>
        <ForeignKeys table={table} show={open} />
      </ul>
    </li>
  );
}

export default ForeignKeyContainer;
