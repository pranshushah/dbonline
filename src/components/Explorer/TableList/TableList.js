import React from 'react';
import '../../../utils/Types';
import Styles from './TableList.module.scss';
/**
 *
 * @param {{
 * children:React.Component[]
 * }} props
 */
function TableList({ children }) {
  return <ul className={Styles.container}>{children}</ul>;
}

export default TableList;
