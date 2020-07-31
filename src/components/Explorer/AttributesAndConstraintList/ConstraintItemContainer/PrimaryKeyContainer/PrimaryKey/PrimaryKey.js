import React from 'react';
import '../../../../../../utils/Types';
import Styles from './PrimaryKey.module.scss';
/**
 * @param {{
 * table:mainTableDetailsType
 * show:boolean
 * }} props
 */

function PrimaryKey({ table, show }) {
  return (
    <li
      className={
        show ? [Styles.show, Styles.container].join(' ') : Styles.container
      }>
      {table.tableLevelConstraint?.PRIMARYKEY?.constraintName}
    </li>
  );
}

export default PrimaryKey;
