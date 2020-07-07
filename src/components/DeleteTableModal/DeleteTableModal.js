import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'react-ui-lib-pranshu';
import Style from './DeleteModal.module.css';
import '../../utils/Types';
/**
 * @param {{showModalState:boolean,
 * onModalConfirmed:Function,
 * onModalClosed:Function,
 * tableName:string
 * }} props
 */
function DeleteTableModal({
  onModalClosed,
  onModalConfirmed,
  showModalState,
  tableName,
}) {
  const [deleteTableInputValue, updateCreateTableInputValue] = useState('');
  const [tableError, setTableError] = useState(true);

  function createTableInputValueHandler(e) {
    updateCreateTableInputValue(e.target.value);
  }

  function cancelModalHandler() {
    updateCreateTableInputValue('');
    onModalClosed();
    setTableError(true);
  }

  function confirmModalHandler() {
    onModalConfirmed();
    setTableError(true);
    updateCreateTableInputValue('');
  }

  useEffect(() => {
    if (tableName === deleteTableInputValue) {
      setTableError(false);
    }
  }, [deleteTableInputValue, tableName]);

  return (
    <Modal
      theme='red'
      size='large'
      title={`Are sure You want To Delete ${tableName} table`}
      show={showModalState}
      canConfirm={!tableError}
      canCancel
      topAligned
      modalConfirmed={confirmModalHandler}
      modalClosed={cancelModalHandler}>
      <h1 className={Style.header}>Please Enter Table Name To Confirm</h1>
      <Input
        label='Table Name'
        color='red'
        autoFocus
        value={deleteTableInputValue}
        onChange={createTableInputValueHandler}
        focusColor='red'
        size='large'
      />
    </Modal>
  );
}
export default React.memo(DeleteTableModal);
