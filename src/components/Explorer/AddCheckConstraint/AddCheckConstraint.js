import React, { useState, useEffect } from 'react';
import Modal from '../../UI/Modal/Modal';
import Input from '../../UI/Input/Input';

import Styles from './AddCheckConstraint.module.scss';
import { randomString } from '../../../utils/helper-function/randomString';
import { useConstraint } from '../../../utils/customHooks/useConstraint';
import deepClone from 'clone-deep';
const parser = require('js-sql-parser');

/**
 * @param {{
 * mainTableDetails:mainTableDetailsType[],
 * givenTable:mainTableDetailsType,
 * onConfirm:Function,
 * onCancel:Function,
 * showModal:boolean,
 * }} props
 */
function AddCheckConstraint({
  mainTableDetails,
  givenTable,
  onCancel,
  onConfirm,
  showModal,
}) {
  const [constraintName, setConstraintName, constraintErr] = useConstraint(
    givenTable,
  );
  const [containerError, setContainerError] = useState(true);
  const [checkExpr, setCheckExpr] = useState('');
  const [checkExprDirty, setCheckExprDirty] = useState(false);
  const [showExprError, setShowExprError] = useState(false);
  const [checkExprErrorMessage, setCheckExprErrorMessage] = useState('');
  const [checkExprError, setCheckExprError] = useState(true);

  function checkExpressionHandler(e) {
    setCheckExpr(e.target.value);
  }

  useEffect(() => {
    try {
      parser.parse(`select * from boom WHERE (${checkExpr})`);
      setCheckExprError(false);
    } catch {
      if (showExprError) {
        if (checkExpr.length === 0) {
          setCheckExprError(true);
          setCheckExprErrorMessage("expression can't be empty");
        } else {
          setCheckExprError(true);
          setCheckExprErrorMessage('invalid expression');
        }
      } else {
        setCheckExprError(true);
      }
    }
  }, [showExprError, checkExpr]);

  useEffect(() => {
    if (constraintErr || checkExprError) {
      setContainerError(true);
    } else {
      setContainerError(false);
    }
  }, [constraintErr, checkExprError]);

  function checkExpressionDirtyHandler() {
    setCheckExprDirty(true);
  }

  function checkExpressionShowErrorHandler() {
    if (checkExprDirty) {
      setShowExprError(true);
    } else {
      setShowExprError(false);
    }
  }

  function blurHandler() {
    setShowExprError(true);
  }

  function modalConfirmHandler() {
    let finalCname;
    if (constraintName) {
      finalCname = constraintName;
    } else {
      finalCname = randomString();
    }
    const newMainTableDetails = deepClone(mainTableDetails);
    const tableIndex = newMainTableDetails.findIndex(
      (table) => table.id === givenTable.id,
    );
    newMainTableDetails[tableIndex].tableLevelConstraint.CHECK.push({
      constraintName: finalCname,
      AST: parser.parse(`select * from boom WHERE (${checkExpr})`),
    });
    onConfirm(newMainTableDetails);
  }
  return (
    <Modal
      canCancel
      canConfirm
      size='medium'
      show={showModal}
      topAligned
      primary
      confirmDisabled={containerError}
      title={`Add check constraint to the ${givenTable.tableName}`}
      modalConfirmed={modalConfirmHandler}
      modalClosed={onCancel}>
      <div className={Styles.container}>
        <Input
          value={constraintName}
          onChange={setConstraintName}
          error={constraintErr}
          label='constraint name'
          type='text'
          autoFocus
          dimension='large'
          errorMessage={'constraint name already exist in table'}
        />
        <div className={Styles.inputContainer}>
          <Input
            value={checkExpr}
            onChange={checkExpressionHandler}
            error={checkExprError && showExprError}
            label='check expression'
            type='text'
            onBlur={blurHandler}
            onMouseLeave={checkExpressionShowErrorHandler}
            onFocus={checkExpressionDirtyHandler}
            dimension='large'
            errorMessage={checkExprErrorMessage}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddCheckConstraint;
