import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import '../../utils/Types';
import TableList from '../Explorer/TableList/TableList';
import Styles from './LeftSidebar.module.scss';
/**
 *
 * @param {{
 * mainTableDetails:mainTableDetailsType[],
 * toggleSidebar:Function
 * }} props
 */

function LeftSideBar({ mainTableDetails, toggleSidebar }) {
  const [width, setWidth] = useState(250);

  function WidthHandler(e, direction, ref, d) {
    setWidth((width) => width + d.width);
  }
  return (
    <Resizable
      className={Styles.resize}
      minWidth='15%'
      maxWidth='20%'
      size={{ width: width, height: '170vh' }}
      onResizeStop={WidthHandler}
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}>
      <div className={Styles.container}>
        <div className={Styles.close} onClick={toggleSidebar} />
        <TableList mainTableDetails={mainTableDetails} />
      </div>
    </Resizable>
  );
}

export default LeftSideBar;
