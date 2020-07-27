import React, { useState, useEffect } from 'react';
import './styles.css';
import Nav from './components/Nav/Nav';
import MainGround from './components/MainGround/MainGround';
import SideBar from './components/Sidebar/Sidebar';
import { DndProvider } from 'react-dnd';
import backend from 'react-dnd-html5-backend';
import CreateTableModal from './CreateTableModal/CreateTableModal';
import './utils/Types';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { useLocalStorage } from './utils/customHooks/useLocalStorage';
import { code } from './utils/helper-function/createCode';
export default function App() {
  const [showGrid, toggleShowGrid] = useState(true);
  const [showSidebar, toggleSideBar] = useState(false);
  const [showModal, updateShowModal] = useState(false);
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

  function showGridHandler() {
    toggleShowGrid((prevShowGrid) => !prevShowGrid);
  }

  function showSidebarHandler() {
    toggleSideBar((prevShowSidebar) => !prevShowSidebar);
  }

  function pdf() {
    window.print();
  }

  useEffect(() => {
    function shortcutHandler(e) {
      console.log(e);
      // alt + s (sidebar toggle)
      if (
        e.altKey &&
        e.which === 83 &&
        e.isTrusted &&
        !e.ctrlKey &&
        !e.shiftKey
      ) {
        showSidebarHandler();
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
    return () => document.removeEventListener('keyup', shortcutHandler);
  }, [mainTableDetails]);

  return (
    <>
      <Nav
        showGrid={showGrid}
        showSideBar={showSidebar}
        onGridClick={showGridHandler}
        onCreateTableClick={newTableCreatedHandler}
        onSideBarClick={showSidebarHandler}
        Main={MainGround}
        mainTableDetails={mainTableDetails}
        tableDndDetails={tableDndDetails}
      />
      <CreateTableModal
        showModalState={showModal}
        allMainTableDetails={mainTableDetails}
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
          Add table <span className={'shrotcut'}>alt + t</span>
        </MenuItem>
        <MenuItem onClick={showGridHandler} className={'menuItem'}>
          {showGrid ? 'hide grid' : 'show grid'}{' '}
          <span className={'shrotcut'}>alt + g</span>
        </MenuItem>
        <MenuItem onClick={showSidebarHandler} className={'menuItem'}>
          {showSidebar ? 'hide sidebar' : 'show sidebar'}
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
