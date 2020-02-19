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

/**
 * @typedef {object} tableDndDetailsObj
 * @property {number} top
 * @property {number} left
 * @property {string} tableName
 * @property {string} id
 * @property {string} color
 */

export default function App() {
  const [showGrid, toggleShowGrid] = useState(true);
  const [showSidebar, toggleSideBar] = useState(true);
  const [showModal, updateShowModal] = useState(false);
  const [tableDndDetails, updateTableDndDetails] = useState([
    {
      top: 20,
      left: 350,
      tableName: 'pranshu23',
      id: uuid(),
      color: TABLECOLORS.GREEN,
    },
    {
      top: 250,
      left: 350,
      tableName: 'pranshu1',
      id: uuid(),
      color: TABLECOLORS.DARKBROWN,
    },
  ]);

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

  /**
   * @param {tableDndDetailsObj} newTable
   */
  function confirmCreateTableModalHandler(newTable) {
    if (newTable) {
      updateTableDndDetails(tableDetails => [...tableDetails, newTable]);
    }
    updateShowModal(false);
  }

  function showGridHandler() {
    toggleShowGrid(prevShowGrid => !prevShowGrid);
  }

  function showSidebarHandler() {
    toggleSideBar(prevShowSidebar => !prevShowSidebar);
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
            tableDndDetails={tableDndDetails}
            onTableDndDetailsChange={tableDndDetailsHandler}
          />
        </DndProvider>
        {showSidebar && <SideBar />}
      </div>
    </>
  );
}
