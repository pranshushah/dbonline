import React, { useState } from 'react';
import { Modal, Input } from 'react-ui-lib-pranshu';
import uuid from 'uuid/v4';
import TableColorPickerList from '../components/TableColorPickerList/TableColorPickerList';
/**
 * @param {{showModalState:boolean,
 * onModalConfirmed:Function,
 * onModalClosed:Function,
 * }} props
 */
function CreateTableModal({ onModalClosed, onModalConfirmed, showModalState }) {
  const [createTableInputValue, updateCreateTableInputValue] = useState('');
  const [tableColor, updateTableColor] = useState('gray');

  function createTableInputValueHandler(e) {
    updateCreateTableInputValue(e.target.value);
  }

  function cancelModalHandler() {
    updateCreateTableInputValue('');
    onModalClosed();
  }

  function confirmModalHandler() {
    if (createTableInputValue.trim().length === 0) {
      updateTableColor('gray');
      updateCreateTableInputValue('');
      onModalConfirmed(null);
    } else {
      const newTable = {
        left: 20,
        top: 20,
        tableName: createTableInputValue,
        id: uuid(),
        color: tableColor,
      };
      updateTableColor('gray');
      updateCreateTableInputValue('');
      onModalConfirmed(newTable);
    }
  }

  return (
    <Modal
      theme='blue'
      size='medium'
      title='Table Name'
      show={showModalState}
      canConfirm
      canCancel
      topAligned
      modalConfirmed={confirmModalHandler}
      modalClosed={cancelModalHandler}>
      <Input
        label='Table Name'
        color='blue'
        value={createTableInputValue}
        onChange={createTableInputValueHandler}
        focusColor='green'
        size='medium'
      />
      <TableColorPickerList onTableColorSelected={updateTableColor} />
    </Modal>
  );
}
export default React.memo(CreateTableModal);
