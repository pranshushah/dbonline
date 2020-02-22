import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'react-ui-lib-pranshu';
import ConstraintCheckBoxContainer from './constraintCheckboxContainer';
import DataTypeDropDown from './DataTypeDropDown';
import TableNameDropDown from './SelectTableDropDown';
import { numericTypes, stringTypes } from '../utils/attributeDataTypes';
import SelectReferencingAttr from './SelectReferencingAttr';
import '../utils/Types';

/** @param {{
 * showModalState:boolean,
 * onModalConfirmed:Function,
 * onModalClosed:Function,
 * tableName:string,
 * allTableDndDetails:tableDndDetailsObj[],
 * mainTableDetails:mainTableDetailsType[]
 * }} props
 */
function AddAttributeModal({
  showModalState,
  onModalClosed,
  tableName,
  allTableDndDetails,
  mainTableDetails,
  onModalConfirmed,
}) {
  const [AddAttributeInputValue, updateAddAttributeInputValue] = useState('');
  const [checkedItems, updateCheckedItems] = useState({});
  const [selectedDataType, updateSelectedDataType] = useState('');
  const [selectedReferencingTable, updateSelectedReferencingTable] = useState();
  const [selectedReferencingAttr, updateSelectedReferencingAttr] = useState();
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
    if (!checkedItems['FOREIGN-KEY'] && selectedReferencingTable) {
      updateSelectedReferencingTable('');
    }
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
    updateSelectedDataType(value);
  }

  function whenDataTypeisUpdated() {
    if (selectedDataType.length !== 0) {
      handleDataTypeRelatedInputs();
    }
  }
  //for immediate effect selectedDataType
  useEffect(whenDataTypeisUpdated, [selectedDataType]);

  function referencingTableSelectedHandler(value) {
    updateSelectedReferencingTable(value);
  }

  function sizeInputValueChangeHandler(e) {
    if (e.target.value >= 0) updateSizeInputValue(e.target.value);
  }

  function precisionAfterDecimalInputValueChangeHandler(e) {
    if (e.target.value >= 0)
      updatePrecisionAfterDecimalInputValue(e.target.value);
  }

  function selectedReferencingAttrHandler(value) {
    updateSelectedReferencingAttr(value);
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
        Select DataType :-
      </h2>
      <div style={{ width: '40%' }}>
        <DataTypeDropDown onNewDataSelected={dataTypeSelectedHandler} />
      </div>
      <div
        style={{
          marginTop: '10px',
          marginBottom: '15px',
          marginLeft: '5px',
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'flex-start',
        }}>
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
        <div style={{ width: '100%', marginLeft: '20px' }}>
          {showprecisionAfterDecimalInput && (
            <Input
              value={precisionAfterDecimalInputValue}
              onChange={precisionAfterDecimalInputValueChangeHandler}
              type='number'
              label='Precision after Decimal'
              size='large'
              color='blue'
            />
          )}
        </div>
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
      <ConstraintCheckBoxContainer
        checkedConstraintObj={checkedItems}
        onConstraintChecked={checkBoxChangeHandler}
      />
      <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'row' }}>
        {checkedItems['FOREIGN-KEY'] && (
          <div style={{ width: '100%' }}>
            <TableNameDropDown
              currentTable={tableName}
              otherTables={allTableDndDetails}
              onTableSelected={referencingTableSelectedHandler}
            />
          </div>
        )}
        <div style={{ width: '100%', marginLeft: '10px' }}>
          {checkedItems['FOREIGN-KEY'] && selectedReferencingTable && (
            <SelectReferencingAttr
              selectedTable={selectedReferencingTable}
              mainTableDetails={mainTableDetails}
              onAttrSelected={selectedReferencingAttrHandler}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default AddAttributeModal;
