import React, { useEffect, useState } from 'react';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import Modal from '../../UI/Modal/Modal';
import Styles from './EditUniqueConstraint.module.scss';
import { constraintError } from '../../../utils/helper-function/constraintError';
import Select from 'react-select';

/**
 * @param {{
 * table:mainTableDetailsType,
 * uniqueConstraintName:string,
 * initialUniqueConstraintName:string,
 * onUniqeuConstraintNameChange:Function,
 * selectedTableUnique:[],
 * onCancel:Function,
 * onConfirmUniqueConstraintClick:Function,
 * onDeleteUniqueConstraint:Function
 * }} props
 */

function EditUniqueConstraint({
  table,
  uniqueConstraintName,
  initialUniqueConstraintName,
  onUniqueConstraintNameChange,
  onCancel,
  selectedTableUnique,
  onTableLevelUniqueChange,
  onDeleteUniqueConstraint,
  onConfirmUniqueConstraintClick,
}) {
  const [uniqueConstraintNameError, setUniqueConstraintNameError] = useState(
    false,
  );
  const [
    uniqueConstraintNameErrorMessage,
    setUniqueConstraintNameErrorMessage,
  ] = useState('');

  const [uniqueValueError, setUniqueValueError] = useState(false);
  const [containerError, setContainerError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function uniqueConstraintNameChangeHandler(e) {
    onUniqueConstraintNameChange(e.target.value.trim());
  }
  useEffect(() => {
    if (initialUniqueConstraintName === uniqueConstraintName) {
      setUniqueConstraintNameError(false);
    } else {
      if (constraintError(uniqueConstraintName, table)) {
        setUniqueConstraintNameError(true);
        setUniqueConstraintNameErrorMessage('constraint name already exist');
      } else {
        setUniqueConstraintNameError(false);
      }
    }
  }, [uniqueConstraintName, table, initialUniqueConstraintName]);

  useEffect(() => {
    if (selectedTableUnique) {
      setUniqueValueError(false);
    } else {
      setUniqueValueError(true);
    }
  }, [selectedTableUnique]);

  useEffect(() => {
    if (!uniqueValueError && !uniqueConstraintNameError) {
      setContainerError(false);
    } else {
      setContainerError(true);
    }
  }, [uniqueValueError, uniqueConstraintNameError]);

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
    onDeleteUniqueConstraint();
  }
  function cancelModalHandler() {
    setShowDeleteModal(false);
  }
  function showModalHandler() {
    setShowDeleteModal(true);
  }
  const options = [];
  table.attributes.forEach((attrObj) => {
    options.push({ label: attrObj.name, value: attrObj.id });
  });
  return (
    <div>
      <Modal
        size='large'
        show={showDeleteModal}
        canConfirm
        canCancel
        modalConfirmed={confirmModalHandler}
        modalClosed={cancelModalHandler}
        title={`Are sure you want to delete ${initialUniqueConstraintName} unique constraint`}
      />
      <div className={Styles.inputContainer}>
        <Input
          dimension='huge'
          error={uniqueConstraintNameError}
          errorMessage={uniqueConstraintNameErrorMessage}
          usingFor='sidebar'
          label='constraint name'
          value={uniqueConstraintName}
          onChange={uniqueConstraintNameChangeHandler}
        />
      </div>
      <div className={Styles.select}>
        <Select
          styles={customStyles}
          options={options}
          value={selectedTableUnique}
          isMulti
          onChange={onTableLevelUniqueChange}
          placeholder='Select Composite Unique Key'
        />
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
            onClick={onConfirmUniqueConstraintClick}
            disabled={containerError}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
export default EditUniqueConstraint;
