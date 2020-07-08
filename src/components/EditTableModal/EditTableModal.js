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
 * mainTableDetails:mainTableDetailsType[],
 * selectedTable:mainTableDetailsType
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
  mainTableDetails,
  selectedTable,
}) {
  const [tableError, setTableError] = useState(false);

  function tableInputValueHandler(e) {
    const newTableValue = e.target.value;
    onTableNameChange(newTableValue);
    if (newTableValue !== '') {
      if (newTableValue === selectedTable.tableName) {
        setTableError(false);
      } else {
        const index = mainTableDetails.findIndex(
          (table) => table.tableName === newTableValue.trim(),
        );
        if (index === -1) {
          setTableError(false);
        } else {
          setTableError(true);
        }
      }
    } else {
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
