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
 * mainTableDetails:mainTableDetailsType[],
 * givenTable:mainTableDetailsType
 * }} props
 */
function AddAttributeModal({
  showModalState,
  onModalClosed,
  tableName,
  allTableDndDetails,
  mainTableDetails,
  onModalConfirmed,
  givenTable,
}) {
  const [AddAttributeInputValue, updateAddAttributeInputValue] = useState('');
  const [modalError, updateModalError] = useState(true);
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
  const [attributeValueError, setAttributeValueError] = useState(true);
  const [selectDataTypeError, setSelectDataTypeError] = useState(true);
  const [sizeInputValueError, setSizeInputValueError] = useState(true);
  const [
    precisionAfterDecimalInputValueError,
    setPrecisionAfterDecimalInputValueError,
  ] = useState(true);
  const [
    selectedReferencingTableError,
    setSelectedReferencingTableError,
  ] = useState(false);

  const [
    selectedReferencingAttrError,
    setSelectedReferencingAttrError,
  ] = useState(false);

  function modalCleanUp() {
    updateAddAttributeInputValue('');
    updateSelectedDataType('');
    updateCheckedItems({});
    updateSelectedReferencingTable('');
    updateSelectedReferencingAttr('');
    updateSizeInputValue('');
    updatePrecisionAfterDecimalInputValue('');
    updateShowSizeInput(false);
    updateShowPrecisionAfterDecimalInput(false);
    setAttributeValueError(true);
    setSelectDataTypeError(true);
    setSizeInputValueError(true);
    setPrecisionAfterDecimalInputValueError(true);
    setSelectedReferencingTableError(false);
  }

  function ModalCloseHandler() {
    modalCleanUp();
    onModalClosed();
  }

  function modalConfirmHandler() {
    if (modalError) {
      modalCleanUp();
    } else {
      let addObj = {
        attributes: {
          name: AddAttributeInputValue,
          dataType: selectedDataType,
        },
      };
      if (sizeInputValue) {
        addObj['attributes'].size = sizeInputValue;
      }
      if (precisionAfterDecimalInputValue) {
        addObj['attributes'].precision = precisionAfterDecimalInputValue;
      }
      if (checkedItems['NOT-NULL']) {
        addObj['NOTNULL'] = true;
      }
      if (checkedItems['UNIQUE']) {
        addObj['UNIQUE'] = true;
      }
      if (checkedItems['FOREIGN-KEY']) {
        addObj['FOREIGNKEY'] = {
          referencedAtt: AddAttributeInputValue,
          ReferencingTable: selectedReferencingTable,
          ReferencingAtt: selectedReferencingAttr,
        };
      }
      if (checkedItems['PRIMARY-KEY']) {
        addObj['PRIMARYKEY'] = true;
        addObj['NOTNULL'] = true;
        addObj['UNIQUE'] = true;
      }
      onModalConfirmed(addObj);
    }
  }

  const addAttributeInputValueHandler = (e) => {
    const val = e.target.value;
    updateAddAttributeInputValue(val);
    if (val.trim().length > 0) {
      const attrIndex = givenTable.attributes.findIndex(
        (attr) => attr.name === val,
      );
      attrIndex > -1
        ? setAttributeValueError(true)
        : setAttributeValueError(false);
    } else {
      setAttributeValueError(true);
    }
  };

  // input select type related

  function handleNumericSizeAndPrecisionAfterDecimal() {
    if (
      selectedDataType === 'FLOAT' ||
      selectedDataType === 'DOUBLE' ||
      selectedDataType === 'DECIMAL'
    ) {
      updateShowSizeInput(true);
      updateShowPrecisionAfterDecimalInput(true);
      setSizeInputValueError(true);
      setPrecisionAfterDecimalInputValueError(true);
    } else {
      setSizeInputValueError(false);
      setPrecisionAfterDecimalInputValueError(false);
    }
  }

  function handlerStringSize() {
    if (selectedDataType === 'CHAR' || selectedDataType === 'VARCHAR') {
      updateShowSizeInput(true);
      setSizeInputValueError(true);
      setPrecisionAfterDecimalInputValueError(false);
    } else {
      setSizeInputValueError(false);
      setPrecisionAfterDecimalInputValueError(false);
    }
  }

  function handleDataTypeRelatedInputs() {
    let index;
    index = numericTypes.findIndex((type) => type.value === selectedDataType);
    if (index !== -1) {
      handleNumericSizeAndPrecisionAfterDecimal();
    } else {
      index = stringTypes.findIndex((type) => type.value === selectedDataType);
      if (index !== -1) {
        handlerStringSize();
      } else {
        setSizeInputValueError(false);
        setPrecisionAfterDecimalInputValueError(false);
      }
    }
  }

  function whenDataTypeisUpdated() {
    if (selectedDataType.length !== 0) {
      handleDataTypeRelatedInputs();
      updateSizeInputValue('');
      updatePrecisionAfterDecimalInputValue('');
    }
  }
  //for immediate effect selectedDataType
  useEffect(whenDataTypeisUpdated, [selectedDataType]);

  function dataTypeSelectedHandler(value) {
    updateShowSizeInput(false);
    updateShowPrecisionAfterDecimalInput(false);
    updateSelectedDataType(value);
    setSelectDataTypeError(false);
  }

  // size and precisionAfterDecimal related

  function sizeInputValueChangeHandler(e) {
    if (e.target.value >= 0) {
      updateSizeInputValue(e.target.value);
      if (e.target.value === '') {
        setSizeInputValueError(true);
      } else {
        setSizeInputValueError(false);
      }
    } else {
      setSizeInputValueError(true);
    }
  }

  function precisionAfterDecimalInputValueChangeHandler(e) {
    if (e.target.value >= 0) {
      updatePrecisionAfterDecimalInputValue(e.target.value);
      if (e.target.value === '') {
        setPrecisionAfterDecimalInputValueError(true);
      } else {
        setPrecisionAfterDecimalInputValueError(false);
      }
    } else {
      setPrecisionAfterDecimalInputValueError(true);
    }
  }

  //checkbox

  function checkBoxChangeHandler(e) {
    e.persist();
    updateCheckedItems((checkedItems) => ({
      ...checkedItems,
      [e.target.name]: e.target.checked,
    }));
    if (!checkedItems['FOREIGN-KEY'] && selectedReferencingTable) {
      updateSelectedReferencingTable('');
      updateSelectedReferencingAttr('');
    }
  }

  // when checkbox-changes
  useEffect(() => {
    if (checkedItems['FOREIGN-KEY']) {
      if (selectedReferencingAttr && selectedReferencingTable) {
        setSelectedReferencingTableError(false);
        setSelectedReferencingAttrError(false);
      } else {
        setSelectedReferencingTableError(true);
        setSelectedReferencingAttrError(true);
      }
    } else {
      setSelectedReferencingTableError(false);
      setSelectedReferencingAttrError(false);
    }
  }, [checkedItems, selectedReferencingAttr, selectedReferencingTable]);

  function getCheckboxList() {
    let constraintCheckboxList = [
      { name: 'NOT-NULL', label: 'NOT NULL' },
      { name: 'UNIQUE', label: 'UNIQUE' },
      { name: 'PRIMARY-KEY', label: 'PRIMARY KEY' },
      { name: 'FOREIGN-KEY', label: 'FOREIGN KEY' },
    ];
    if (givenTable.tableLevelConstraint) {
      if (givenTable.tableLevelConstraint['PRIMARYKEY']) {
        constraintCheckboxList = [
          { name: 'NOT-NULL', label: 'NOT NULL' },
          { name: 'UNIQUE', label: 'UNIQUE' },
          { name: 'FOREIGN-KEY', label: 'FOREIGN KEY' },
        ];
      }
    }

    return constraintCheckboxList;
  }

  //FOREIGNKEY related

  function referencingTableSelectedHandler(value) {
    updateSelectedReferencingTable(value);
    setSelectedReferencingTableError(false);
  }
  function selectedReferencingAttrHandler(value) {
    updateSelectedReferencingAttr(value);
    setSelectedReferencingAttrError(false);
  }

  //error

  useEffect(() => {
    if (
      !attributeValueError &&
      !selectDataTypeError &&
      !sizeInputValueError &&
      !precisionAfterDecimalInputValueError &&
      !selectedReferencingTableError &&
      !selectedReferencingAttrError
    ) {
      updateModalError(false);
    } else {
      updateModalError(true);
    }
  }, [
    attributeValueError,
    selectDataTypeError,
    sizeInputValueError,
    precisionAfterDecimalInputValueError,
    selectedReferencingTableError,
    selectedReferencingAttrError,
  ]);

  return (
    <Modal
      canCancel
      canConfirm={!modalError}
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
            type='text'
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
              type='text'
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
        checkBoxList={getCheckboxList()}
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
