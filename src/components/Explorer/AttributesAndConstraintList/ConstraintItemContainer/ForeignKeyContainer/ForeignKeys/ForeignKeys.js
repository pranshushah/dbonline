import React from 'react';
import Styles from './ForeignKeys.module.scss';

/**
 * @param {{
 * table:mainTableDetailsType
 * show:boolean,
 * item:object,
 * onItemClicked:Function
 * }} props
 */

export default function ForeignKeys({ children, show, item, onItemClicked }) {
  return (
    <li
      className={
        show ? [Styles.show, Styles.container].join(' ') : Styles.container
      }>
      {children}
    </li>
  );
}
