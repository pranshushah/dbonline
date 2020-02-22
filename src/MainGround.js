import React, { useState } from 'react';
import TableContainer from './TableContainer/TableContainer';
import Grid from './Grid';
import ItemDndTypes from './utils/dndTypes';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { AddAttributeLink } from './components/TableComponent/TableComponents';
import AddAttributeModal from './AddAttributeModal/AddAttributeModal';
import './utils/Types';

/**
 * @param {{
 * showGrid:boolean,
 * tableDndDetails:tableDndDetailsObj[],
 * mainTableDetails:mainTableDetailsType[],
 * onTableDndDetailsChange:Function,
 * }} props
 */
function MainGround({
  showGrid,
  tableDndDetails,
  mainTableDetails,
  onTableDndDetailsChange,
}) {
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

  const [addAttributeShowModal, updateAddAttributeShowModal] = useState(false);
  const [
    selectedTableDetailsForModal,
    updateSelectedTableDetailsForModal,
  ] = useState({});

  function cancelModalHandler() {
    updateAddAttributeShowModal(false);
    updateSelectedTableDetailsForModal({});
  }

  function confirmModalHandler() {
    updateAddAttributeShowModal(false);
    updateSelectedTableDetailsForModal({});
  }

  function AddAttributeLinkClickHandler(tableDndDetail) {
    updateAddAttributeShowModal(true);
    updateSelectedTableDetailsForModal(tableDndDetail);
  }
  const tables = tableDndDetails.map(tableDndDetail => {
    return (
      <TableContainer tableDndDetail={tableDndDetail} key={tableDndDetail.id}>
        <AddAttributeLink
          tableDndDetail={tableDndDetail}
          onClick={AddAttributeLinkClickHandler}
          fontColor={tableDndDetail.color}>
          Add Attribute
        </AddAttributeLink>
      </TableContainer>
    );
  });
  return (
    <Grid ref={drop} showGrid={showGrid}>
      {tables}
      <AddAttributeModal
        showModalState={addAttributeShowModal}
        onModalConfirmed={confirmModalHandler}
        onModalClosed={cancelModalHandler}
        tableName={selectedTableDetailsForModal.tableName}
        allTableDndDetails={tableDndDetails}
        mainTableDetails={mainTableDetails}
      />
    </Grid>
  );
}

export default MainGround;
