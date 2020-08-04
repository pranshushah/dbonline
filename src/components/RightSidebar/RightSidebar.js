import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import Styles from './RightSidebar.module.scss';
import EditCheckConstraint from './EditCheckConstraint/EditCheckConstraint';
/**
 * @param {{
 * mainTableDetails:mainTableDetailsType[],
 * toggleSidebar:Function,
 * table:mainTableDetailsType,
 * showCheckConstraint:boolean,
 * checkConstraintName:string,
 * checkExpr:string,
 * onCheckConstraintNameChange:Function,
 * onCheckExprChange:Function,
 * initialCheckConstraintName:string,
 * onCancel:Function,
 * onConfirmCheckConstraintClick:Function,
 * onDeleteCheckConstraint:Function
 * }} props
 */

function SideBar({
  mainTableDetails,
  toggleSidebar,
  table,
  showCheckConstraint,
  checkConstraintName,
  checkExpr,
  onCheckConstraintNameChange,
  onCheckExprChange,
  initialCheckConstraintName,
  onCancel,
  onConfirmCheckConstraintClick,
  onDeleteCheckConstraint,
}) {
  const [width, setWidth] = useState(300);

  function WidthHandler(e, direction, ref, d) {
    setWidth((width) => width + d.width);
  }
  return (
    <Resizable
      className={Styles.resize}
      minWidth='270'
      maxWidth='310'
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
        <div className={Styles.close} onClick={onCancel} />
        <div className={Styles.contentContainer}>
          {showCheckConstraint && (
            <EditCheckConstraint
              table={table}
              checkConstraintName={checkConstraintName}
              checkExpr={checkExpr}
              onCheckConstraintNameChange={onCheckConstraintNameChange}
              onCheckExprChange={onCheckExprChange}
              onCancel={onCancel}
              initialCheckConstraintName={initialCheckConstraintName}
              onConfirmCheckConstraintClick={onConfirmCheckConstraintClick}
              onDeleteCheckConstraint={onDeleteCheckConstraint}
            />
          )}
        </div>
      </div>
    </Resizable>
  );
}

export default SideBar;
