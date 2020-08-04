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
  showUniqueConstraint: true,
  selectedUniqueConstraintName: '',
};
function rightSidebarReducer(state, action) {
  switch (action.type) {
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
  } = state;
  const [tempConstraintName, setTempConstraintName] = useState('');
  const [
    tempCheckConstraintExpression,
    setTempCheckConstraintExpression,
  ] = useState({});
  const [tempTableLevelUnique, setTempTableLevelUnique] = useState([]);

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
    setTempTableLevelUnique([]);
  }

  /**
   *
   * @param {mainTableDetailsType} table
   * @param {string} type
   * @param {object} itemObj
   */
  function explorerItemClickHandler(table, type, itemObj) {
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
        setTempTableLevelUnique(selectedOptions);
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
    ].attributes = tempTableLevelUnique.map((item) => item.value);

    newMainTableDetails[tableIndex].attributes.forEach((attrObj) => {
      const index = attrObj.inTableLevelUniquConstraint.findIndex(
        (unique) => unique === selectedUniqueConstraintName,
      );
      if (index > -1) {
        attrObj.inTableLevelUniquConstraint.splice(index, 1);
      }
      const hasIndex = tempTableLevelUnique
        .map((item) => item.value)
        .findIndex((uid) => uid === attrObj.id);
      if (hasIndex > -1) {
        attrObj.inTableLevelUniquConstraint.push(finalConstraintName);
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
              selectedTableUnique={tempTableLevelUnique}
              onTableLevelUniqueChange={setTempTableLevelUnique}
              onDeleteUniqueConstraint={deleteUniqueConstraintClickHandler}
              onConfirmUniqueConstraintClick={
                confirmUniqueConstraintClickHandler
              }
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
