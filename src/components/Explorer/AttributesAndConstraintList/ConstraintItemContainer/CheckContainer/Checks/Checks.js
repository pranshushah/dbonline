import React from 'react';
import Styles from './Checks.module.scss';

/**
 * @param {{
 * table:mainTableDetailsType
 * show:boolean
 * }} props
 */

export default function Checks({ children, show }) {
  return (
    <li
      className={
        show ? [Styles.show, Styles.container].join(' ') : Styles.container
      }>
      {children}
    </li>
  );
}
