import React from 'react';
import { dataTypes } from '../../utils/attributeDataTypes';
import Select from 'react-select';
import './dropdown.scss';
/**
 * @param {{onNewDataSelected:Function,selectedValue:string}} props
 */
function DataTypeDropDown({ onNewDataSelected, selectedValue, ...props }) {
  function changeHandler(value) {
    onNewDataSelected(value.value);
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
    groupHeading: (base, state) => ({
      ...base,
      background: '#282c34',
      color: 'rgba(235, 235, 235, 0.7)',
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
    <div style={{ marginTop: '18px' }}>
      <Select
        value={
          selectedValue ? { label: selectedValue, value: selectedValue } : null
        }
        styles={customStyles}
        options={dataTypes}
        placeholder='Select DataType'
        onChange={changeHandler}
      />
    </div>
  );
}

export default DataTypeDropDown;
