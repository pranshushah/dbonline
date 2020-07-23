import React, { useState } from 'react';
import Input from '../../components/UI/Input/Input';
import Modal from '../../components/UI/Modal/Modal';
import TableColorPickerList from '../TableColorPickerList/TableColorPickerList';
import Styles from './EditTableModal.module.scss';
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
      primary
      size='large'
      title='Edit Table'
      show={showModalState}
      canConfirm
      canCancel
      confirmDisabled={tableError}
      modalConfirmed={confirmModalHandler}
      modalClosed={cancelModalHandler}>
      <div className={Styles.container}>
        <Input
          label='Table Name'
          autoFocus
          value={tableName}
          onChange={tableInputValueHandler}
          dimension='large'
          primary
        />
        <TableColorPickerList
          onTableColorSelected={onTableColorChange}
          selectedColor={tableColor}
        />
      </div>
    </Modal>
  );
}
export default React.memo(EditTableModal);
