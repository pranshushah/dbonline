import React from 'react';
import Select from 'react-select';

/**
 * @typedef {object} tableDndDetailsObj
 * @property {number} top
 * @property {number} left
 * @property {string} tableName
 * @property {string} id
 * @property {string} color
 */

/**
 * @param {{currentTable:string,otherTables:tableDndDetailsObj[],onTableSelected:Function}} props
 */

function TableNameDropDown({
  currentTable,
  otherTables,
  onTableSelected,
  ...props
}) {
  const options = [];
  for (let i = 0; i < otherTables.length; i++) {
    if (currentTable !== otherTables[i].tableName) {
      options.push({
        label: `${otherTables[i].tableName}`,
        value: `${otherTables[i].tableName}`,
      });
    }
  }
  function tableSelectedHandler(value) {
    onTableSelected(value.value);
  }
  return (
    <Select
      options={options}
      onChange={tableSelectedHandler}
      placeholder='Select Referncing Table'
    />
  );
}

export default TableNameDropDown;
