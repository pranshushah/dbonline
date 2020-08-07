import React, { useEffect, useState } from 'react';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import Modal from '../../UI/Modal/Modal';
import Styles from './EditForeignConstraint.module.scss';
import { constraintError } from '../../../utils/helper-function/constraintError';
import Select from 'react-select';
import ConstraintCheckBoxContainer from '../../AddAttributeModal/constraintCheckboxContainer';
import { foreignConstraintCheckboxList } from '../../../utils/checkedItemsForAddAttr/index';
import { customStyles } from '../../../utils/selectStyle';
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
