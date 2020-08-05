import React, { useState, useEffect, useReducer } from 'react';
import './styles.css';
import Nav from './components/Nav/Nav';
import MainGround from './components/MainGround/MainGround';
import RightSideBar from './components/RightSidebar/RightSidebar';
import LeftSideBar from './components/LeftSidebar/LeftSidebar';
import CreateTableModal from './components/CreateTableModal/CreateTableModal';
import './utils/Types';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { useLocalStorage } from './utils/customHooks/useLocalStorage';
import { code } from './utils/helper-function/createCode';
import { EXPLORERCONSTANT } from './utils/constant/explorer';
import cloneDeep from 'clone-deep';
const parser = require('js-sql-parser');

const defaultRightSidebarState = {
  selectedTable: {},
  showCheckConstraint: false,
  selectedCheckConstraintName: '',
  showUniqueConstraint: false,
  selectedUniqueConstraintName: '',
  showPrimaryConstraint: false,
  selectedPrimaryConstraintName: '',
  showForeignConstraint: false,
  selectedForeignConstraintName: '',
};
function rightSidebarReducer(state, action) {
  switch (action.type) {
    case 'CLOSE_PREVIOUS_BLOCK': {
      return {
        ...state,
        showCheckConstraint: false,
        showForeignConstraint: false,
        showPrimaryConstraint: false,
        showUniqueConstraint: false,
      };
    }
    case 'CHECKCONSTRAINT_CONTAINER_SHOW': {
      return {
        ...state,
        selectedTable: action.payload.table,
        showCheckConstraint: true,
        selectedCheckConstraintName: action.payload.name,
      };
    }
    case 'UNIQUECONSTRAINT_CONTAINER_SHOW': {
      return {
        ...state,
        selectedTable: action.payload.table,
        showUniqueConstraint: true,
        selectedUniqueConstraintName: action.payload.name,
      };
    }
    case 'PRIMARYCONSTRAINT_CONTAINER_SHOW': {
      return {
        ...state,
        selectedTable: action.payload.table,
        showPrimaryConstraint: true,
        selectedPrimaryConstraintName: action.payload.name,
      };
    }
    case 'FOREIGNCONSTRAINT_CONTAINER_SHOW': {
      return {
        ...state,
        selectedTable: action.payload.table,
        showForeignConstraint: true,
        selectedForeignConstraintName: action.payload.name,
      };
    }
    case 'DEFAULT_STATE': {
      return defaultRightSidebarState;
    }
    default: {
      return state;
    }
  }
}
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
  } = state;
  const [tempConstraintName, setTempConstraintName] = useState('');
  const [
    tempCheckConstraintExpression,
    setTempCheckConstraintExpression,
  ] = useState({});
  const [tempMultiSelect, setTempMultiSelect] = useState([]);
  const [referencedAtt, setReferencedAtt] = useState({});
  const [referencingTable, setReferencingTable] = useState({});
  const [referencingAtt, setReferencingAtt] = useState({});
  const [foreignCheckedItem, setForeignCheckedItem] = useState({});

  //app state
  const [showGrid, toggleShowGrid] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showModal, updateShowModal] = useState(false);
  const [showLeftSidebar, toogleLeftSidebar] = useState(true);
  const [tableDndDetails, updateTableDndDetails] = useLocalStorage(
    [],
    'tableDndDetails',
  );
  /**
   *@type {[mainTableDetailsType[],Function]} mainTableDetails
   */
  const [mainTableDetails, updateMainTableDetails] = useLocalStorage(
    [],
    'mainTableDetails',
  );

  /**
   * @param {tableDndDetailsObj[]} newTableDndDetails
   */

  function tableDndDetailsHandler(newTableDndDetails) {
    updateTableDndDetails(newTableDndDetails);
  }

  function mainTableDetailsChangeHandler(newMainTableDetails) {
    updateMainTableDetails(newMainTableDetails);
  }

  function newTableCreatedHandler() {
    updateShowModal(true);
  }
  function cancelCreateTableModalHandler() {
    updateShowModal(false);
  }

  /**
   * @param {tableDndDetailsObj} newTable
   * @param {mainTableDetailsType} newMainTableDetail
   */
  function confirmCreateTableModalHandler(newTable, newMainTableDetail) {
    updateMainTableDetails((mainTableDetails) => [
      ...mainTableDetails,
      newMainTableDetail,
    ]);
    updateTableDndDetails((tableDetails) => [...tableDetails, newTable]);
    updateShowModal(false);
  }

  function cleanupRightSidebar() {
    dispatch({ type: 'DEFAULT_STATE' });
    setShowRightSidebar(false);
    setTempConstraintName('');
    setTempCheckConstraintExpression('');
    setTempMultiSelect([]);
    setReferencedAtt({});
    setReferencingTable({});
    setReferencingAtt({});
    setForeignCheckedItem({});
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

        setReferencedAtt({
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
        if (itemObj.cascade) {
          setForeignCheckedItem({ CASCADE: true });
        } else {
          if (itemObj.setNull) {
            setForeignCheckedItem({ 'SET-NULL': true });
          }
        }
        setTempConstraintName(itemObj.constraintName);
        setShowRightSidebar(true);
        break;
      }
      default: {
        return;
      }
    }
  }

  function confirmCheckConstraintClickHandler() {
    let finalConstraintName;
    if (tempConstraintName.length === 0) {
      finalConstraintName = selectedCheckConstraintName;
    } else {
      finalConstraintName = tempConstraintName;
    }
    const newMainTableDetails = cloneDeep(mainTableDetails);
    const tableIndex = newMainTableDetails.findIndex(
      (table) => table.id === selectedTable.id,
    );
    const constraintIndex = newMainTableDetails[
      tableIndex
    ].tableLevelConstraint?.CHECK.findIndex((checkObj) => {
      return checkObj.constraintName === selectedCheckConstraintName;
    });
    newMainTableDetails[tableIndex].tableLevelConstraint.CHECK[
      constraintIndex
    ].constraintName = finalConstraintName;
    newMainTableDetails[tableIndex].tableLevelConstraint.CHECK[
      constraintIndex
    ].AST = parser.parse(
      `select * from boom WHERE (${tempCheckConstraintExpression})`,
    );
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
    ].constraintName = finalConstraintName;

    newMainTableDetails[tableIndex].tableLevelConstraint.UNIQUETABLELEVEL[
      constraintIndex
    ].attributes = tempMultiSelect.map((item) => item.value);

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

    newMainTableDetails[
      tableIndex
    ].tableLevelConstraint.PRIMARYKEY.constraintName = finalConstraintName;

    newMainTableDetails[
      tableIndex
    ].tableLevelConstraint.PRIMARYKEY.attributes = tempMultiSelect.map(
      (item) => item.value,
    );

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

  function deleteCheckConstraintClickHandler() {
    const newMainTableDetails = cloneDeep(mainTableDetails);
    const tableIndex = newMainTableDetails.findIndex(
      (table) => table.id === selectedTable.id,
    );
    const constraintIndex = newMainTableDetails[
      tableIndex
    ].tableLevelConstraint?.CHECK.findIndex((checkObj) => {
      return checkObj.constraintName === selectedCheckConstraintName;
    });
    newMainTableDetails[tableIndex].tableLevelConstraint.CHECK.splice(
      constraintIndex,
      1,
    );
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
  function deleteForeignConstraintClickHandler() {
    const newMainTableDetails = cloneDeep(mainTableDetails);
    const referencedTableIndex = newMainTableDetails.findIndex(
      (table) => table.id === selectedTable.id,
    );

    const foreignConstraintIndex = newMainTableDetails[
      referencedTableIndex
    ].tableLevelConstraint.FOREIGNKEY.findIndex(
      (foreignObj) =>
        foreignObj.constraintName === selectedForeignConstraintName,
    );

    const referencedAttIndex = newMainTableDetails[
      referencedTableIndex
    ].attributes.findIndex(
      (attrObj) =>
        attrObj.id ===
        newMainTableDetails[referencedTableIndex].tableLevelConstraint
          .FOREIGNKEY[foreignConstraintIndex].referencedAtt,
    );

    newMainTableDetails[
      referencedTableIndex
    ].tableLevelConstraint.FOREIGNKEY.splice(foreignConstraintIndex, 1);

    delete newMainTableDetails[referencedTableIndex].attributes[
      referencedAttIndex
    ].isFOREIGNKEY;

    // add new stuff

    updateMainTableDetails(newMainTableDetails);
    cleanupRightSidebar();
  }

  function confirmForeignConstraintClickHandler() {
    let finalConstraintName;
    if (tempConstraintName.length === 0) {
      finalConstraintName = selectedForeignConstraintName;
    } else {
      finalConstraintName = tempConstraintName;
    }
    const newMainTableDetails = cloneDeep(mainTableDetails);
    const referencedTableIndex = newMainTableDetails.findIndex(
      (table) => table.id === selectedTable.id,
    );

    const referencedAttIndex = newMainTableDetails[
      referencedTableIndex
    ].attributes.findIndex((attrObj) => attrObj.id === referencedAtt.value);

    const referencingTableIndex = newMainTableDetails.findIndex(
      (table) => table.id === referencingTable.value,
    );

    const referencingAttIndex = newMainTableDetails[
      referencingTableIndex
    ].attributes.findIndex((attrObj) => attrObj.id === referencingAtt.value);

    //delete old stuff

    const foreignConstraintIndex = newMainTableDetails[
      referencedTableIndex
    ].tableLevelConstraint.FOREIGNKEY.findIndex(
      (foreignObj) =>
        foreignObj.constraintName === selectedForeignConstraintName,
    );

    const oldReferencedAttIndex = newMainTableDetails[
      referencedTableIndex
    ].attributes.findIndex(
      (attrObj) =>
        attrObj.id ===
        newMainTableDetails[referencedTableIndex].tableLevelConstraint
          .FOREIGNKEY[foreignConstraintIndex].referencedAtt,
    );

    delete newMainTableDetails[referencedTableIndex].attributes[
      oldReferencedAttIndex
    ].isFOREIGNKEY;

    // add new stuff

    newMainTableDetails[referencedTableIndex].attributes[
      referencedAttIndex
    ].dataType =
      newMainTableDetails[referencingTableIndex].attributes[
        referencingAttIndex
      ].dataType;

    newMainTableDetails[referencedTableIndex].attributes[referencedAttIndex][
      'size'
    ] =
      newMainTableDetails[referencingTableIndex].attributes[
        referencingAttIndex
      ]?.size;

    newMainTableDetails[referencedTableIndex].attributes[referencedAttIndex][
      'precision'
    ] =
      newMainTableDetails[referencingTableIndex].attributes[
        referencingAttIndex
      ]?.precision;

    newMainTableDetails[referencedTableIndex].attributes[
      referencedAttIndex
    ].isFOREIGNKEY = true;

    newMainTableDetails[referencedTableIndex].tableLevelConstraint.FOREIGNKEY[
      foreignConstraintIndex
    ].referencedAtt = referencedAtt.value;

    newMainTableDetails[referencedTableIndex].tableLevelConstraint.FOREIGNKEY[
      foreignConstraintIndex
    ].ReferencingAtt = referencingAtt.value;

    newMainTableDetails[referencedTableIndex].tableLevelConstraint.FOREIGNKEY[
      foreignConstraintIndex
    ].ReferencingTable = referencingTable.value;

    newMainTableDetails[referencedTableIndex].tableLevelConstraint.FOREIGNKEY[
      foreignConstraintIndex
    ].constraintName = finalConstraintName;

    if (foreignCheckedItem['CASCADE']) {
      console.log('bbom');
      newMainTableDetails[referencedTableIndex].tableLevelConstraint.FOREIGNKEY[
        foreignConstraintIndex
      ].cascade = true;
      newMainTableDetails[referencedTableIndex].tableLevelConstraint.FOREIGNKEY[
        foreignConstraintIndex
      ].setNull = false;
    } else {
      if (foreignCheckedItem['SET-NULL']) {
        newMainTableDetails[
          referencedTableIndex
        ].tableLevelConstraint.FOREIGNKEY[
          foreignConstraintIndex
        ].setNull = true;
        newMainTableDetails[
          referencedTableIndex
        ].tableLevelConstraint.FOREIGNKEY[
          foreignConstraintIndex
        ].cascade = false;
      }
    }

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
      // shift + d (details sidebar toggle)
      if (
        !e.altKey &&
        e.which === 68 &&
        e.isTrusted &&
        !e.ctrlKey &&
        e.shiftKey
      ) {
        showRightSidebarHandler();
      }
      // shift + e (explorer sidebar toggle)
      if (
        !e.altKey &&
        e.which === 69 &&
        e.isTrusted &&
        !e.ctrlKey &&
        e.shiftKey
      ) {
        showLeftSidebarHandler();
      }
      // alt + g (grid toggle)
      else if (
        e.altKey &&
        e.which === 71 &&
        !e.shiftKey &&
        !e.ctrlKey &&
        e.isTrusted
      ) {
        showGridHandler();
      }
      //alt + t (new table)
      else if (
        !e.ctrlKey &&
        e.which === 84 &&
        e.altKey &&
        !e.shiftKey &&
        e.isTrusted
      ) {
        newTableCreatedHandler();
      }
      // alt + c (get code)
      else if (
        !e.ctrlKey &&
        e.which === 67 &&
        e.altKey &&
        !e.shiftKey &&
        e.isTrusted
      ) {
        code(mainTableDetails);
      }
      // alt + p (print design)
      else if (
        !e.ctrlKey &&
        e.which === 80 &&
        e.altKey &&
        !e.shiftKey &&
        e.isTrusted
      ) {
        pdf();
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
            />
          )}
          <MainGround
            showGrid={showGrid}
            mainTableDetails={mainTableDetails}
            tableDndDetails={tableDndDetails}
            onMainTableDetailsChange={mainTableDetailsChangeHandler}
            onTableDndDetailsChange={tableDndDetailsHandler}
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
              onConfirmCheckConstraintClick={confirmCheckConstraintClickHandler}
              onDeleteCheckConstraint={deleteCheckConstraintClickHandler}
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
              referencedAtt={referencedAtt}
              referencingTable={referencingTable}
              referencingAtt={referencingAtt}
              initialForeignConstraintName={selectedForeignConstraintName}
              showForeignConstraint={showForeignConstraint}
              onReferencedAttChange={setReferencedAtt}
              onReferencingAttChange={setReferencingAtt}
              onReferencingTableChange={setReferencingTable}
              onDeleteForeignConstraint={deleteForeignConstraintClickHandler}
              onConfirmForeignConstraintClick={
                confirmForeignConstraintClickHandler
              }
              foreignCheckedItem={foreignCheckedItem}
              onForeignCheckedItem={setForeignCheckedItem}
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
        <MenuItem onClick={showRightSidebarHandler} className={'menuItem'}>
          {showRightSidebar ? 'hide sidebar' : 'show sidebar'}
          <span className={'shrotcut'}>alt + s</span>
        </MenuItem>
        <MenuItem onClick={pdf} className={'menuItem'}>
          export as pdf
          <span className={'shrotcut'}>alt + p</span>
        </MenuItem>
        <MenuItem onClick={() => code(mainTableDetails)} className={'menuItem'}>
          export as code
          <span className={'shrotcut'}>alt + c</span>
        </MenuItem>
      </ContextMenu>
    </>
  );
}
