import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'react-ui-lib-pranshu';
import Style from './DeleteAttrModal.module.css';
import '../../utils/Types';
/**
 * @param {{showModalState:boolean,
 * onModalConfirmed:Function,
 * onModalClosed:Function,
 * tableName:string,
 * attrName:string,
 * }} props
 */
function DeleteAttrModal({
  onModalClosed,
  onModalConfirmed,
  showModalState,
  tableName,
  attrName,
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
    if (attrName === deleteTableInputValue && attrName) {
      setTableError(false);
      console.log(deleteTableInputValue);
      console.log(attrName);
    }
  }, [deleteTableInputValue, attrName]);

  return (
    <Modal
      theme='red'
      size='large'
      title={`Are sure You want To Delete ${attrName} in ${tableName} table`}
      show={showModalState}
      canConfirm={!tableError}
      canCancel
      topAligned
      modalConfirmed={confirmModalHandler}
      modalClosed={cancelModalHandler}>
      <h1 className={Style.header}>Please Enter Attribute Name To Confirm</h1>
      <Input
        label='Attribute Name'
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
export default DeleteAttrModal;
