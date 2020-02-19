import React from 'react';
import {
  TableCard,
  TableHeader,
  TableContentContainer,
} from '../components/TableComponent/TableComponents';
import ItemDndTypes from '../utils/dndTypes';
import { useDrag, DragSourceMonitor } from 'react-dnd';
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
 * tableDndDetail:tableDndDetailsObj
 * }} props
 */
function TableContainer({ tableDndDetail, children, ...props }) {
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
  return (
    <TableCard
      left={tableDndDetail.left}
      isDragging={isDragging}
      top={tableDndDetail.top}
      ref={preview}>
      <TableHeader ref={drag} bgColor={tableDndDetail.color}>
        {tableDndDetail.tableName}
      </TableHeader>
      <TableContentContainer>{children}</TableContentContainer>
    </TableCard>
  );
}

export default TableContainer;
