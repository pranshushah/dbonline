import React, { useState } from 'react';
import './styles.css';
import Nav from './Nav';
import uuid from 'uuid/v4';
import MainGround from './MainGround';
import SideBar from './Sidebar';
import { DndProvider } from 'react-dnd';
import backend from 'react-dnd-html5-backend';
import TABLECOLORS from './utils/tableColors';
import CreateTableModal from './CreateTableModal/CreateTableModal';
import './utils/Types';

export default function App() {
  const [showGrid, toggleShowGrid] = useState(true);
  const [showSidebar, toggleSideBar] = useState(false);
  const [showModal, updateShowModal] = useState(false);
  const [tableDndDetails, updateTableDndDetails] = useState([
    {
      top: 20,
      left: 350,
      tableName: 'student',
      id: uuid(),
      color: TABLECOLORS.GREEN,
    },
    {
      top: 250,
      left: 350,
      tableName: 'result',
      id: uuid(),
      color: TABLECOLORS.DARKBROWN,
    },
  ]);

  /**
   *@type {[mainTableDetailsType[],Function]} mainTableDetails
   */
  const [mainTableDetails, updateMainTableDetails] = useState([
    {
      tableName: 'result',
      attributes: [
        { name: 'result id', dataType: 'VARCHAR', size: 255 },
        { name: 'student id', dataType: 'VARCHAR', size: 255 },
        {
          name: 'percentagepranshu',
          dataType: 'DOUBLE',
          size: 125,
          precision: 13,
        },
      ],
      tableLevelConstraint: {
        PRIMARYKEY: 'result id',
        FOREIGNKEY: [],
      },
      columnLevelConstraint: {
        NOTNULL: ['result id', 'student id'],
        UNIQUE: ['result id', 'student id'],
      },
    },
    {
      tableName: 'student',
      attributes: [
        { name: 'student id', dataType: 'VARCHAR', size: 255 },
        { name: 'name', dataType: 'VARCHAR', size: 255 },
        { name: 'age', dataType: 'INTEGER' },
      ],
      tableLevelConstraint: {
        PRIMARYKEY: 'student id',
        FOREIGNKEY: [],
      },
      columnLevelConstraint: {
        NOTNULL: ['student id', 'name', 'age'],
        UNIQUE: ['student id'],
      },
    },
  ]);

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
    if (newTable) {
      updateMainTableDetails((mainTableDetails) => [
        ...mainTableDetails,
        newMainTableDetail,
      ]);
      updateTableDndDetails((tableDetails) => [...tableDetails, newTable]);
    }
    updateShowModal(false);
  }

  function showGridHandler() {
    toggleShowGrid((prevShowGrid) => !prevShowGrid);
  }

  function showSidebarHandler() {
    toggleSideBar((prevShowSidebar) => !prevShowSidebar);
  }

  return (
    <>
      <Nav
        showGrid={showGrid}
        showSideBar={showSidebar}
        onGridClick={showGridHandler}
        onCreateTableClick={newTableCreatedHandler}
        onSideBarClick={showSidebarHandler}
      />
      <CreateTableModal
        showModalState={showModal}
        onModalClosed={cancelCreateTableModalHandler}
        onModalConfirmed={confirmCreateTableModalHandler}
      />
      <div className='App'>
        <DndProvider backend={backend}>
          <MainGround
            showGrid={showGrid}
            mainTableDetails={mainTableDetails}
            tableDndDetails={tableDndDetails}
            onMainTableDetailsChange={mainTableDetailsChangeHandler}
            onTableDndDetailsChange={tableDndDetailsHandler}
          />
        </DndProvider>
        {showSidebar && <SideBar />}
      </div>
    </>
  );
}
