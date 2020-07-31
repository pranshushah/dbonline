import React from 'react';
import '../../../../utils/Types';
import Styles from './AttributeItem.module.scss';
/**
 * @param {{
 * attr:attributeObj,
 * show:boolean
 * }} props
 */

function attrItem({ attr, show }) {
  return (
    <li
      className={
        show ? [Styles.show, Styles.container].join(' ') : Styles.container
      }>
      {attr.name}
    </li>
  );
}

export default attrItem;
