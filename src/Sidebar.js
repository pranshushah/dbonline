import React, { useState } from "react";
import { Resizable } from "re-resizable";

/**
 *
 * @param {{
 * }} props
 */

function SideBar(props) {
  const [width, setWidth] = useState(300);

  function WidthHandler(e, direction, ref, d) {
    setWidth(width => width + d.width);
  }
  return (
    <Resizable
      style={{
        display: "flex",
        alignItems: "stretch",
        border: "3px solid black",
        zIndex: 5
      }}
      minWidth="10%"
      maxWidth="45%"
      size={{ width: width, height: "170vh" }}
      onResizeStop={WidthHandler}
      enable={{
        top: false,
        right: false,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false
      }}
    >
      <div
        style={{
          width: "100%",
          marginLeft: "5px",
          zIndex: 5,
          backgroundColor: "black"
        }}
      />
    </Resizable>
  );
}

export default SideBar;
