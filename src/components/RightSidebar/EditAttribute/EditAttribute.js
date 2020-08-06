import React, { useState, useEffect } from 'react';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import Styles from './EditAttribute.module.scss';
import { oracleBanned } from '../../../utils/helper-function/OracleBannedWords';
import { dataTypes } from '../../../utils/attributeDataTypes';
import { columnConstraintCheckboxList } from '../../../utils/checkedItemsForAddAttr';
import ConstraintCheckBoxContainer from '../../AddAttributeModal/constraintCheckboxContainer';
import DeleteAttrModal from '../../DeleteAttrModal/DeleteAttrModal';

import {
  oracleSizeError,
  oracleHasPre,
  oracleHasSize,
} from '../../../utils/helper-function/size-pre-error';
import Select from 'react-select';

/**
 * @param {{
 * table:mainTableDetailsType,
 * attributeName:string,
 * onAttributeChange:Function,
 * sizeInput:string,
 * preInput:string,
 * onSizeInputChange:Function,
 * onPreInputChange:Function,
 * initialAttriuteName,
 * onCancel:Function,
 * dataType:object,
 * onDataTypeChange:Function,
 * columnLevelConstraint:Object,
 * onColumnLevelConstraintChange:Function,
 * defaultValue:string,
 * onDefaultValueChange:Function,
 * onDeleteAttribute:Function,
 * onConfirmAttribute:Function,
 * }} props
 */

function EditCheckConstraint({
  table,
  attributeName,
  onAttributeChange,
  sizeInput,
  preInput,
  onSizeInputChange,
  onPreInputChange,
  initialAttriuteName,
  onCancel,
  dataType,
  onDataTypeChange,
  columnLevelConstraint,
  onColumnLevelConstraintChange,
  defaultValue,
  onDefaultValueChange,
  onDeleteAttribute,
  onConfirmAttribute,
}) {
  const [attributeError, setAttributeError] = useState(false);
  const [attributeErrorErrorMessage, setAttributeErrorErrorMessage] = useState(
    '',
  );
  const [sizeError, setSizeError] = useState(false);
  const [sizeErrorMessage, setSizeErrorMessage] = useState('');
  const [containerError, setContainerError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [defaultValueError, setDefaultValueError] = useState(false);
  const [defaultValueDirty, setDefaultValueDirty] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const [showPre, setShowPre] = useState(false);

  useEffect(() => {
    if (attributeName.trim().length > 0) {
      if (attributeName === initialAttriuteName) {
        setAttributeError(false);
      } else {
        const attrIndex = table.attributes.findIndex(
          (attr) => attr.name === attributeName,
        );
        if (attrIndex > -1) {
          setAttributeError(true);
          setAttributeErrorErrorMessage('attribute name already exist');
        } else {
          const bool = oracleBanned.includes(
            attributeName.toUpperCase().trim(),
          );
          if (bool) {
            setAttributeError(true);
            setAttributeErrorErrorMessage('attribute reserved by oracle');
          } else {
            setAttributeError(false);
          }
        }
      }
    } else {
      setAttributeError(true);
      setAttributeErrorErrorMessage("attribute name can't be null");
    }
  }, [attributeName, table, initialAttriuteName]);

  useEffect(() => {
    if (oracleHasPre(dataType.value)) {
      setShowPre(true);
    } else {
      setShowPre(false);
    }
    if (oracleHasSize(dataType.value)) {
      setShowSize(true);
    } else {
      setShowSize(false);
    }
  }, [dataType]);

  // size and precisionAfterDecimal related

  function sizeInputValueChangeHandler(e) {
    const val = e.target.value;
    if (val >= 0) {
      if (val === '' && oracleSizeError(dataType.value)) {
        onSizeInputChange(val);
        setSizeError(true);
        setSizeErrorMessage("size can't be empty");
      } else {
        onSizeInputChange(val);
        setSizeError(false);
      }
    }
  }

  function precisionAfterDecimalInputValueChangeHandler(e) {
    let val = e.target.value;
    if (val === '' || val === '-') {
    } else {
      const tempVal = parseInt(val);
      if (tempVal) {
        val = tempVal;
      } else {
        val = '';
      }
    }
    onPreInputChange(val);
  }

  function defaultValueChangeHandler(e) {
    onDefaultValueChange(e.target.value);
    setDefaultValueDirty(true);
  }

  useEffect(() => {
    if (defaultValue.length === 0 && columnLevelConstraint['DEFAULT']) {
      setDefaultValueError(true);
    } else {
      setDefaultValueError(false);
    }
  }, [defaultValue, columnLevelConstraint]);

  function attributeInputHandler(e) {
    onAttributeChange(e.target.value);
  }

  function confirmModalHandler() {
    setShowDeleteModal(false);
    onDeleteAttribute();
  }
  function cancelModalHandler() {
    setShowDeleteModal(false);
  }
  function showModalHandler() {
    setShowDeleteModal(true);
  }
  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: 'none',
      background: '#3e4452',
    }),
    placeholder: (base, state) => ({
      ...base,
      color: 'white',
    }),
    singleValue: (base, state) => ({
      ...base,
      color: 'rgb(230,230,230)',
    }),
    menu: (base, state) => ({
      ...base,
      background: '#282c34',
      color: 'rgb(235, 235, 235)',
    }),
    groupHeading: (base, state) => ({
      ...base,
      background: '#282c34',
      color: 'rgba(235, 235, 235, 0.7)',
    }),
    option: (base, state) => ({
      ...base,
      background:
        state.isFocused && state.isSelected
          ? '#4b5263'
          : state.isSelected
          ? '#dcbc4f'
          : state.isFocused
          ? '#4b5263'
          : '#282c34',
      color:
        state.isFocused && state.isSelected
          ? 'rgb(235, 235, 235)'
          : state.isSelected
          ? 'rgb(30,30,30)'
          : 'rgb(235, 235, 235)',
    }),
  };
  function checkBoxHandler(e) {
    e.persist();
    const newCheckedItems = {
      ...columnLevelConstraint,
      [e.target.name]: e.target.checked,
    };
    onColumnLevelConstraintChange(newCheckedItems);
  }
  useEffect(() => {
    if (defaultValueError || sizeError || attributeError) {
      setContainerError(true);
    } else {
      setContainerError(false);
    }
  }, [defaultValueError, sizeError, attributeError]);
  return (
    <div>
      <DeleteAttrModal
        onModalClosed={cancelModalHandler}
        onModalConfirmed={confirmModalHandler}
        showModalState={showDeleteModal}
        tableName={table.tableName}
        attrName={initialAttriuteName}
        givenTable={table}
      />
      <div className={Styles.inputContainer}>
        <Input
          usingFor={'sidebar'}
          value={attributeName}
          onChange={attributeInputHandler}
          dimension='huge'
          error={attributeError}
          label='attribute name'
          errorMessage={attributeErrorErrorMessage}
        />
      </div>
      <h3 className={Styles.header}>Select data type :</h3>
      <div className={Styles.select}>
        <Select
          value={dataType}
          styles={customStyles}
          options={dataTypes}
          placeholder='Select DataType'
          onChange={onDataTypeChange}
        />
      </div>
      {showSize && (
        <div className={Styles.inputContainer}>
          <Input
            usingFor={'sidebar'}
            value={sizeInput}
            onChange={sizeInputValueChangeHandler}
            dimension='huge'
            label='size'
            error={sizeError}
            errorMessage={sizeErrorMessage}
            required={oracleSizeError(dataType.value)}
          />
        </div>
      )}
      {showPre && (
        <div className={Styles.inputContainer} style={{ paddingTop: '1px' }}>
          <Input
            usingFor={'sidebar'}
            value={preInput}
            onChange={precisionAfterDecimalInputValueChangeHandler}
            dimension='huge'
            label='precision'
          />
        </div>
      )}
      <h2 className={Styles.header} style={{ marginTop: '0' }}>
        columnlevel Constraint:
      </h2>
      <div className={Styles.foreignCheckBox}>
        <ConstraintCheckBoxContainer
          checkedConstraintObj={columnLevelConstraint}
          onConstraintChecked={checkBoxHandler}
          checkBoxList={columnConstraintCheckboxList.slice(0, 2)}
        />
      </div>
      <div className={Styles.foreignCheckBox}>
        <ConstraintCheckBoxContainer
          checkedConstraintObj={columnLevelConstraint}
          onConstraintChecked={checkBoxHandler}
          checkBoxList={columnConstraintCheckboxList.slice(2)}
        />
      </div>
      {columnLevelConstraint['DEFAULT'] && (
        <div className={Styles.inputContainer}>
          <Input
            usingFor={'sidebar'}
            value={defaultValue}
            onChange={defaultValueChangeHandler}
            dimension='huge'
            error={defaultValueError && defaultValueDirty}
            errorMessage={"this field can't be empty"}
            required
            label='defaul value'
          />
        </div>
      )}
      <div className={Styles.buttonContainer}>
        <div className={Styles.button}>
          <Button danger dimension='small' onClick={showModalHandler}>
            delete
          </Button>
        </div>
        <div className={Styles.button}>
          <Button dimension='small' inverted onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <div className={Styles.button}>
          <Button
            dimension='small'
            onClick={onConfirmAttribute}
            className={Styles.button}
            disabled={containerError}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditCheckConstraint;
