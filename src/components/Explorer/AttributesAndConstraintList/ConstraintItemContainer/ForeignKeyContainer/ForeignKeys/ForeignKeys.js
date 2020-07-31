import React from 'react';
import Styles from './ForeignKeys.module.scss';

/**
 * @param {{
 * table:mainTableDetailsType
 * show:boolean
 * }} props
 */

export default function ForeignKeys({ table, show }) {
  const keys = table.tableLevelConstraint?.FOREIGNKEY.map(
    (foreignObj, index) => (
      <li
        key={index}
        className={
          show ? [Styles.show, Styles.container].join(' ') : Styles.container
        }>
        {foreignObj.constraintName}
      </li>
    ),
  );
  return keys;
}
