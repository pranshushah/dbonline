import React from 'react';
import { dataTypes } from '../utils/attributeDataTypes';
import Select from 'react-select';

/**
 * @param {{onNewDataSelected:Function,selectedValue:string}} props
 */
function DataTypeDropDown({ onNewDataSelected, selectedValue, ...props }) {
  function changeHandler(value) {
    onNewDataSelected(value.value);
  }
  console.log(selectedValue);
  return (
    <div style={{ margin: '4px', marginTop: '15px' }}>
      <Select
        value={
          selectedValue ? { label: selectedValue, value: selectedValue } : null
        }
        options={dataTypes}
        placeholder='Select DataType'
        onChange={changeHandler}
      />
    </div>
  );
}

export default DataTypeDropDown;
