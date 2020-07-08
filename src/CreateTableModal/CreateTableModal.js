import React, { useState } from 'react';
import { Modal, Input } from 'react-ui-lib-pranshu';
import uuid from 'uuid/v1';
import TableColorPickerList from '../components/TableColorPickerList/TableColorPickerList';
import '../utils/Types';
/**
 * @param {{showModalState:boolean,
 * onModalConfirmed:Function,
 * onModalClosed:Function,
 * allMainTableDetails:mainTableDetailsType[]
 * }} props
 */
function CreateTableModal({
  onModalClosed,
  onModalConfirmed,
  showModalState,
  allMainTableDetails,
}) {
  const [createTableInputValue, updateCreateTableInputValue] = useState('');
  const [tableColor, updateTableColor] = useState('rgb(105,105,105)');
  const [tableError, setTableError] = useState(true);

  function createTableInputValueHandler(e) {
    const newTableValue = e.target.value;
    if (newTableValue !== '') {
      updateCreateTableInputValue(newTableValue);
      const index = allMainTableDetails.findIndex(
        (table) => table.tableName === newTableValue.trim(),
      );
      if (index === -1) {
        setTableError(false);
      } else {
        setTableError(true);
      }
    } else {
      updateCreateTableInputValue(newTableValue);
      setTableError(true);
    }
  }

  function cancelModalHandler() {
    updateCreateTableInputValue('');
    onModalClosed();
    setTableError(true);
    updateTableColor('rgb(105,105,105)');
  }

  function confirmModalHandler() {
    if (!tableError) {
      const newTableDndDetails = {
        left: 20,
        top: 20,
        tableName: createTableInputValue,
        id: uuid(),
        color: tableColor,
      };
      /**
       * @type {mainTableDetailsType}
       */
      const mainTableDetails = {
        tableName: createTableInputValue,
        attributes: [],
        tableLevelConstraint: {
          FOREIGNKEY: [],
          PRIMARYKEY: null,
        },
        columnLevelConstraint: {
          NOTNULL: [],
          UNIQUE: [],
        },
      };
      updateTableColor('rgb(105,105,105)');
      updateCreateTableInputValue('');
      onModalConfirmed(newTableDndDetails, mainTableDetails);
      setTableError(true);
    }
  }

  return (
    <Modal
      theme='blue'
      size='medium'
      title='Create Table'
      show={showModalState}
      canConfirm={!tableError}
      canCancel
      topAligned
      modalConfirmed={confirmModalHandler}
      modalClosed={cancelModalHandler}>
      <Input
        label='Table Name'
        color='blue'
        autoFocus
        value={createTableInputValue}
        onChange={createTableInputValueHandler}
        focusColor='green'
        size='large'
      />
      <TableColorPickerList
        onTableColorSelected={updateTableColor}
        selectedColor={tableColor}
      />
    </Modal>
  );
}
export default React.memo(CreateTableModal);
