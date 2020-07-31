import React from 'react';
import Styles from './Uniques.module.scss';

/**
 * @param {{
 * table:mainTableDetailsType
 * show:boolean
 * }} props
 */

export default function Uniques({ table, show }) {
  const keys = table.tableLevelConstraint?.UNIQUETABLELEVEL.map(
    (checkObj, index) => (
      <li
        key={index}
        className={
          show ? [Styles.show, Styles.container].join(' ') : Styles.container
        }>
        {checkObj.constraintName}
      </li>
    ),
  );
  return keys;
}
