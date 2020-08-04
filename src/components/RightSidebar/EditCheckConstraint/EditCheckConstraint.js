import React, { useState, useEffect } from 'react';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import Modal from '../../UI/Modal/Modal';
import { constraintError } from '../../../utils/helper-function/constraintError';
import Styles from './EditCheckConstraint.module.scss';
const parser = require('js-sql-parser');

/**
 * @param {{
 * table:mainTableDetailsType,
 * checkConstraintName:string,
 * checkExpr:string,
 * initialCheckConstraintName:string,
 * onCheckConstraintNameChange:Function,
 * onCheckExprChange:Function,
 * onCancel:Function,
 * onConfirmCheckConstraintClick:Function,
 * onDeleteCheckConstraint:Function
 * }} props
 */

function EditCheckConstraint({
  table,
  checkConstraintName,
  initialCheckConstraintName,
  checkExpr,
  onCancel,
  onCheckConstraintNameChange,
  onCheckExprChange,
  onConfirmCheckConstraintClick,
  onDeleteCheckConstraint,
}) {
  const [checkConstraintNameError, setCheckConstraintNameError] = useState(
    false,
  );
  const [
    checkConstraintNameErrorMessage,
    setCheckConstraintNameErrorMessage,
  ] = useState('');
  const [checkExprError, setCheckExprError] = useState(false);
  const [checkExprDirty, setCheckExprDirty] = useState(false);
  const [checkExprErrorMessage, setCheckExprErrorMessage] = useState('');
  const [containerError, setContainerError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    try {
      parser.parse(`select * from boom WHERE (${checkExpr})`);
      setCheckExprError(false);
    } catch {
      if (checkExprDirty) {
        if (checkExpr.length === 0) {
          setCheckExprError(true);
          setCheckExprErrorMessage("expression can't be empty");
        } else {
          setCheckExprError(true);
          setCheckExprErrorMessage('invalid expression');
        }
      }
    }
  }, [checkExpr, checkExprDirty]);

  useEffect(() => {
    if (initialCheckConstraintName === checkConstraintName) {
      setCheckConstraintNameError(false);
    } else {
      if (constraintError(checkConstraintName, table)) {
        setCheckConstraintNameError(true);
        setCheckConstraintNameErrorMessage('constraint name already exist');
      } else {
        setCheckConstraintNameError(false);
      }
    }
  }, [checkConstraintName, table, initialCheckConstraintName]);

  useEffect(() => {
    if (!checkConstraintNameError && !checkExprError) {
      setContainerError(false);
    } else {
      setContainerError(true);
    }
  }, [checkConstraintNameError, checkExprError]);

  function constraintChangeHandler(e) {
    onCheckConstraintNameChange(e.target.value.trim());
  }
  function checkExpressionHandler(e) {
    onCheckExprChange(e.target.value);
  }
  function checkExpressionDirtyHandler() {
    setCheckExprDirty(true);
  }
  function confirmModalHandler() {
    setShowDeleteModal(false);
    onDeleteCheckConstraint();
  }
  function cancelModalHandler() {
    setShowDeleteModal(false);
  }
  function showModalHandler() {
    setShowDeleteModal(true);
  }
  return (
    <div>
      <Modal
        size='large'
        show={showDeleteModal}
        canConfirm
        canCancel
        modalConfirmed={confirmModalHandler}
        modalClosed={cancelModalHandler}
        title={`Are sure you want to delete ${initialCheckConstraintName} check constraint`}
      />
      <div className={Styles.inputContainer}>
        <Input
          usingFor={'sidebar'}
          value={checkConstraintName}
          onChange={constraintChangeHandler}
          dimension='huge'
          error={checkConstraintNameError}
          label='constraint name'
          errorMessage={checkConstraintNameErrorMessage}
        />
      </div>
      <div className={Styles.inputContainer}>
        <Input
          usingFor={'sidebar'}
          value={checkExpr}
          label='expression'
          required
          onBlur={checkExpressionDirtyHandler}
          error={checkExprError && checkExprDirty}
          errorMessage={checkExprErrorMessage}
          onChange={checkExpressionHandler}
          dimension='huge'
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
            onClick={onConfirmCheckConstraintClick}
            dimension='small'
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
