import React from 'react';
import {
  TableCard,
  TableHeader,
  TableContentContainer,
} from '../components/TableComponent/TableComponents';
import ItemDndTypes from '../utils/dndTypes';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
/**
 * @typedef {object} tableDndDetailsObj
 * @property {number} top
 * @property {number} left
 * @property {string} tableName
 * @property {string} id
 * @property {string} color
 */

/**
 * @param {{
 * tableDndDetail:tableDndDetailsObj,
 * onEditClick:Function,
 * onDeleteClick:Function,
 * }} props
 */
function TableContainer({
  tableDndDetail,
  children,
  onEditClick,
  onDeleteClick,
  ...props
}) {
  const [{ isDragging }, drag, preview] = useDrag({
    item: { ...tableDndDetail, type: ItemDndTypes.TABLE },
    /**
     * @param {DragSourceMonitor} moniter
     */
    collect(moniter) {
      return {
        isDragging: moniter.isDragging(),
      };
    },
  });
  function editClickHandler() {
    onEditClick();
  }
  function deleteClickHandler() {
    onDeleteClick(tableDndDetail);
  }
  return (
    <TableCard
      left={tableDndDetail.left}
      isDragging={isDragging}
      top={tableDndDetail.top}
      ref={preview}>
      <ContextMenuTrigger id={tableDndDetail.id}>
        <TableHeader ref={drag} bgColor={tableDndDetail.color}>
          {tableDndDetail.tableName}
        </TableHeader>
      </ContextMenuTrigger>
      <TableContentContainer>{children}</TableContentContainer>
      <ContextMenu id={tableDndDetail.id} className={'tableMenu'}>
        <MenuItem className={'menuItem'} onClick={deleteClickHandler}>
          edit table
        </MenuItem>
        <MenuItem className={'menuItem'} onClick={deleteClickHandler}>
          <span>Delete Item </span>
        </MenuItem>
      </ContextMenu>
    </TableCard>
  );
}

export default TableContainer;
