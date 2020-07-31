import React from 'react';
import '../../../utils/Types';
import Styles from './TableList.module.scss';
import TableItem from './TableItem/TableItem';
/**
 *
 * @param {{
 * mainTableDetails:mainTableDetailsType[]
 * }} props
 */
function TableList({ mainTableDetails }) {
  const list = mainTableDetails.map((table) => (
    <TableItem key={table.id} table={table} />
  ));
  return <ul className={Styles.container}>{list}</ul>;
}

export default TableList;
