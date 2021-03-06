import React, { useState, useEffect, useReducer } from 'react';
import './styles.scss';
import Nav from './components/Nav/Nav';
import MainGround from './components/MainGround/MainGround';
import RightSideBar from './components/RightSidebar/RightSidebar';
import LeftSideBar from './components/LeftSidebar/LeftSidebar';
import CreateTableModal from './components/CreateTableModal/CreateTableModal';
import './utils/Types';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { useIdb } from './utils/customHooks/useIndexDb';
import { useRadio } from './utils/customHooks/useRadio';
import { code } from './utils/helper-function/createCode';
import { EXPLORERCONSTANT } from './utils/constant/explorer';
import {
  defaultRightSidebarState,
  rightSidebarReducer,
} from './utils/reducers/AppReducer';
import cloneDeep from 'clone-deep';
const parser = require('js-sql-parser');

export default function App() {
  //right sidebar state
  const [state, dispatch] = useReducer(
    rightSidebarReducer,
    defaultRightSidebarState,
  );
  const {
    selectedTable,
    showCheckConstraint,
    selectedCheckConstraintName,
    showUniqueConstraint,
    selectedUniqueConstraintName,
    showPrimaryConstraint,
    selectedPrimaryConstraintName,
    showForeignConstraint,
    selectedForeignConstraintName,
    showAttribute,
    selectedAttributeName,
  } = state;
  const [tempConstraintName, setTempConstraintName] = useState('');
  const [
    tempCheckConstraintExpression,
    setTempCheckConstraintExpression,
  ] = useState({});
  const [tempMultiSelect, setTempMultiSelect] = useState([]);
  const [tempSingleSelect, setTempSingleSelect] = useState({});
  const [referencingTable, setReferencingTable] = useState({});
  const [referencingAtt, setReferencingAtt] = useState({});
  const [checkedItem, setCheckedItem] = useState({});
  const [sizeInputValue, setSizeInputValue] = useState('');
  const [preInputValue, setPreInputValue] = useState('');
  const [defaultValue, setDefaultValue] = useState('');
  //app state
  const [showGrid, toggleShowGrid] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showModal, updateShowModal] = useState(false);
  const [showLeftSidebar, toogleLeftSidebar] = useState(true);
  const [tableDndDetails, updateTableDndDetails] = useIdb(
    [],
    'tableDndDetails',
  );
  const [radioArray, setRadioArray, , setInitialRadioArray] = useRadio();
  /**
   *@type {[mainTableDetailsType[],Function]} mainTableDetails
   */
  const [mainTableDetails, updateMainTableDetails] = useIdb(
    [],
    'mainTableDetails',
  );

  /**
   * @param {tableDndDetailsObj[]} newTableDndDetails
   */

  function tableDndDetailsHandler(newTableDndDetails) {
    updateTableDndDetails(newTableDndDetails);
  }

  function newTableCreatedHandler() {
    updateShowModal(true);
  }
  function cancelCreateTableModalHandler() {
    updateShowModal(false);
  }

  function mainTableDetailsChangeHandler(newMainTableDetails) {
    updateMainTableDetails(newMainTableDetails);
  }

  /**
   * @param {tableDndDetailsObj} newTable
   * @param {mainTableDetailsType} newMainTableDetail
   */
  function confirmCreateTableModalHandler(newTable, newMainTableDetail) {
    const newDetails = [...mainTableDetails, newMainTableDetail];
    updateMainTableDetails(newDetails);
    const newDndDetails = [...tableDndDetails, newTable];
    updateTableDndDetails(newDndDetails);
    updateShowModal(false);
  }

  function cleanupRightSidebar() {
    dispatch({ type: 'DEFAULT_STATE' });
    setShowRightSidebar(false);
    setTempConstraintName('');
    setTempCheckConstraintExpression('');
    setTempMultiSelect([]);
    setTempSingleSelect({});
    setReferencingTable({});
    setReferencingAtt({});
    setCheckedItem({});
    setPreInputValue('');
    setSizeInputValue('');
    setDefaultValue('');
  }

  /**
   *
   * @param {mainTableDetailsType} table
   * @param {string} type
   * @param {object} itemObj
   */
  function explorerItemClickHandler(table, type, itemObj) {
    dispatch({ type: 'CLOSE_PREVIOUS_BLOCK' });
    switch (type) {
      case EXPLORERCONSTANT.CHECK: {
        dispatch({
          type: 'CHECKCONSTRAINT_CONTAINER_SHOW',
          payload: { table, name: itemObj.constraintName },
        });
        setTempConstraintName(itemObj.constraintName);
        const str = parser.stringify(itemObj.AST).split('WHERE')[1];
        setTempCheckConstraintExpression(str.substring(2, str.length - 1));
        setShowRightSidebar(true);
        break;
      }
      case EXPLORERCONSTANT.UNIQUE: {
        const selectedOptions = [];
        const uniqueIndex = table.tableLevelConstraint.UNIQUETABLELEVEL.findIndex(
          (uniqObj) => uniqObj.constraintName === itemObj.constraintName,
        );
        table.tableLevelConstraint.UNIQUETABLELEVEL[
          uniqueIndex
        ].attributes.forEach((uid) => {
          const index = table.attributes.findIndex(
            (attrObj) => attrObj.id === uid,
          );
          selectedOptions.push({
            label: table.attributes[index].name,
            value: uid,
          });
        });
        dispatch({
          type: 'UNIQUECONSTRAINT_CONTAINER_SHOW',
          payload: { table, name: itemObj.constraintName },
        });
        setTempConstraintName(itemObj.constraintName);
        setTempMultiSelect(selectedOptions);
        setShowRightSidebar(true);
        break;
      }
      case EXPLORERCONSTANT.PRIMARY: {
        const selectedOptions = [];
        table.tableLevelConstraint.PRIMARYKEY.attributes.forEach((uid) => {
          const index = table.attributes.findIndex(
            (attrObj) => attrObj.id === uid,
          );
          selectedOptions.push({
            label: table.attributes[index].name,
            value: uid,
          });
        });
        dispatch({
          type: 'PRIMARYCONSTRAINT_CONTAINER_SHOW',
          payload: { table, name: itemObj.constraintName },
        });
        setTempConstraintName(itemObj.constraintName);
        setTempMultiSelect(selectedOptions);
        setShowRightSidebar(true);
        break;
      }
      case EXPLORERCONSTANT.FOREIGN: {
        dispatch({
          type: 'FOREIGNCONSTRAINT_CONTAINER_SHOW',
          payload: { table, name: itemObj.constraintName },
        });

        const referencedAttIndex = table.attributes.findIndex(
          (attrObj) => attrObj.id === itemObj.referencedAtt,
        );
        const referencingTableIndex = mainTableDetails.findIndex(
          (table) => table.id === itemObj.ReferencingTable,
        );
        const referencingAttIndex = mainTableDetails[
          referencingTableIndex
        ].attributes.findIndex(
          (attrObj) => attrObj.id === itemObj.ReferencingAtt,
        );

        setTempSingleSelect({
          label: table.attributes[referencedAttIndex].name,
          value: itemObj.referencedAtt,
        });

        setReferencingTable({
          label: mainTableDetails[referencingTableIndex].tableName,
          value: itemObj.ReferencingTable,
        });

        setReferencingAtt({
          label:
            mainTableDetails[referencingTableIndex].attributes[
              referencingAttIndex
            ].name,
          value: itemObj.ReferencingAtt,
        });
        const radio = [];
        if (itemObj.cascade) {
          radio.push({ label: 'CASCADE', value: 'CASCADE', checked: true });
          radio.push({ label: 'SET NULL', value: 'SET-NULL' });
        } else {
          radio.push({ label: 'CASCADE', value: 'CASCADE' });
          if (itemObj.setNull) {
            radio.push({ label: 'SET NULL', value: 'SET-NULL', checked: true });
          } else {
            radio.push({ label: 'SET NULL', value: 'SET-NULL' });
          }
        }
        setInitialRadioArray(radio);
        setTempConstraintName(itemObj.constraintName);
        setShowRightSidebar(true);
        break;
      }
      case EXPLORERCONSTANT.ATTRIBUTE: {
        const tempConstraint = {};
        if (itemObj.isNOTNULL) {
          tempConstraint['NOT-NULL'] = true;
        }
        if (itemObj.isUNIQUE) {
          tempConstraint['UNIQUE'] = true;
        }
        if (itemObj.isAUTOINCREMENT) {
          tempConstraint['AUTO-INCREMENT'] = true;
        }
        if (itemObj.DEFAULT) {
          tempConstraint['DEFAULT'] = true;
          setDefaultValue(itemObj.DEFAULT);
        }
        dispatch({
          type: 'ATTRIBUTE_SHOW',
          payload: { table, name: itemObj.name },
        });
        if (itemObj.size) {
          setSizeInputValue(itemObj.size);
        }
        if (itemObj.precision) {
          setPreInputValue(itemObj.precision);
        }
        setTempSingleSelect({
          label: itemObj.dataType,
          value: itemObj.dataType,
        });
        setTempConstraintName(itemObj.name);
        setShowRightSidebar(true);
        setCheckedItem(tempConstraint);
        break;
      }
      default: {
        return;
      }
    }
  }

  function rightSideBarAfterConfirmOrDelete(newMainTableDetails) {
    updateMainTableDetails(newMainTableDetails);
    cleanupRightSidebar();
  }

  function confirmUniqueConstraintClickHandler() {
    let finalConstraintName;
    if (tempConstraintName.length === 0) {
      finalConstraintName = selectedUniqueConstraintName;
    } else {
      finalConstraintName = tempConstraintName;
    }
    const newMainTableDetails = cloneDeep(mainTableDetails);

    const tableIndex = newMainTableDetails.findIndex(
      (table) => table.id === selectedTable.id,
    );

    const constraintIndex = newMainTableDetails[
      tableIndex
    ].tableLevelConstraint?.UNIQUETABLELEVEL.findIndex((uniqueObj) => {
      return uniqueObj.constraintName === selectedUniqueConstraintName;
    });

    newMainTableDetails[tableIndex].tableLevelConstraint.UNIQUETABLELEVEL[
      constraintIndex
    ] = {
      constraintName: finalConstraintName,
      attributes: tempMultiSelect.map((item) => item.value),
    };

    newMainTableDetails[tableIndex].attributes.forEach((attrObj) => {
      const index = attrObj.inTableLevelUniquConstraint.findIndex(
        (unique) => unique === selectedUniqueConstraintName,
      );
      if (index > -1) {
        attrObj.inTableLevelUniquConstraint.splice(index, 1);
      }
      const hasIndex = tempMultiSelect
        .map((item) => item.value)
        .findIndex((uid) => uid === attrObj.id);
      if (hasIndex > -1) {
        attrObj.inTableLevelUniquConstraint.push(finalConstraintName);
      }
    });

    updateMainTableDetails(newMainTableDetails);
    cleanupRightSidebar();
  }

  function confirmPrimaryConstraintClickHandler() {
    let finalConstraintName;
    if (tempConstraintName.length === 0) {
      finalConstraintName = selectedUniqueConstraintName;
    } else {
      finalConstraintName = tempConstraintName;
    }
    const newMainTableDetails = cloneDeep(mainTableDetails);

    const tableIndex = newMainTableDetails.findIndex(
      (table) => table.id === selectedTable.id,
    );

    newMainTableDetails[tableIndex].tableLevelConstraint.PRIMARYKEY = {
      constraintName: finalConstraintName,
      attributes: tempMultiSelect.map((item) => item.value),
    };

    newMainTableDetails[tableIndex].attributes.forEach((attrObj) => {
      const hasIndex = tempMultiSelect
        .map((item) => item.value)
        .findIndex((uid) => uid === attrObj.id);
      if (hasIndex > -1) {
        attrObj['isPRIMARYKEY'] = true;
      } else {
        delete attrObj.isPRIMARYKEY;
      }
    });

    updateMainTableDetails(newMainTableDetails);
    cleanupRightSidebar();
  }

  function deleteUniqueConstraintClickHandler() {
    const newMainTableDetails = cloneDeep(mainTableDetails);
    const tableIndex = newMainTableDetails.findIndex(
      (table) => table.id === selectedTable.id,
    );

    const constraintIndex = newMainTableDetails[
      tableIndex
    ].tableLevelConstraint?.UNIQUETABLELEVEL.findIndex((uniqueObj) => {
      return uniqueObj.constraintName === selectedCheckConstraintName;
    });

    newMainTableDetails[
      tableIndex
    ].tableLevelConstraint.UNIQUETABLELEVEL.splice(constraintIndex, 1);
    newMainTableDetails[tableIndex].attributes.forEach((attrObj) => {
      attrObj.inTableLevelUniquConstraint = attrObj.inTableLevelUniquConstraint.filter(
        (unique) => {
          return unique !== selectedUniqueConstraintName;
        },
      );
    });
    updateMainTableDetails(newMainTableDetails);
    cleanupRightSidebar();
  }

  function deletePrimaryConstraintClickHandler() {
    const newMainTableDetails = cloneDeep(mainTableDetails);
    const tableIndex = newMainTableDetails.findIndex(
      (table) => table.id === selectedTable.id,
    );
    newMainTableDetails[tableIndex].tableLevelConstraint.PRIMARYKEY = null;
    newMainTableDetails[tableIndex].attributes.forEach((attrObj) => {
      delete attrObj.isPRIMARYKEY;
    });
    updateMainTableDetails(newMainTableDetails);
    cleanupRightSidebar();
  }

  function showGridHandler() {
    toggleShowGrid((prevShowGrid) => !prevShowGrid);
  }

  function showRightSidebarHandler() {
    setShowRightSidebar((prevshowRightSidebar) => !prevshowRightSidebar);
  }

  function showLeftSidebarHandler() {
    toogleLeftSidebar((prevShowLeftSidebar) => !prevShowLeftSidebar);
  }

  function pdf() {
    window.print();
  }

  useEffect(() => {
    function shortcutHandler(e) {
      // ctrl + b (explorer sidebar toggle)
      if (!e.altKey && e.which === 66 && e.ctrlKey && !e.shiftKey) {
        showLeftSidebarHandler();
      }
      // alt + g (grid toggle)
      else if (e.altKey && e.which === 71 && !e.shiftKey && !e.ctrlKey) {
        showGridHandler();
      }
      //alt + t (new table)
      else if (!e.ctrlKey && e.which === 84 && e.altKey && !e.shiftKey) {
        newTableCreatedHandler();
      }
      // alt + c (get code)
      else if (!e.ctrlKey && e.which === 67 && e.altKey && !e.shiftKey) {
        code(mainTableDetails);
      }
    }
    document.addEventListener('keyup', shortcutHandler);
    return () => {
      document.removeEventListener('keyup', shortcutHandler);
    };
  }, [mainTableDetails]);
  console.log(mainTableDetails);
  return (
    <>
      <Nav
        showGrid={showGrid}
        showRightSidebar={showRightSidebar}
        showLeftSidebar={showLeftSidebar}
        onGridClick={showGridHandler}
        onCreateTableClick={newTableCreatedHandler}
        onRightSideBarClick={showRightSidebarHandler}
        onLeftSideBarClick={showLeftSidebarHandler}
        Main={MainGround}
        mainTableDetails={mainTableDetails}
        tableDndDetails={tableDndDetails}
      />
      {showModal && (
        <CreateTableModal
          showModalState={showModal}
          allMainTableDetails={mainTableDetails}
          onModalClosed={cancelCreateTableModalHandler}
          onModalConfirmed={confirmCreateTableModalHandler}
        />
      )}
      <ContextMenuTrigger id='same_unique_identifier' holdToDisplay={-1}>
        <div className='App'>
          {showLeftSidebar && (
            <LeftSideBar
              mainTableDetails={mainTableDetails}
              toggleSidebar={showLeftSidebarHandler}
              onItemClicked={explorerItemClickHandler}
              onMainTableDetailsChange={mainTableDetailsChangeHandler}
              onCreateTableButtonClick={newTableCreatedHandler}
            />
          )}
          <MainGround
            showGrid={showGrid}
            mainTableDetails={mainTableDetails}
            tableDndDetails={tableDndDetails}
            onMainTableDetailsChange={mainTableDetailsChangeHandler}
            onTableDndDetailsChange={tableDndDetailsHandler}
            onRowClicked={explorerItemClickHandler}
            onForeignArrowClicked={explorerItemClickHandler}
          />
          {showRightSidebar && (
            <RightSideBar
              mainTableDetails={mainTableDetails}
              toggleSidebar={showRightSidebarHandler}
              onCancel={cleanupRightSidebar}
              table={selectedTable}
              showCheckConstraint={showCheckConstraint}
              constraintName={tempConstraintName}
              checkExpr={tempCheckConstraintExpression}
              onConstraintNameChange={setTempConstraintName}
              onCheckExprChange={setTempCheckConstraintExpression}
              initialCheckConstraintName={selectedCheckConstraintName}
              showUniqueConstraint={showUniqueConstraint}
              initialUniqueConstraintName={selectedUniqueConstraintName}
              selectedMultipleSelect={tempMultiSelect}
              onMultipleSelectChange={setTempMultiSelect}
              onDeleteUniqueConstraint={deleteUniqueConstraintClickHandler}
              onConfirmUniqueConstraintClick={
                confirmUniqueConstraintClickHandler
              }
              showPrimaryConstraint={showPrimaryConstraint}
              initialPrimaryConstraintName={selectedPrimaryConstraintName}
              onDeletePrimaryConstraint={deletePrimaryConstraintClickHandler}
              onConfirmPrimaryConstraintClick={
                confirmPrimaryConstraintClickHandler
              }
              singleSelect={tempSingleSelect}
              referencingTable={referencingTable}
              referencingAtt={referencingAtt}
              initialForeignConstraintName={selectedForeignConstraintName}
              showForeignConstraint={showForeignConstraint}
              onSingleSelectChange={setTempSingleSelect}
              onReferencingAttChange={setReferencingAtt}
              onReferencingTableChange={setReferencingTable}
              checkedItem={checkedItem}
              onCheckedItemChange={setCheckedItem}
              showAttribute={showAttribute}
              initialAttributeName={selectedAttributeName}
              sizeInput={sizeInputValue}
              preInput={preInputValue}
              onSizeInputChange={setSizeInputValue}
              onPreInputChange={setPreInputValue}
              defaultValue={defaultValue}
              onDefaultValueChange={setDefaultValue}
              onRightSideBarAfterConfirmOrDelete={
                rightSideBarAfterConfirmOrDelete
              }
              foreignRadio={radioArray}
              onForeignRadioChange={setRadioArray}
            />
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenu id='same_unique_identifier' className={'menu'}>
        <MenuItem onClick={newTableCreatedHandler} className={'menuItem'}>
          Add table <span className={'shrotcut'}>alt + t</span>
        </MenuItem>
        <MenuItem onClick={showGridHandler} className={'menuItem'}>
          {showGrid ? 'hide grid' : 'show grid'}{' '}
          <span className={'shrotcut'}>alt + g</span>
        </MenuItem>
        <MenuItem onClick={() => code(mainTableDetails)} className={'menuItem'}>
          export as code
          <span className={'shrotcut'}>alt + c</span>
        </MenuItem>
        <MenuItem onClick={showLeftSidebarHandler} className={'menuItem'}>
          {showLeftSidebar ? 'hide sidebar' : 'show sidebar'}
          <span className={'shrotcut'}>ctrl + b</span>
        </MenuItem>
        <MenuItem onClick={pdf} className={'menuItem'}>
          export as pdf
          <span className={'shrotcut'}>ctrl + p</span>
        </MenuItem>
      </ContextMenu>
    </>
  );
}
