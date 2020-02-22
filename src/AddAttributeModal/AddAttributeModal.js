import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'react-ui-lib-pranshu';
import ConstraintCheckBoxContainer from './constraintCheckboxContainer';
import DataTypeDropDown from './DataTypeDropDown';
import TableNameDropDown from './SelectTableDropDown';
import {
  numericTypes,
  stringTypes,
  dateAndTimeTypes,
} from '../utils/attributeDataTypes';

/**
 * @typedef {object} tableDndDetailsObj
 * @property {number} top
 * @property {number} left
 * @property {string} tableName
 * @property {string} id
 * @property {string} color
 */

/** @param {{
 * showModalState:boolean,
 * onModalConfirmed:Function,
 * onModalClosed:Function,
 * tableName:string,
 * allTableDndDetails:tableDndDetailsObj[]
 * }} props
 */
function AddAttributeModal({
  showModalState,
  onModalClosed,
  tableName,
  allTableDndDetails,
  onModalConfirmed,
}) {
  const [AddAttributeInputValue, updateAddAttributeInputValue] = useState('');
  const [checkedItems, updateCheckedItems] = useState({});
  const [selectedDataType, updateSelectedDataType] = useState('');
  const [selectedReferencingTable, updateSelectedReferencingTable] = useState();
  const [sizeInputValue, updateSizeInputValue] = useState('');
  const [
    precisionAfterDecimalInputValue,
    updatePrecisionAfterDecimalInputValue,
  ] = useState('');
  const [showSizeInput, updateShowSizeInput] = useState(false);
  const [
    showprecisionAfterDecimalInput,
    updateShowPrecisionAfterDecimalInput,
  ] = useState(false);

  function checkBoxChangeHandler(e) {
    e.persist();
    updateCheckedItems(checkedItems => ({
      ...checkedItems,
      [e.target.name]: e.target.checked,
    }));
    console.log(checkedItems);
  }
  function ModalCloseHandler() {
    updateAddAttributeInputValue('');
    updateSelectedDataType('');
    onModalClosed();
  }
  function modalConfirmHandler() {
    updateAddAttributeInputValue('');
    updateSelectedDataType('');
    onModalConfirmed();
  }

  function addAttributeInputValueHandler(e) {
    updateAddAttributeInputValue(e.target.value);
  }

  function handleNumericSizeAndPrecisionAfterDecimal() {
    if (
      selectedDataType === 'FLOAT' ||
      selectedDataType === 'DOUBLE' ||
      selectedDataType === 'DECIMAL'
    ) {
      updateShowSizeInput(true);
      updateShowPrecisionAfterDecimalInput(true);
    }
  }

  function handlerStringSize() {
    if (selectedDataType === 'CHAR' || selectedDataType === 'VARCHAR') {
      updateShowSizeInput(true);
    }
  }

  function handleDataTypeRelatedInputs() {
    let index;
    index = numericTypes.findIndex(type => type.value === selectedDataType);
    if (index !== -1) {
      handleNumericSizeAndPrecisionAfterDecimal();
    } else {
      index = stringTypes.findIndex(type => type.value === selectedDataType);
      if (index !== -1) {
        handlerStringSize();
      }
    }
  }

  function dataTypeSelectedHandler(value) {
    updateShowSizeInput(false);
    updateShowPrecisionAfterDecimalInput(false);
    updateSelectedDataType(value.value);
  }

  function whenDataTypeisUpdated() {
    if (selectedDataType.length !== 0) {
      handleDataTypeRelatedInputs();
    }
  }
  //for immediate effect selectedDataType
  useEffect(whenDataTypeisUpdated, [selectedDataType]);

  function referencingTableSelectedHandler(value) {
    console.log(value);
    updateSelectedReferencingTable(value);
  }

  function sizeInputValueChangeHandler(e) {
    if (e.target.value >= 0) updateSizeInputValue(e.target.value);
  }

  function precisionAfterDecimalInputValueChangeHandler(e) {
    if (e.target.value >= 0)
      updatePrecisionAfterDecimalInputValue(e.target.value);
  }

  return (
    <Modal
      canCancel
      canConfirm
      topAligned
      size='medium'
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
      <div style={{ width: '40%' }}>
        <DataTypeDropDown onNewDataSelected={dataTypeSelectedHandler} />
      </div>
      <div style={{ margin: '5px', marginTop: '10px', marginBottom: '15px' }}>
        {showSizeInput && (
          <Input
            value={sizeInputValue}
            onChange={sizeInputValueChangeHandler}
            type='number'
            label='Size'
            size='medium'
            color='blue'
          />
        )}
        <div style={{ marginTop: '16px' }}>
          {showprecisionAfterDecimalInput && (
            <Input
              value={precisionAfterDecimalInputValue}
              onChange={precisionAfterDecimalInputValueChangeHandler}
              type='number'
              label='Precision after Decimal'
              size='medium'
              color='blue'
            />
          )}
        </div>
      </div>
      <ConstraintCheckBoxContainer
        checkedConstraintObj={checkedItems}
        onConstraintChecked={checkBoxChangeHandler}
      />
      {checkedItems['FOREIGN-KEY'] && (
        <TableNameDropDown
          currentTable={tableName}
          otherTables={allTableDndDetails}
          onTableSelected={referencingTableSelectedHandler}
        />
      )}
    </Modal>
  );
}

export default AddAttributeModal;
