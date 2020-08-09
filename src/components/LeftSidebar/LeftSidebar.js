import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import '../../utils/Types';
import TableList from '../Explorer/TableList/TableList';
import Styles from './LeftSidebar.module.scss';
import TableItem from '../Explorer/TableList/TableItem/TableItem';
/**
 * @param {{
 * mainTableDetails:mainTableDetailsType[],
 * toggleSidebar:Function,
 * onItemClicked:Function,
 * onMainTableDetailsChange:Function,
 * }} props
 */

function LeftSideBar({
  mainTableDetails,
  toggleSidebar,
  onItemClicked,
  onMainTableDetailsChange,
}) {
  const [width, setWidth] = useState(250);

  function WidthHandler(e, direction, ref, d) {
    setWidth((width) => width + d.width);
  }
  const list = mainTableDetails.map((table) => (
    <TableItem key={table.id} table={table} onItemClicked={onItemClicked} />
  ));
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
        <TableList
          mainTableDetails={mainTableDetails}
          onMainTableDetailsChange={onMainTableDetailsChange}>
          {list}
        </TableList>
      </div>
    </Resizable>
  );
}

export default LeftSideBar;
