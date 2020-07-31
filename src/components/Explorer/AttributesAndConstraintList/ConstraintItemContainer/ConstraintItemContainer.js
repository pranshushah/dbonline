import Styles from './ConstraintItemContainer.module.scss';
import React, { useState } from 'react';
import PrimaryKey from './PrimaryKeyContainer/PrimaryKeyContainer';
import ForeignKey from './ForeignKeyContainer/ForeignKeyContainer';
import UniqueConstraint from './UniqueContainer/UniqueContainer';
import CheckConstraint from './CheckContainer/CheckContainer';
/**
 * @param {{
 * table:mainTableDetailsType
 * parentShow:boolean,
 * }} props
 */

function ConstraintItemContainer({ table, parentShow }) {
  const [open, setOpen] = useState(false);
  function toogleArrow() {
    setOpen((open) => !open);
  }
  if (!parentShow && open) {
    setOpen(false);
  }
  return (
    <li className={Styles.text}>
      <span
        onClick={toogleArrow}
        className={
          open
            ? [Styles.liContainer, Styles.down].join(' ')
            : Styles.liContainer
        }>
        constraints
      </span>
      <ul className={Styles.container}>
        <PrimaryKey table={table} show={open} />
        <ForeignKey table={table} show={open} />
        <UniqueConstraint table={table} show={open} />
        <CheckConstraint table={table} show={open} />
      </ul>
    </li>
  );
}

export default ConstraintItemContainer;
