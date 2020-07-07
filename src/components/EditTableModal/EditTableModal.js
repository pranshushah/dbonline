import React, { useState } from 'react';
import { Modal, Input } from 'react-ui-lib-pranshu';
import TableColorPickerList from '../TableColorPickerList/TableColorPickerList';
import '../../utils/Types';
/**
 * @param {{showModalState:boolean,
 * onModalConfirmed:Function,
 * onModalClosed:Function,
 * tableColor:string,
 * tableName:string,
 * onTableColorChange:Function,
 * onTableNameChange:Function,
 * }} props
 */
function EditTableModal({
  onModalClosed,
  onModalConfirmed,
  showModalState,
  tableColor,
  tableName,
  onTableColorChange,
  onTableNameChange,
}) {
  const [tableError, setTableError] = useState(false);

  function tableInputValueHandler(e) {
    if (e.target.value !== '') {
      onTableNameChange(e.target.value);
      setTableError(false);
    } else {
      onTableNameChange(e.target.value);
      setTableError(true);
    }
  }

  function cancelModalHandler() {
    onTableNameChange('');
    onModalClosed();
    setTableError(false);
    onTableColorChange('');
  }

  function confirmModalHandler() {
    if (!tableError) {
      onTableColorChange('');
      onTableNameChange('');
      onModalConfirmed(tableColor, tableName);
      setTableError(false);
    }
  }

  return (
    <Modal
      theme='blue'
      size='medium'
      title='Edit Table'
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
        value={tableName}
        onChange={tableInputValueHandler}
        focusColor='green'
        size='large'
      />
      <TableColorPickerList
        onTableColorSelected={onTableColorChange}
        selectedColor={tableColor}
      />
    </Modal>
  );
}
export default React.memo(EditTableModal);
