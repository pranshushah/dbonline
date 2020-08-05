import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import Styles from './RightSidebar.module.scss';
import EditCheckConstraint from './EditCheckConstraint/EditCheckConstraint';
import EditUniqueConstraint from './EditUniqueConstraint/EditUniqueConstraint';
import EditForeignConstraint from './EditForeignConstraint/EditForeignConstraint';
/**
 * @param {{
 * mainTableDetails:mainTableDetailsType[],
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
 * selectedMultipleSelect:Array,
 * onMultipleSelectChange:Function,
 * onDeleteUniqueConstraint:Function,
 * onConfirmUniqueConstraintClick:Function,
 * showPrimaryConstraint:boolean,
 * initialPrimaryConstraintName:string,
 * onDeletePrimaryConstraint:Function,
 * onConfirmPrimaryConstraintClick:Function,
 * referencedAtt:object,
 * referencingTable:object,
 * referencingAtt:object,
 * initialForeignConstraintName:string,
 * showForeignConstraint:boolean,
 * onReferencedAttChange:Function,
 * onReferencingAttChange:Function,
 * onReferencingTableChange:Function,
 * onDeleteForeignConstraint:Function,
 * onConfirmForeignConstraintClick:Function,
 * foreignCheckedItem:Function,
 * onForeignCheckedItem:Function,
 * }} props
 */

function SideBar({
  mainTableDetails,
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
  selectedMultipleSelect,
  onMultipleSelectChange,
  onDeleteUniqueConstraint,
  onConfirmUniqueConstraintClick,
  showPrimaryConstraint,
  initialPrimaryConstraintName,
  onDeletePrimaryConstraint,
  onConfirmPrimaryConstraintClick,
  referencedAtt,
  referencingTable,
  referencingAtt,
  initialForeignConstraintName,
  showForeignConstraint,
  onReferencedAttChange,
  onReferencingAttChange,
  onReferencingTableChange,
  onDeleteForeignConstraint,
  onConfirmForeignConstraintClick,
  foreignCheckedItem,
  onForeignCheckedItem,
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
              selectedTableUnique={selectedMultipleSelect}
              onTableLevelUniqueChange={onMultipleSelectChange}
              onCancel={onCancel}
              onDeleteUniqueConstraint={onDeleteUniqueConstraint}
              onConfirmUniqueConstraintClick={onConfirmUniqueConstraintClick}
            />
          )}
          {showPrimaryConstraint && (
            <EditUniqueConstraint
              table={table}
              uniqueConstraintName={constraintName}
              initialUniqueConstraintName={initialPrimaryConstraintName}
              onUniqueConstraintNameChange={onConstraintNameChange}
              selectedTableUnique={selectedMultipleSelect}
              onTableLevelUniqueChange={onMultipleSelectChange}
              onCancel={onCancel}
              onDeleteUniqueConstraint={onDeletePrimaryConstraint}
              onConfirmUniqueConstraintClick={onConfirmPrimaryConstraintClick}
            />
          )}
          {showForeignConstraint && (
            <EditForeignConstraint
              mainTableDetails={mainTableDetails}
              table={table}
              foreignConstraintName={constraintName}
              onForeignConstraintNameChange={onConstraintNameChange}
              onCancel={onCancel}
              referencedAtt={referencedAtt}
              referencingTable={referencingTable}
              referencingAtt={referencingAtt}
              onReferencedAttChange={onReferencedAttChange}
              onReferencingAttChange={onReferencingAttChange}
              onReferencingTableChange={onReferencingTableChange}
              initialForeignConstraintName={initialForeignConstraintName}
              onDeleteForeignConstraint={onDeleteForeignConstraint}
              onConfirmForeignConstraintClick={onConfirmForeignConstraintClick}
              onForeignCheckedItem={onForeignCheckedItem}
              foreignCheckedItem={foreignCheckedItem}
            />
          )}
        </div>
      </div>
    </Resizable>
  );
}

export default SideBar;
