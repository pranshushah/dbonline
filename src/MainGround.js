import React, { useState, useReducer } from 'react';
import TableContainer from './TableContainer/TableContainer';
import Grid from './Grid';
import ItemDndTypes from './utils/dndTypes';
import { AddAttributeLink } from './components/TableComponent/TableComponents';
import AddAttributeModal from './AddAttributeModal/AddAttributeModal';
import './utils/Types';
import MainTable from './components/TableComponent/MainTable';
import DeleteTableModal from './components/DeleteTableModal/DeleteTableModal';
import EditTableModal from './components/EditTableModal/EditTableModal';
import mainGroundReducer from './utils/reducers/mainGroundReducer';
import DeleteAttrModal from './components/DeleteAttrModal/DeleteAttrModal';
import XArrow from 'react-xarrows';

/**
 * @param {{
 * showGrid:boolean,
 * tableDndDetails:tableDndDetailsObj[],
 * mainTableDetails:mainTableDetailsType[],
 * onTableDndDetailsChange:Function,
 * onMainTableDetailsChange:Function,
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
    const newTable = JSON.parse(JSON.stringify(updatedTableDndDetails));
    newTable.push(newItem);
    onTableDndDetailsChange(newTable);
  }

  const [state, dispatch] = useReducer(mainGroundReducer, {
    addAttributeShowModal: false,
    showDeleteTableModal: false,
    showEditTableModal: false,
    showDeleteAttributeModal: false,
    selectedTableDndDetailsForAddModal: {},
    selectedTableDetailsForAddModal: {},
    selectedTableDndDetailsForDeleteModal: {},
    selectedTableDetailsForDeleteModal: {},
    selectedTableDndDetailsForEditModal: {},
    selectedTableDetailsForEditModal: {},
    selectedTableNameForDeleteAttribute: '',
    selectedAttributeNameForDeleteAttribute: '',
    selectedAttributeIndexForDeleteAttribute: -1,
  });

  const {
    addAttributeShowModal,
    showDeleteTableModal,
    showEditTableModal,
    showDeleteAttributeModal,
    selectedTableDndDetailsForAddModal,
    selectedTableDetailsForAddModal,
    selectedTableDndDetailsForDeleteModal,
    selectedTableDetailsForDeleteModal,
    selectedTableDndDetailsForEditModal,
    selectedTableDetailsForEditModal,
    selectedTableNameForDeleteAttribute,
    selectedAttributeNameForDeleteAttribute,
    selectedAttributeIndexForDeleteAttribute,
    selectedTableForDeleteAttribute,
  } = state;

  const [editTableName, setEditTableName] = useState('');
  const [editTableColor, setEditTableColor] = useState('');

  function cancelAddModalHandler() {
    dispatch({ type: 'ADD_MODAL_CANCEL' });
  }

  function confirmAddModalHandler(newObj) {
    let newTable = JSON.parse(
      JSON.stringify({ ...selectedTableDetailsForAddModal }),
    );
    newTable.attributes.push(newObj.attributes);
    if (newObj['FOREIGNKEY']) {
      newTable.tableLevelConstraint.FOREIGNKEY.push(newObj['FOREIGNKEY']);
    }
    if (newObj['CHECK']) {
      newTable.tableLevelConstraint.CHECK.push(newObj['CHECK']);
    }
    if (newObj['PRIMARYKEY']) {
      newObj['PRIMARYKEY'].attributes.forEach((id) => {
        newTable.attributes.some((attr) => {
          let ret = false;
          if (attr.id === id) {
            attr.isPRIMARYKEY = true;
            ret = true;
          }
          return ret;
        });
      });
      newTable.tableLevelConstraint.PRIMARYKEY = newObj['PRIMARYKEY'];
    }
    if (newObj['UNIQUETABLE']) {
      newObj['UNIQUETABLE'].attributes.forEach((id) => {
        newTable.attributes.some((attr) => {
          let ret = false;
          if (attr.id === id) {
            attr.inTableLevelUniquConstraint.push(
              newObj['UNIQUETABLE'].constraintName,
            );
            ret = true;
          }
          return ret;
        });
      });
      newTable.tableLevelConstraint.UNIQUETABLELEVEL.push(
        newObj['UNIQUETABLE'],
      );
    }
    const newMainTableDetails = [...mainTableDetails];
    const index = newMainTableDetails.findIndex(
      (table) => table.tableName === newTable.tableName,
    );
    newMainTableDetails.splice(index, 1, newTable);
    onMainTableDetailsChange(newMainTableDetails);
    dispatch({ type: 'ADD_MODAL_CONFIRM' });
  }

  function AddAttributeLinkClickHandler(tableDndDetail) {
    const index = mainTableDetails.findIndex(
      (table) => table.tableName === tableDndDetail.tableName,
    );
    dispatch({
      type: 'ADD_MODAL_START',
      payload: { tableDndDetail, mainTableDetail: mainTableDetails[index] },
    });
  }

  function deleteTableHandler(tableDndDetail) {
    const index = mainTableDetails.findIndex(
      (table) => table.tableName === tableDndDetail.tableName,
    );
    dispatch({
      type: 'DELETE_MODAL_START',
      payload: { tableDndDetail, mainTableDetail: mainTableDetails[index] },
    });
  }

  function deleteTableModalCancelHandler() {
    dispatch({ type: 'DELETE_MODAL_CANCEL' });
  }

  function deleteTableModalConfirmHandler() {
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
    dispatch({ type: 'DELETE_MODAL_CONFIRM' });
  }

  function editTableHandler(tableDndDetail) {
    setEditTableColor(tableDndDetail.color);
    setEditTableName(tableDndDetail.tableName);
    const index = mainTableDetails.findIndex(
      (table) => table.tableName === tableDndDetail.tableName,
    );

    dispatch({
      type: 'EDIT_MODAL_START',
      payload: { tableDndDetail, mainTableDetail: mainTableDetails[index] },
    });
  }

  function editTableModalCancelHandler() {
    dispatch({ type: 'EDIT_MODAL_CANCEL' });
  }

  function editTableModalConfirmHandler(newColor, newName) {
    const newTableDndDetails = JSON.parse(JSON.stringify([...tableDndDetails]));
    const newMainTableDetails = JSON.parse(
      JSON.stringify([...mainTableDetails]),
    );
    const dndIndex = newTableDndDetails.findIndex(
      (table) =>
        table.tableName === selectedTableDndDetailsForEditModal.tableName,
    );
    const mainIndex = newMainTableDetails.findIndex(
      (table) => table.tableName === selectedTableDetailsForEditModal.tableName,
    );
    newMainTableDetails[mainIndex].tableName = newName;
    newTableDndDetails[dndIndex].tableName = newName;
    newTableDndDetails[dndIndex].color = newColor;
    onMainTableDetailsChange(newMainTableDetails);
    onTableDndDetailsChange(newTableDndDetails);
    dispatch({ type: 'EDIT_MODAL_CONFIRM' });
  }

  function attrDeleteHandler(
    tableName,
    deleteAttrName,
    deleteAttrIndex,
    givenTable,
  ) {
    dispatch({
      type: 'DELETE_ATTRIBUTE_START',
      payload: {
        tableName: tableName,
        attributeName: deleteAttrName,
        attributeIndex: deleteAttrIndex,
        selectedTable: givenTable,
      },
    });
  }

  function deleteAttributeCancelHandler() {
    dispatch({ type: 'DELETE_ATTRIBUTE_CANCEL' });
  }

  function deleteAttributeConfirmHandler() {
    /**
     * @type {mainTableDetailsType[]}
     */
    const newMainTableDetails = JSON.parse(
      JSON.stringify([...mainTableDetails]),
    );
    const index = newMainTableDetails.findIndex(
      (table) => table.tableName === selectedTableNameForDeleteAttribute,
    );

    newMainTableDetails[index].attributes.splice(
      selectedAttributeIndexForDeleteAttribute,
      1,
    );

    // clean-up

    //unique-key
    if (
      selectedTableForDeleteAttribute.attributes[
        selectedAttributeIndexForDeleteAttribute
      ]?.inTableLevelUniquConstraint.length !== 0
    ) {
      selectedTableForDeleteAttribute.attributes[
        selectedAttributeIndexForDeleteAttribute
      ].inTableLevelUniquConstraint.forEach((cName) => {
        newMainTableDetails[index].attributes.forEach((attr) => {
          attr.inTableLevelUniquConstraint = attr?.inTableLevelUniquConstraint.filter(
            (entity) => entity !== cName,
          );
        });
      });
      newMainTableDetails[
        index
      ].tableLevelConstraint.UNIQUETABLELEVEL = newMainTableDetails[
        index
      ].tableLevelConstraint.UNIQUETABLELEVEL.filter((obj) => {
        return !selectedTableForDeleteAttribute.attributes[
          selectedAttributeIndexForDeleteAttribute
        ].inTableLevelUniquConstraint.includes(obj.constraintName);
      });
    }

    // foreign-key

    if (
      selectedTableForDeleteAttribute.attributes[
        selectedAttributeIndexForDeleteAttribute
      ]?.isFOREIGNKEY
    ) {
      newMainTableDetails[
        index
      ].tableLevelConstraint.FOREIGNKEY = newMainTableDetails[
        index
      ].tableLevelConstraint.FOREIGNKEY.filter(
        (obj) =>
          !obj.referencedAtt ===
          selectedTableForDeleteAttribute.attributes[
            selectedAttributeIndexForDeleteAttribute
          ].id,
      );
    }

    //primary-key
    if (
      selectedTableForDeleteAttribute.attributes[
        selectedAttributeIndexForDeleteAttribute
      ].isPRIMARYKEY
    ) {
      newMainTableDetails[index].attributes.forEach((attr) => {
        if (attr.isPRIMARYKEY) {
          delete attr.isPRIMARYKEY;
        }
      });
      newMainTableDetails[index].tableLevelConstraint.PRIMARYKEY = null;
    }

    onMainTableDetailsChange(newMainTableDetails);
    dispatch({ type: 'DELETE_ATTRIBUTE_CONFIRM' });
  }

  const tables = tableDndDetails.map((tableDndDetail) => {
    const index = mainTableDetails.findIndex(
      (tableObj) => tableObj.id === tableDndDetail.id,
    );
    let relArrow = [];
    if (mainTableDetails[index].tableLevelConstraint.FOREIGNKEY.length > 0) {
      relArrow = mainTableDetails[index].tableLevelConstraint.FOREIGNKEY.map(
        (foreignObj, index) => {
          return foreignObj.ReferencingTable === tableDndDetail.id ? null : (
            <XArrow
              key={index}
              start={tableDndDetail.id}
              end={foreignObj.ReferencingTable}
              color={tableDndDetail.color}
            />
          );
        },
      );
    }
    return (
      <div key={tableDndDetail.id}>
        <TableContainer
          id={tableDndDetail.id}
          moveTable={moveTable}
          tableDndDetail={tableDndDetail}
          onEditClick={editTableHandler}
          onDeleteClick={deleteTableHandler}>
          <MainTable
            mainTableDetails={mainTableDetails}
            tableName={tableDndDetail.tableName}
            onAttrDelete={attrDeleteHandler}
            tableDndDetails={tableDndDetails}
          />
          <AddAttributeLink
            tableDndDetail={tableDndDetail}
            onClick={AddAttributeLinkClickHandler}
            fontColor={tableDndDetail.color}>
            Add Attribute
          </AddAttributeLink>
        </TableContainer>
        {relArrow}
      </div>
    );
  });
  return (
    <Grid showGrid={showGrid}>
      <div id='pdf' style={{ height: '100%' }}>
        {tables}
        {addAttributeShowModal && (
          <AddAttributeModal
            showModalState={addAttributeShowModal}
            onModalConfirmed={confirmAddModalHandler}
            onModalClosed={cancelAddModalHandler}
            tableName={selectedTableDndDetailsForAddModal.tableName}
            allTableDndDetails={tableDndDetails}
            mainTableDetails={mainTableDetails}
            givenTable={selectedTableDetailsForAddModal}
          />
        )}
        {showDeleteTableModal && (
          <DeleteTableModal
            showModalState={showDeleteTableModal}
            tableName={selectedTableDndDetailsForDeleteModal.tableName}
            onModalClosed={deleteTableModalCancelHandler}
            onModalConfirmed={deleteTableModalConfirmHandler}
          />
        )}
        {showEditTableModal && (
          <EditTableModal
            showModalState={showEditTableModal}
            onModalConfirmed={editTableModalConfirmHandler}
            onModalClosed={editTableModalCancelHandler}
            tableColor={editTableColor}
            tableName={editTableName}
            onTableColorChange={setEditTableColor}
            onTableNameChange={setEditTableName}
            mainTableDetails={mainTableDetails}
            selectedTable={selectedTableDetailsForEditModal}
          />
        )}
        {showDeleteAttributeModal && (
          <DeleteAttrModal
            showModalState={showDeleteAttributeModal}
            onModalClosed={deleteAttributeCancelHandler}
            onModalConfirmed={deleteAttributeConfirmHandler}
            tableName={selectedTableNameForDeleteAttribute}
            attrName={selectedAttributeNameForDeleteAttribute}
            givenTable={selectedTableForDeleteAttribute}
          />
        )}
      </div>
    </Grid>
  );
}
export default MainGround;
