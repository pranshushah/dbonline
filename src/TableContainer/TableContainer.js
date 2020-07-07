import React from 'react';
import {
  TableCard,
  TableHeader,
  TableContentContainer,
} from '../components/TableComponent/TableComponents';
import ItemDndTypes from '../utils/dndTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
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

function EditButton() {
  return (
    <span className={Styles.edit}>
      <FontAwesomeIcon icon={faPencilAlt} size='xs' />
    </span>
  );
}

function DeleteButton() {
  return (
    <span className={Styles.delete}>
      <FontAwesomeIcon icon={faTrash} size='xs' />
    </span>
  );
}

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
    console.log('boom');
    onDeleteClick(tableDndDetail);
  }
  return (
    <TableCard
      left={tableDndDetail.left}
      isDragging={isDragging}
      top={tableDndDetail.top}
      ref={preview}>
      <div style={{ position: 'relative' }}>
        <TableHeader ref={drag} bgColor={tableDndDetail.color}>
          {tableDndDetail.tableName}
        </TableHeader>
        <span className={Styles.edit} onClick={editClickHandler}>
          <FontAwesomeIcon icon={faPencilAlt} size='xs' />
        </span>
        <span className={Styles.delete} onClick={deleteClickHandler}>
          <FontAwesomeIcon icon={faTrash} size='xs' />
        </span>
        <TableContentContainer>{children}</TableContentContainer>
      </div>
    </TableCard>
  );
}

export default TableContainer;
