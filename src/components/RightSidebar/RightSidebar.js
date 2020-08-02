import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import Styles from './RightSidebar.module.scss';

/**
 * @param {{
 * mainTableDetails:mainTableDetailsType[],
 * toggleSidebar:Function
 * }} props
 */

function SideBar({ mainTableDetails, toggleSidebar }) {
  const [width, setWidth] = useState(300);

  function WidthHandler(e, direction, ref, d) {
    setWidth((width) => width + d.width);
  }
  return (
    <Resizable
      className={Styles.resize}
      minWidth='15%'
      maxWidth='22%'
      size={{ width: width, height: '170vh' }}
      onResizeStop={WidthHandler}
      enable={{
        top: false,
        right: false,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}>
      <div className={Styles.container}>
        <div className={Styles.close} onClick={toggleSidebar} />
      </div>
    </Resizable>
  );
}

export default SideBar;
