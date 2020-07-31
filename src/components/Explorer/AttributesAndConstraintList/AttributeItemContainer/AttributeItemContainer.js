import Styles from './AttributeItemContainer.module.scss';
import React, { useState } from 'react';
import AttrItem from '../AttributeItem/AttributeItem';
/**
 * @param {{
 * table:mainTableDetailsType,
 * parentShow:boolean
 * }} props
 */

function AttrListContainer({ table, parentShow }) {
  const [open, setOpen] = useState(false);
  function toogleArrow() {
    setOpen((open) => !open);
  }
  if (!parentShow && open) {
    setOpen(false);
  }
  const attrsItems = table.attributes.map((attrObj) => (
    <AttrItem key={attrObj.id} attr={attrObj} show={open} />
  ));
  return (
    <li className={Styles.text}>
      <span
        onClick={toogleArrow}
        className={
          open
            ? [Styles.liContainer, Styles.down].join(' ')
            : Styles.liContainer
        }>
        attributes
      </span>
      <ul className={Styles.container}>{attrsItems}</ul>
    </li>
  );
}

export default AttrListContainer;
