import React, { useState } from 'react';
import TableContainer from './TableContainer/TableContainer';
import Grid from './Grid';
import ItemDndTypes from './utils/dndTypes';
import { useDrop } from 'react-dnd';
import { AddAttributeLink } from './components/TableComponent/TableComponents';
import AddAttributeModal from './AddAttributeModal/AddAttributeModal';
import './utils/Types';
import MainTable from './components/TableComponent/MainTable';
import DeleteTableModal from './components/DeleteTableModal/DeleteTableModal';
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
  const [showDeleteTableModal, setShowDeleteTableModal] = useState(false);
  const [
    selectedTableDndDetailsForAddModal,
    updateselectedTableDndDetailsForAddModal,
  ] = useState({});
  const [
    selectedTableDetailsForAddModal,
    updateselectedTableDetailsForAddModal,
  ] = useState({});
  const [
    selectedTableDndDetailsForDeleteModal,
    setSelectedTableDndDetailsForDeleteModal,
  ] = useState({});
  const [
    selectedTableDetailsForDeleteModal,
    setSelectedTableDetailsForDeleteModal,
  ] = useState({});

  function cancelModalHandler() {
    updateAddAttributeShowModal(false);
    updateselectedTableDndDetailsForAddModal({});
    updateselectedTableDetailsForAddModal({});
  }

  function confirmModalHandler(newObj) {
    updateAddAttributeShowModal(false);
    updateselectedTableDndDetailsForAddModal({});
    updateselectedTableDetailsForAddModal({});
    let newTable = JSON.parse(
      JSON.stringify({ ...selectedTableDetailsForAddModal }),
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
    updateselectedTableDndDetailsForAddModal(tableDndDetail);
    const index = mainTableDetails.findIndex(
      (table) => table.tableName === tableDndDetail.tableName,
    );
    updateselectedTableDetailsForAddModal(mainTableDetails[index]);
  }

  function editTableHandler() {}

  function deleteTableHandler(tableDndDetail) {
    setShowDeleteTableModal(true);
    setSelectedTableDndDetailsForDeleteModal(tableDndDetail);
    const index = mainTableDetails.findIndex(
      (table) => table.tableName === tableDndDetail.tableName,
    );
    setSelectedTableDetailsForDeleteModal(mainTableDetails[index]);
  }

  function deleteTableModalCancelHandler() {
    setShowDeleteTableModal(false);
    setSelectedTableDetailsForDeleteModal({});
    setSelectedTableDndDetailsForDeleteModal({});
  }

  function deleteTableModalConfirmHandler() {
    setShowDeleteTableModal(false);
    setSelectedTableDetailsForDeleteModal({});
    setSelectedTableDndDetailsForDeleteModal({});
    const newTableDndDetails = JSON.parse(JSON.stringify([...tableDndDetails]));
    const newMainTableDetails = JSON.parse(
      JSON.stringify([...mainTableDetails]),
    );

    const dndIndex = newTableDndDetails.findIndex(
      (table) =>
        table.tableName === selectedTableDndDetailsForDeleteModal.tableName,
    );
    const mainIndex = newMainTableDetails.findIndex(
      (table) =>
        table.tableName === selectedTableDetailsForDeleteModal.tableName,
    );
    newTableDndDetails.splice(dndIndex, 1);
    newMainTableDetails.splice(mainIndex, 1);
    onMainTableDetailsChange(newMainTableDetails);
    onTableDndDetailsChange(newTableDndDetails);
  }

  const tables = tableDndDetails.map((tableDndDetail) => {
    return (
      <TableContainer
        tableDndDetail={tableDndDetail}
        key={tableDndDetail.id}
        onEditClick={editTableHandler}
        onDeleteClick={deleteTableHandler}>
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
        tableName={selectedTableDndDetailsForAddModal.tableName}
        allTableDndDetails={tableDndDetails}
        mainTableDetails={mainTableDetails}
        givenTable={selectedTableDetailsForAddModal}
      />
      <DeleteTableModal
        showModalState={showDeleteTableModal}
        tableName={selectedTableDndDetailsForDeleteModal.tableName}
        onModalClosed={deleteTableModalCancelHandler}
        onModalConfirmed={deleteTableModalConfirmHandler}
      />
    </Grid>
  );
}
export default MainGround;
