import React, { useState } from 'react';
import TableContainer from './TableContainer/TableContainer';
import Grid from './Grid';
import ItemDndTypes from './utils/dndTypes';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { AddAttributeLink } from './components/TableComponent/TableComponents';
import AddAttributeModal from './AddAttributeModal/AddAttributeModal';

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
 * showGrid:boolean,
 * tableDndDetails:tableDndDetailsObj[],
 * onTableDndDetailsChange:Function,
 * }} props
 */
function MainGround({ showGrid, tableDndDetails, onTableDndDetailsChange }) {
  /**
   * @param {tableDndDetailsObj} item
   * @param {number} left
   * @param {number} top
   */
  function moveTable(newItem) {
    const updatedTableDndDetails = tableDndDetails.filter(
      tableDndDetail => tableDndDetail.id !== newItem.id,
    );
    updatedTableDndDetails.push(newItem);
    onTableDndDetailsChange(updatedTableDndDetails);
  }
  const [, drop] = useDrop({
    accept: ItemDndTypes.TABLE,
    /**
     * @param {tableDndDetailsObj} item
     * @param {DropTargetMonitor} monitor
     */
    drop(item, monitor) {
      const Delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + Delta.x);
      const top = Math.round(item.top + Delta.y);
      moveTable({
        id: item.id,
        top,
        left,
        tableName: item.tableName,
        color: item.color,
      });
      return;
    },
  });

  const [showModal, updateShowModal] = useState(false);

  function cancelModalHandler() {
    updateShowModal(false);
  }

  function confirmModalHandler() {
    updateShowModal(false);
  }

  function AddAttributeLinkClickHandler() {
    updateShowModal(true);
  }

  const tables = tableDndDetails.map(tableDndDetail => (
    <TableContainer tableDndDetail={tableDndDetail} key={tableDndDetail.id}>
      <AddAttributeLink
        onClick={AddAttributeLinkClickHandler}
        fontColor={tableDndDetail.color}>
        Add Attribute
      </AddAttributeLink>
      <AddAttributeModal
        showModalState={showModal}
        onModalConfirmed={confirmModalHandler}
        onModalClosed={cancelModalHandler}
        tableName={tableDndDetail.tableName}
      />
    </TableContainer>
  ));
  return (
    <Grid ref={drop} showGrid={showGrid}>
      {tables}
    </Grid>
  );
}

export default MainGround;
