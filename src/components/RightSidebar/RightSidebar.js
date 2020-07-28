import React, { useState } from 'react';
import { Resizable } from 're-resizable';

/**
 *
 * @param {{
 * }} props
 */

function SideBar(props) {
  const [width, setWidth] = useState(280);

  function WidthHandler(e, direction, ref, d) {
    setWidth((width) => width + d.width);
  }
  return (
    <Resizable
      style={{
        display: 'flex',
        borderLeft: '2px solid black',
      }}
      minWidth='15%'
      maxWidth='20%'
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
      <div
        style={{
          width: '100%',
          backgroundColor: '#F5F5F5',
        }}
      />
    </Resizable>
  );
}

export default SideBar;
