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
  showAttribute: false,
  selectedAttributeName: '',
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
    case 'ATTRIBUTE_SHOW': {
      return {
        ...state,
        selectedTable: action.payload.table,
        showAttribute: true,
        selectedAttributeName: action.payload.name,
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
        if (itemObj.cascade) {
          setCheckedItem({ CASCADE: true });
        } else {
          if (itemObj.setNull) {
            setCheckedItem({ 'SET-NULL': true });
          }
        }
        setTempConstraintName(itemObj.constraintName);
        setShowRightSidebar(true);
        break;
      }
      case EXPLORERCONSTANT.ATTRIBUTE: {
        //         NOT-NULL: true
        // UNIQUE: true
        // AUTO-INCREMENT: true
        // DEFAULT: true

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
    ] = {
      constraintName: finalConstraintName,
      AST: parser.parse(
        `select * from boom WHERE (${tempCheckConstraintExpression})`,
      ),
    };
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
    ].attributes.findIndex((attrObj) => attrObj.id === tempSingleSelect.value);

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
    ] = {
      referencedAtt: tempSingleSelect.value,
      ReferencingAtt: referencingAtt.value,
      ReferencingTable: referencingTable.value,
      constraintName: finalConstraintName,
      cascade: checkedItem['CASCADE'] ? true : false,
      setNull: checkedItem['SET-NULL'] ? true : false,
    };

    updateMainTableDetails(newMainTableDetails);
    cleanupRightSidebar();
  }

  function confirmAttributeClickHandler() {
    let finalAttributeName;
    if (tempConstraintName.length === 0) {
      finalAttributeName = selectedAttributeName;
    } else {
      finalAttributeName = tempConstraintName;
    }
    const newMainTableDetails = cloneDeep(mainTableDetails);
    const tableIndex = newMainTableDetails.findIndex(
      (table) => table.tableName === selectedTable.tableName,
    );
    const attrIndex = newMainTableDetails[tableIndex].attributes.findIndex(
      (attrObj) => attrObj.name === selectedAttributeName,
    );
    newMainTableDetails[tableIndex].attributes[attrIndex] = {
      ...newMainTableDetails[tableIndex].attributes[attrIndex],
      name: finalAttributeName,
      dataType: tempSingleSelect.value,
      size: sizeInputValue ? sizeInputValue : undefined,
      precision: preInputValue ? preInputValue : undefined,
      isNOTNULL: checkedItem['NOT-NULL'] ? true : false,
      isUNIQUE: checkedItem['UNIQUE'] ? true : false,
      isAUTOINCREMENT: checkedItem['AUTO-INCREMENT'] ? true : false,
      DEFAULT: checkedItem['DEFAULT'] ? defaultValue : undefined,
    };
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

  function deleteAttributeHandler() {
    const newMainTableDetails = cloneDeep(mainTableDetails);

    const index = newMainTableDetails.findIndex(
      (table) => table.tableName === selectedTable.tableName,
    );

    const selectedAttributeIndexForDeleteAttribute = newMainTableDetails[
      index
    ].attributes.findIndex((attrObj) => attrObj.name === selectedAttributeName);

    newMainTableDetails[index].attributes.splice(
      selectedAttributeIndexForDeleteAttribute,
      1,
    );

    // clean-up

    //unique-key
    if (
      selectedTable.attributes[selectedAttributeIndexForDeleteAttribute]
        ?.inTableLevelUniquConstraint.length !== 0
    ) {
      selectedTable.attributes[
        selectedAttributeIndexForDeleteAttribute
      ].inTableLevelUniquConstraint.forEach((cName) => {
        newMainTableDetails[index].attributes.forEach((attr) => {
          attr.inTableLevelUniquConstraint = attr?.inTableLevelUniquConstraint.filter(
            (entity) => entity !== cName,
          );
        });
      });
      newMainTableDetails[
        index
      ].tableLevelConstraint.UNIQUETABLELEVEL = newMainTableDetails[
        index
      ].tableLevelConstraint.UNIQUETABLELEVEL.filter((obj) => {
        return !selectedTable.attributes[
          selectedAttributeIndexForDeleteAttribute
        ].inTableLevelUniquConstraint.includes(obj.constraintName);
      });
    }

    // foreign-key

    if (
      selectedTable.attributes[selectedAttributeIndexForDeleteAttribute]
        ?.isFOREIGNKEY
    ) {
      newMainTableDetails[
        index
      ].tableLevelConstraint.FOREIGNKEY = newMainTableDetails[
        index
      ].tableLevelConstraint.FOREIGNKEY.filter(
        (obj) =>
          !obj.referencedAtt ===
          selectedTable.attributes[selectedAttributeIndexForDeleteAttribute].id,
      );
    }

    //primary-key
    if (
      selectedTable.attributes[selectedAttributeIndexForDeleteAttribute]
        .isPRIMARYKEY
    ) {
      newMainTableDetails[index].attributes.forEach((attr) => {
        if (attr.isPRIMARYKEY) {
          delete attr.isPRIMARYKEY;
        }
      });
      newMainTableDetails[index].tableLevelConstraint.PRIMARYKEY = null;
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
      if (!e.altKey && e.which === 68 && !e.ctrlKey && e.shiftKey) {
        showRightSidebarHandler();
      }
      // shift + e (explorer sidebar toggle)
      if (!e.altKey && e.which === 69 && !e.ctrlKey && e.shiftKey) {
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
      // alt + p (print design)
      else if (!e.ctrlKey && e.which === 80 && e.altKey && !e.shiftKey) {
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
            onRowClicked={explorerItemClickHandler}
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
              singleSelect={tempSingleSelect}
              referencingTable={referencingTable}
              referencingAtt={referencingAtt}
              initialForeignConstraintName={selectedForeignConstraintName}
              showForeignConstraint={showForeignConstraint}
              onSingleSelectChange={setTempSingleSelect}
              onReferencingAttChange={setReferencingAtt}
              onReferencingTableChange={setReferencingTable}
              onDeleteForeignConstraint={deleteForeignConstraintClickHandler}
              onConfirmForeignConstraintClick={
                confirmForeignConstraintClickHandler
              }
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
              onDeleteAttribute={deleteAttributeHandler}
              onConfirmAttribute={confirmAttributeClickHandler}
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
