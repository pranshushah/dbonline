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

function TableNameDropDown({ otherTables, onTableSelected }) {
  const options = [];
  for (let i = 0; i < otherTables.length; i++) {
    options.push({
      label: `${otherTables[i].tableName}`,
      value: `${otherTables[i].id}`,
    });
  }
  function tableSelectedHandler(value) {
    onTableSelected(value.value);
  }
  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: 'none',
      background: '#3e4452',
    }),
    placeholder: (base, state) => ({
      ...base,
      color: 'white',
    }),
    singleValue: (base, state) => ({
      ...base,
      color: 'white',
    }),
    menu: (base, state) => ({
      ...base,
      background: '#282c34',
      color: 'rgb(235, 235, 235)',
    }),
    option: (base, state) => ({
      ...base,
      background:
        state.isFocused && state.isSelected
          ? '#4b5263'
          : state.isSelected
          ? '#dcbc4f'
          : state.isFocused
          ? '#4b5263'
          : '#282c34',
      color:
        state.isFocused && state.isSelected
          ? 'rgb(235, 235, 235)'
          : state.isSelected
          ? 'rgb(30,30,30)'
          : 'rgb(235, 235, 235)',
    }),
  };
  return (
    <Select
      styles={customStyles}
      options={options}
      onChange={tableSelectedHandler}
      placeholder='Select Referencing Table'
    />
  );
}

export default TableNameDropDown;
