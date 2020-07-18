import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'react-ui-lib-pranshu';
import Style from './DeleteAttrModal.module.css';
import '../../utils/Types';
/**
 * @param {{showModalState:boolean,
 * onModalConfirmed:Function,
 * onModalClosed:Function,
 * tableName:string,
 * attrName:string,
 * givenTable:mainTableDetailsType
 * }} props
 */
function DeleteAttrModal({
  onModalClosed,
  onModalConfirmed,
  showModalState,
  tableName,
  attrName,
  givenTable,
}) {
  const [deleteTableInputValue, updateCreateTableInputValue] = useState('');
  const [tableError, setTableError] = useState(true);

  function createTableInputValueHandler(e) {
    updateCreateTableInputValue(e.target.value);
  }

  function cancelModalHandler() {
    updateCreateTableInputValue('');
    onModalClosed();
    setTableError(true);
  }

  function confirmModalHandler() {
    onModalConfirmed();
    setTableError(true);
    updateCreateTableInputValue('');
  }

  let lis = [];

  const attrindex = givenTable?.attributes?.findIndex(
    (attr) => attr.name === attrName,
  );

  if (givenTable?.attributes[attrindex].isPRIMARYKEY) {
    lis.push(
      <li key={lis.length}>
        If you delete this attribute, Primary key
        <span className={Style.constraintName}>
          {' '}
          {givenTable.tableLevelConstraint.PRIMARYKEY.constraintName}{' '}
        </span>
        will be deleted
      </li>,
    );
  }

  if (givenTable?.attributes[attrindex].isFOREIGNKEY) {
    const index = givenTable.tableLevelConstraint.FOREIGNKEY.findIndex(
      (key) => key.referencedAtt === givenTable.attributes[attrindex].id,
    );
    if (index !== -1) {
      lis.push(
        <li key={lis.length}>
          If you delete this attribute, Foreign key
          <span className={Style.constraintName}>
            {' '}
            {
              givenTable.tableLevelConstraint.FOREIGNKEY[index].constraintName
            }{' '}
          </span>
          will be deleted
        </li>,
      );
    }
  }
  if (
    givenTable?.attributes[attrindex].inTableLevelUniquConstraint.length !== 0
  ) {
    if (
      givenTable?.attributes[attrindex].inTableLevelUniquConstraint.length === 1
    ) {
      lis.push(
        <li key={lis.length}>
          If you delete this attribute, Unique constraint
          <span className={Style.constraintName}>
            {' '}
            {
              givenTable?.attributes[attrindex].inTableLevelUniquConstraint[0]
            }{' '}
          </span>
          will be deleted
        </li>,
      );
    } else {
      lis.push(
        <li key={lis.length}>
          If you delete this attribute, Unique constraint
          <span className={Style.constraintName}>
            {' '}
            {givenTable?.attributes[attrindex].inTableLevelUniquConstraint.join(
              ' , ',
            )}{' '}
          </span>
          will be deleted
        </li>,
      );
    }
  }

  useEffect(() => {
    if (attrName === deleteTableInputValue && attrName) {
      setTableError(false);
      console.log(deleteTableInputValue);
      console.log(attrName);
    }
  }, [deleteTableInputValue, attrName]);

  return (
    <Modal
      theme='red'
      size='large'
      title={`Are sure You want To Delete ${attrName} in ${tableName} table`}
      show={showModalState}
      canConfirm={!tableError}
      canCancel
      topAligned
      modalConfirmed={confirmModalHandler}
      modalClosed={cancelModalHandler}>
      <h1 className={Style.header}>Please Enter Attribute Name To Confirm</h1>
      <Input
        label='Attribute Name'
        color='black'
        autoFocus
        value={deleteTableInputValue}
        onChange={createTableInputValueHandler}
        focusColor='black'
        size='large'
      />
      <ul className={Style.listContainer}>{lis}</ul>
    </Modal>
  );
}
export default DeleteAttrModal;
