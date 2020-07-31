import React from 'react';
import '../../../utils/Types';
import Styles from './AttributesAndConstraintList.module.scss';
import AttributeItemContainer from './AttributeItemContainer/AttributeItemContainer';
import ConstraintItemContainer from './ConstraintItemContainer/ConstraintItemContainer';
/**
 * @param {{
 * table:mainTableDetailsType
 * show:boolean
 * }} props
 */

function AttrList({ table, show }) {
  return (
    <ul
      className={
        show ? [Styles.container, Styles.show].join(' ') : Styles.container
      }>
      <AttributeItemContainer table={table} parentShow={show} />
      <ConstraintItemContainer table={table} parentShow={show} />
    </ul>
  );
}

export default AttrList;
