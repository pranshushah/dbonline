import React, { useState } from 'react';
import { Modal, Input } from 'react-ui-lib-pranshu';
import ConstraintCheckBoxContainer from './constraintCheckboxContainer';

/**
 * @param {{
 * showModalState:boolean,
 * onModalConfirmed:Function,
 * onModalClosed:Function,
 * tableName:string,
 * }} props
 */

function AddAttributeModal({
  showModalState,
  onModalClosed,
  tableName,
  onModalConfirmed,
}) {
  const [AddAttributeInputValue, updateAddAttributeInputValue] = useState('');

  function ModalCloseHandler() {
    updateAddAttributeInputValue('');
    onModalClosed();
  }

  function modalConfirmHandler() {
    updateAddAttributeInputValue('');
    onModalConfirmed();
  }

  function addAttributeInputValueHandler(e) {
    updateAddAttributeInputValue(e.target.value);
  }

  return (
    <Modal
      canCancel
      canConfirm
      size='large'
      show={showModalState}
      theme='blue'
      title={`Add Attribute to ${tableName}`}
      modalConfirmed={modalConfirmHandler}
      modalClosed={ModalCloseHandler}>
      <div style={{ margin: '3px', marginLeft: '7px' }}>
        <Input
          label='Attribute Name'
          color='blue'
          size='medium'
          value={AddAttributeInputValue}
          onChange={addAttributeInputValueHandler}
        />
      </div>
      <h2
        style={{
          color: '#27292a',
          margin: '5px',
          marginTop: '15px',
          fontWeight: 'inherit',
        }}>
        Add constriants :-
      </h2>
      <ConstraintCheckBoxContainer />
    </Modal>
  );
}

export default AddAttributeModal;
