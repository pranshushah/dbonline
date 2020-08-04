import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import Styles from './RightSidebar.module.scss';
import EditCheckConstraint from './EditCheckConstraint/EditCheckConstraint';
import EditUniqueConstraint from './EditUniqueConstraint/EditUniqueConstraint';
/**
 * @param {{
 * mainTableDetails:mainTableDetailsType[],
 * toggleSidebar:Function,
 * table:mainTableDetailsType,
 * showCheckConstraint:boolean,
 * constraintName:string,
 * checkExpr:string,
 * onConstraintNameChange:Function,
 * onCheckExprChange:Function,
 * initialCheckConstraintName:string,
 * onCancel:Function,
 * onConfirmCheckConstraintClick:Function,
 * onDeleteCheckConstraint:Function,
 * showUniqueConstraint:boolean,
 * initialUniqueConstraintName:string,
 * selectedTableUnique:Array,
 * onTableLevelUniqueChange:Array,
 * onDeleteUniqueConstraint:Function,
 * onConfirmUniqueConstraintClick:Function
 * }} props
 */

function SideBar({
  mainTableDetails,
  toggleSidebar,
  table,
  showCheckConstraint,
  constraintName,
  checkExpr,
  onConstraintNameChange,
  onCheckExprChange,
  initialCheckConstraintName,
  onCancel,
  onConfirmCheckConstraintClick,
  onDeleteCheckConstraint,
  showUniqueConstraint,
  initialUniqueConstraintName,
  selectedTableUnique,
  onTableLevelUniqueChange,
  onDeleteUniqueConstraint,
  onConfirmUniqueConstraintClick,
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
              checkConstraintName={constraintName}
              checkExpr={checkExpr}
              onCheckConstraintNameChange={onConstraintNameChange}
              onCheckExprChange={onCheckExprChange}
              onCancel={onCancel}
              initialCheckConstraintName={initialCheckConstraintName}
              onConfirmCheckConstraintClick={onConfirmCheckConstraintClick}
              onDeleteCheckConstraint={onDeleteCheckConstraint}
            />
          )}
          {showUniqueConstraint && (
            <EditUniqueConstraint
              table={table}
              uniqueConstraintName={constraintName}
              initialUniqueConstraintName={initialUniqueConstraintName}
              onUniqueConstraintNameChange={onConstraintNameChange}
              selectedTableUnique={selectedTableUnique}
              onTableLevelUniqueChange={onTableLevelUniqueChange}
              onCancel={onCancel}
              onDeleteUniqueConstraint={onDeleteUniqueConstraint}
              onConfirmUniqueConstraintClick={onConfirmUniqueConstraintClick}
            />
          )}
        </div>
      </div>
    </Resizable>
  );
}

export default SideBar;
