import React, { useState } from 'react';
import uuid from 'uuid/v1';
import Input from '../components/UI/Input/Input';
import TableColorPickerList from '../components/TableColorPickerList/TableColorPickerList';
import Modal from '../components/UI/Modal/Modal';
import '../utils/Types';
import Styles from './CreateTableModal.module.scss';
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
      const id = uuid();
      const newTableDndDetails = {
        left: 20,
        top: 20,
        tableName: createTableInputValue,
        id: id,
        color: tableColor,
      };
      /**
       * @type {mainTableDetailsType}
       */
      const mainTableDetails = {
        id: id,
        tableName: createTableInputValue,
        attributes: [],
        tableLevelConstraint: {
          FOREIGNKEY: [],
          PRIMARYKEY: null,
          UNIQUETABLELEVEL: [],
          CHECK: [],
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
      primary
      size='large'
      title='Create Table'
      show={showModalState}
      canConfirm
      canCancel
      modalConfirmed={confirmModalHandler}
      confirmDisabled={tableError}
      modalClosed={cancelModalHandler}>
      <div className={Styles.container}>
        <Input
          label='Table Name'
          autoFocus
          value={createTableInputValue}
          onChange={createTableInputValueHandler}
          dimension='medium'
        />
        <TableColorPickerList
          onTableColorSelected={updateTableColor}
          selectedColor={tableColor}
        />
      </div>
    </Modal>
  );
}
export default React.memo(CreateTableModal);
