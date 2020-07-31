import React, { useState } from 'react';
import '../../../../utils/Types';
import Styles from './TableItem.module.scss';
import AttrAndConstraintList from '../../AttributesAndConstraintList/AttributesAndConstraintList';
/**
 * @param {{
 * table:mainTableDetailsType
 * }} props
 */

function TableItem({ table }) {
  const [open, setOpen] = useState(false);

  function toggleHandle() {
    setOpen((open) => !open);
  }
  return (
    <li className={open ? Styles.itemPaddingContainer : null}>
      <span className={Styles.itemContainer} onClick={toggleHandle}>
        {table.tableName}
      </span>
      <AttrAndConstraintList table={table} show={open} />
    </li>
  );
}

export default TableItem;
