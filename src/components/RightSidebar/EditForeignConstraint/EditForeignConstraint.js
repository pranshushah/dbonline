import React, { useEffect, useState } from 'react';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import Modal from '../../UI/Modal/Modal';
import Styles from './EditForeignConstraint.module.scss';
import { constraintError } from '../../../utils/helper-function/constraintError';
import Select from 'react-select';
import ConstraintCheckBoxContainer from '../../AddAttributeModal/constraintCheckboxContainer';
import { foreignConstraintCheckboxList } from '../../../utils/checkedItemsForAddAttr/index';
/**
 * @param {{
 * mainTableDetails:mainTableDetailsType[],
 * table:mainTableDetailsType,
 * foreignConstraintName:string,
 * onForeignConstraintNameChange:Function,
 * onCancel:Function,
 * referencedAtt:object,
 * referencingTable:object,
 * referencingAtt:object,
 * onReferencedAttChange:Function,
 * onReferencingAttChange:Function,
 * onReferencingTableChange:Function,
 * initialForeignConstraintName:string,
 * onDeleteForeignConstraint:Function,
 * onConfirmForeignConstraintClick:Function
 * onForeignCheckedItem:Function,
 * foreignCheckedItem:object,
 * }} props
 */

function EditUniqueConstraint({
  mainTableDetails,
  table,
  foreignConstraintName,
  onForeignConstraintNameChange,
  onCancel,
  referencedAtt,
  referencingTable,
  referencingAtt,
  onReferencedAttChange,
  onReferencingAttChange,
  onReferencingTableChange,
  initialForeignConstraintName,
  onDeleteForeignConstraint,
  onConfirmForeignConstraintClick,
  onForeignCheckedItem,
  foreignCheckedItem,
}) {
  const [foreignConstraintNameError, setForeignConstraintNameError] = useState(
    false,
  );
  const [
    foreignConstraintNameErrorMessage,
    setForeignConstraintNameErrorMessage,
  ] = useState('');

  const [selectError, setSelectError] = useState(false);
  const [containerError, setContainerError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function uniqueConstraintNameChangeHandler(e) {
    onForeignConstraintNameChange(e.target.value.trim());
  }
  useEffect(() => {
    if (initialForeignConstraintName === foreignConstraintName) {
      setForeignConstraintNameError(false);
    } else {
      if (constraintError(foreignConstraintName, table)) {
        setForeignConstraintNameError(true);
        setForeignConstraintNameErrorMessage('constraint name already exist');
      } else {
        setForeignConstraintNameError(false);
      }
    }
  }, [foreignConstraintName, table, initialForeignConstraintName]);

  useEffect(() => {
    if (referencedAtt && referencingAtt && referencingTable) {
      setSelectError(false);
    } else {
      setSelectError(true);
    }
  }, [referencedAtt, referencingAtt, referencingTable]);

  useEffect(() => {
    if (!selectError && !foreignConstraintNameError) {
      setContainerError(false);
    } else {
      setContainerError(true);
    }
  }, [selectError, foreignConstraintNameError]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: 'none',
      background: '#3e4452',
    }),
    placeholder: (base, state) => ({
      ...base,
      color: 'white',
      fontSize: '16px',
    }),
    multiValue: (base, state) => ({
      ...base,
      background: '#dcbc4f',
      color: 'rgb(35,35,35)',
    }),
    singleValue: (base, state) => ({
      ...base,
      color: 'rgb(230,230,230)',
    }),
    multiValueLabel: (base, state) => ({
      ...base,
      color: 'rgb(35,35,35)',
    }),
    menu: (base, state) => ({
      ...base,
      background: '#282c34',
      color: 'rgb(235, 235, 235)',
    }),
    option: (base, state) => {
      return {
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
      };
    },
  };
  function confirmModalHandler() {
    setShowDeleteModal(false);
    onDeleteForeignConstraint();
  }
  function cancelModalHandler() {
    setShowDeleteModal(false);
  }
  function showModalHandler() {
    setShowDeleteModal(true);
  }

  const referencedAttOptions = [];
  table.attributes.forEach((attrObj) => {
    referencedAttOptions.push({ label: attrObj.name, value: attrObj.id });
  });

  const referencingTableOptions = [];
  mainTableDetails.forEach((table) => {
    referencingTableOptions.push({ label: table.tableName, value: table.id });
  });

  const referencingAttOptions = [];
  const index = mainTableDetails.findIndex(
    (table) => table.id === referencingTable.value,
  );
  mainTableDetails[index].attributes.forEach((attrObj) => {
    if ((attrObj.isNOTNULL && attrObj.isUNIQUE) || attrObj.isPRIMARYKEY) {
      referencingAttOptions.push({ label: attrObj.name, value: attrObj.id });
    }
  });

  function referencingTableChangeHandler(obj) {
    onReferencingTableChange(obj);
    onReferencingAttChange(null);
  }

  function foreignCheckBoxChangeHandler(e) {
    e.persist();
    const newCheckedItems = {
      ...foreignCheckedItem,
      [e.target.name]: e.target.checked,
    };
    onForeignCheckedItem(newCheckedItems);
  }

  console.log(foreignCheckedItem);

  return (
    <div>
      <Modal
        size='large'
        show={showDeleteModal}
        canConfirm
        canCancel
        modalConfirmed={confirmModalHandler}
        modalClosed={cancelModalHandler}
        title={`Are sure you want to delete ${initialForeignConstraintName} foreign constraint`}
      />
      <div className={Styles.inputContainer}>
        <Input
          dimension='huge'
          error={foreignConstraintNameError}
          errorMessage={foreignConstraintNameErrorMessage}
          usingFor='sidebar'
          label='constraint name'
          value={foreignConstraintName}
          onChange={uniqueConstraintNameChangeHandler}
        />
      </div>
      <h3 className={Styles.header}>referenced attribute:</h3>
      <div className={Styles.select}>
        <Select
          styles={customStyles}
          options={referencedAttOptions}
          value={referencedAtt}
          onChange={onReferencedAttChange}
          placeholder='Select referenced attribute'
        />
      </div>
      <h3 className={Styles.header}>referencing table:</h3>
      <div className={Styles.select}>
        <Select
          styles={customStyles}
          options={referencingTableOptions}
          value={referencingTable}
          onChange={referencingTableChangeHandler}
          placeholder='Select referencing table'
        />
      </div>
      <h3 className={Styles.header}>referencing attribute:</h3>
      <div className={Styles.select}>
        <Select
          styles={customStyles}
          options={referencingAttOptions}
          value={referencingAtt}
          onChange={onReferencingAttChange}
          placeholder='Select referencing Attribute'
          noOptionsMessage={() => 'no candiddate key available'}
        />
      </div>
      <div className={Styles.foreignCheckBoxContainer}>
        <h2 className={Styles.header} style={{ marginTop: '0' }}>
          On Delete:
        </h2>
        <div className={Styles.foreignCheckBox}>
          <ConstraintCheckBoxContainer
            checkedConstraintObj={foreignCheckedItem}
            onConstraintChecked={foreignCheckBoxChangeHandler}
            checkBoxList={foreignConstraintCheckboxList}
          />
        </div>
      </div>
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
            className={Styles.button}
            onClick={onConfirmForeignConstraintClick}
            disabled={containerError}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
export default EditUniqueConstraint;
