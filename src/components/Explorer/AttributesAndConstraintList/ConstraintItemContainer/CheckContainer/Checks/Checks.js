import React from 'react';
import Styles from './Checks.module.scss';

/**
 * @param {{
 * table:mainTableDetailsType
 * show:boolean
 * }} props
 */

export default function Checks({ table, show }) {
  const keys = table.tableLevelConstraint?.CHECK.map((checkObj, index) => (
    <li
      key={index}
      className={
        show ? [Styles.show, Styles.container].join(' ') : Styles.container
      }>
      {checkObj.constraintName}
    </li>
  ));
  return keys;
}
