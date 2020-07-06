import React, { useState } from 'react';
import TableContainer from './TableContainer/TableContainer';
import Grid from './Grid';
import ItemDndTypes from './utils/dndTypes';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { AddAttributeLink } from './components/TableComponent/TableComponents';
import AddAttributeModal from './AddAttributeModal/AddAttributeModal';
import './utils/Types';
import MainTable from './components/TableComponent/MainTable';

/**
 * @param {{
 * showGrid:boolean,
 * tableDndDetails:tableDndDetailsObj[],
 * mainTableDetails:mainTableDetailsType[],
 * onTableDndDetailsChange:Function,
 * onMainTableDetailsChange:Function
 * }} props
 */
function MainGround({
  showGrid,
  tableDndDetails,
  mainTableDetails,
  onTableDndDetailsChange,
  onMainTableDetailsChange,
}) {
  /**
   * @param {tableDndDetailsObj} item
   * @param {number} left
   * @param {number} top
   */
  function moveTable(newItem) {
    const updatedTableDndDetails = tableDndDetails.filter(
      (tableDndDetail) => tableDndDetail.id !== newItem.id,
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
    selectedTableDndDetailsForModal,
    updateSelectedTableDndDetailsForModal,
  ] = useState({});
  const [
    selectedTableDetailsForModal,
    updateSelectedTableDetailsForModal,
  ] = useState({});

  function cancelModalHandler() {
    updateAddAttributeShowModal(false);
    updateSelectedTableDndDetailsForModal({});
  }

  function confirmModalHandler(newObj) {
    updateAddAttributeShowModal(false);
    updateSelectedTableDndDetailsForModal({});
    let newTable = JSON.parse(
      JSON.stringify({ ...selectedTableDetailsForModal }),
    );
    console.log(newTable);
    newTable.attributes.push(newObj.attributes);
    if (newObj['NOTNULL']) {
      newTable.columnLevelConstraint.NOTNULL.push(newObj.attributes.name);
    }
    if (newObj['UNIQUE']) {
      newTable.columnLevelConstraint.UNIQUE.push(newObj.attributes.name);
    }
    if (newObj['PRIMARYKEY']) {
      newTable.tableLevelConstraint['PRIMARYKEY'] = newObj.attributes.name;
    }
    if (newObj['FOREIGNKEY']) {
      newTable.tableLevelConstraint.FOREIGNKEY.push(newObj['FOREIGNKEY']);
    }
    console.log(newTable);
    const newMainTableDetails = [...mainTableDetails];
    const index = newMainTableDetails.findIndex(
      (table) => table.tableName === newTable.tableName,
    );
    newMainTableDetails.splice(index, 1, newTable);
    onMainTableDetailsChange(newMainTableDetails);
  }

  function AddAttributeLinkClickHandler(tableDndDetail) {
    updateAddAttributeShowModal(true);
    updateSelectedTableDndDetailsForModal(tableDndDetail);
    const index = mainTableDetails.findIndex(
      (table) => table.tableName === tableDndDetail.tableName,
    );
    updateSelectedTableDetailsForModal(mainTableDetails[index]);
  }

  const tables = tableDndDetails.map((tableDndDetail) => {
    return (
      <TableContainer tableDndDetail={tableDndDetail} key={tableDndDetail.id}>
        <MainTable
          mainTableDetails={mainTableDetails}
          tableName={tableDndDetail.tableName}
        />
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
        tableName={selectedTableDndDetailsForModal.tableName}
        allTableDndDetails={tableDndDetails}
        mainTableDetails={mainTableDetails}
        givenTable={selectedTableDetailsForModal}
      />
    </Grid>
  );
}
export default MainGround;
