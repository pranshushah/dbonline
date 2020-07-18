import React from 'react';
import {
  TableCard,
  TableHeader,
  TableContentContainer,
} from '../components/TableComponent/TableComponents';
import ItemDndTypes from '../utils/dndTypes';
import EditIcon from '../components/UI/editIcon/Edit';
import DeleteIcon from '../components/UI/DeleteIcon/Delete';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import Styles from './TableContainer.module.css';
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
    onEditClick(tableDndDetail);
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
      <div
        style={{
          position: 'relative',
          border: '1px solid rgb(66, 66, 66)',
          borderRadius: '1px',
        }}>
        <TableHeader ref={drag} bgColor={tableDndDetail.color}>
          {tableDndDetail.tableName}
        </TableHeader>
        <span className={Styles.edit} onClick={editClickHandler}>
          <EditIcon />
        </span>
        <span className={Styles.delete} onClick={deleteClickHandler}>
          <DeleteIcon />
        </span>
        <TableContentContainer>{children}</TableContentContainer>
      </div>
    </TableCard>
  );
}

export default TableContainer;
