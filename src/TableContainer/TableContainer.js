import React from 'react';
import {
  TableCard,
  TableHeader,
  TableContentContainer,
} from '../components/TableComponent/TableComponents';
import ItemDndTypes from '../utils/dndTypes';
import EditIcon from '../components/UI/editIcon/Edit';
import DeleteIcon from '../components/UI/DeleteIcon/Delete';
import Styles from './TableContainer.module.css';
import Draggable from 'react-draggable';

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
 * moveTable:Function
 * }} props
 */

function TableContainer({
  tableDndDetail,
  children,
  onEditClick,
  moveTable,
  onDeleteClick,
  ...props
}) {
  function editClickHandler() {
    onEditClick(tableDndDetail);
  }
  function deleteClickHandler() {
    onDeleteClick(tableDndDetail);
  }
  function dragHandler(e, data) {
    const newDetail = {
      ...tableDndDetail,
      left: tableDndDetail.left + data.deltaX,
      top: tableDndDetail.top + data.deltaY,
    };
    moveTable(newDetail);
  }
  return (
    <Draggable
      handle={'h3'}
      bounds='main'
      position={{ x: tableDndDetail.left, y: tableDndDetail.top }}
      onStop={dragHandler}
      onDrag={dragHandler}>
      <TableCard {...props}>
        <div
          style={{
            position: 'relative',
            border: '1px solid rgb(66, 66, 66)',
            borderRadius: '1px',
          }}>
          <TableHeader className='.handle' bgColor={tableDndDetail.color}>
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
    </Draggable>
  );
}

export default TableContainer;
