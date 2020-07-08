import React, { useState, useEffect } from 'react';
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
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

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
    updateMainTableDetails((mainTableDetails) => [
      ...mainTableDetails,
      newMainTableDetail,
    ]);
    updateTableDndDetails((tableDetails) => [...tableDetails, newTable]);
    updateShowModal(false);
  }

  function showGridHandler() {
    toggleShowGrid((prevShowGrid) => !prevShowGrid);
  }

  function showSidebarHandler() {
    toggleSideBar((prevShowSidebar) => !prevShowSidebar);
  }

  useEffect(() => {
    function shortcutHandler(e) {
      // ctrl + b (sidebar toggle)
      if (e.ctrlKey && e.which === 66) {
        showSidebarHandler();
      }
      // ctrl + i (grid toggle)
      else if (e.ctrlKey && e.which === 73 && !e.shiftKey) {
        showGridHandler();
        //ctrl + shift + s
      } else if (e.ctrlKey && e.which === 83 && e.shiftKey) {
        newTableCreatedHandler();
      }
    }
    document.addEventListener('keyup', shortcutHandler);
    return () => document.removeEventListener('keyup', shortcutHandler);
  }, []);

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

      <ContextMenuTrigger id='same_unique_identifier' holdToDisplay={-1}>
        <div className='App'>
          <DndProvider backend={backend}>
            <MainGround
              showGrid={showGrid}
              mainTableDetails={mainTableDetails}
              tableDndDetails={tableDndDetails}
              onMainTableDetailsChange={mainTableDetailsChangeHandler}
              onTableDndDetailsChange={tableDndDetailsHandler}
            />
            {showSidebar && <SideBar />}
          </DndProvider>
        </div>
      </ContextMenuTrigger>
      <ContextMenu id='same_unique_identifier' className={'menu'}>
        <MenuItem onClick={newTableCreatedHandler} className={'menuItem'}>
          Add table <span className={'shrotcut'}>ctrl + shift + s</span>
        </MenuItem>
        <MenuItem onClick={showGridHandler} className={'menuItem'}>
          {showGrid ? 'hide grid' : 'show grid'}{' '}
          <span className={'shrotcut'}>ctrl + i</span>
        </MenuItem>
        <MenuItem onClick={showSidebarHandler} className={'menuItem'}>
          {showSidebar ? 'hide sidebar' : 'show sidebar'}
          <span className={'shrotcut'}>ctrl + b</span>
        </MenuItem>
      </ContextMenu>
    </>
  );
}
