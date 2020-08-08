import React, { useState, useReducer } from 'react';
import TableContainer from '../TableContainer/TableContainer';
import Grid from '../Grid/Grid';
import { AddAttributeLink } from '../TableComponent/TableComponents';
import AddAttributeModal from '../AddAttributeModal/AddAttributeModal';
import '../../utils/Types';
import MainTable from '../TableComponent/MainTable';
import DeleteTableModal from '../DeleteTableModal/DeleteTableModal';
import EditTableModal from '../EditTableModal/EditTableModal';
import mainGroundReducer from '../../utils/reducers/mainGroundReducer';
import XArrow from 'react-xarrows';
import Tooltip from '../UI/Tooltip/Tooltip';
/**
 * @param {{
 * showGrid:boolean,
 * tableDndDetails:tableDndDetailsObj[],
 * mainTableDetails:mainTableDetailsType[],
 * onTableDndDetailsChange:Function,
 * onMainTableDetailsChange:Function,
 * onRowClicked:Function,
 * }} props
 */
function MainGround({
  showGrid,
  tableDndDetails,
  mainTableDetails,
  onRowClicked,
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
    selectedTableDndDetailsForAddModal: {},
    selectedTableDetailsForAddModal: {},
    selectedTableDndDetailsForDeleteModal: {},
    selectedTableDetailsForDeleteModal: {},
    selectedTableDndDetailsForEditModal: {},
    selectedTableDetailsForEditModal: {},
    selectedTableNameForDeleteAttribute: '',
    selectedAttributeIndexForDeleteAttribute: -1,
    showToolTip: false,
    x: null,
    y: null,
    selectedForeignObj: null,
    foreignTooltipTable: null,
  });

  const {
    addAttributeShowModal,
    showDeleteTableModal,
    showEditTableModal,
    selectedTableDndDetailsForAddModal,
    selectedTableDetailsForAddModal,
    selectedTableDndDetailsForDeleteModal,
    selectedTableDetailsForDeleteModal,
    selectedTableDndDetailsForEditModal,
    selectedTableDetailsForEditModal,
    showToolTip,
    x,
    y,
    selectedForeignObj,
    foreignTooltipTable,
  } = state;

  const [editTableName, setEditTableName] = useState('');
  const [editTableColor, setEditTableColor] = useState('');
  const [opacity, setOpacity] = useState(0.8);

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

  const tables = tableDndDetails.map((tableDndDetail) => {
    const index = mainTableDetails.findIndex(
      (tableObj) => tableObj.id === tableDndDetail.id,
    );
    let relArrow = [];
    if (mainTableDetails[index].tableLevelConstraint.FOREIGNKEY.length > 0) {
      relArrow = mainTableDetails[index].tableLevelConstraint.FOREIGNKEY.map(
        (foreignObj, i) => {
          return foreignObj.ReferencingTable === tableDndDetail.id ? null : (
            <XArrow
              key={i}
              start={tableDndDetail.id}
              end={foreignObj.ReferencingTable}
              color={tableDndDetail.color}
              strokeWidth={4}
              passProps={{
                cursor: 'pointer',
                opacity: opacity,
                onMouseEnter: (e) => {
                  dispatch({
                    type: 'SHOW_TOOLTIP',
                    payload: {
                      x: e.pageX,
                      y: e.pageY,
                      foreignObj,
                      table: mainTableDetails[index],
                    },
                  });
                  setOpacity(1);
                },
                onMouseLeave: () => {
                  dispatch({ type: 'CLOSE_TOOLTIP' });
                  setOpacity(0.8);
                },
              }}
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
            tableDndDetails={tableDndDetails}
            onRowClicked={onRowClicked}
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
        {showToolTip && (
          <Tooltip
            x={x}
            y={y}
            dataObj={selectedForeignObj}
            givenTable={foreignTooltipTable}
            mainTableDetails={mainTableDetails}
          />
        )}
      </div>
    </Grid>
  );
}
export default MainGround;
