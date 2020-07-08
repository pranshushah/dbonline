import React, { useState } from 'react';
import { Modal, Input } from 'react-ui-lib-pranshu';
import uuid from 'uuid/v4';
import TableColorPickerList from '../components/TableColorPickerList/TableColorPickerList';
import '../utils/Types';
/**
 * @param {{showModalState:boolean,
 * onModalConfirmed:Function,
 * onModalClosed:Function,
 * }} props
 */
function CreateTableModal({ onModalClosed, onModalConfirmed, showModalState }) {
  const [createTableInputValue, updateCreateTableInputValue] = useState('');
  const [tableColor, updateTableColor] = useState('rgb(105,105,105)');
  const [tableError, setTableError] = useState(true);

  function createTableInputValueHandler(e) {
    if (e.target.value !== '') {
      updateCreateTableInputValue(e.target.value);
      setTableError(false);
    } else {
      updateCreateTableInputValue(e.target.value);
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
