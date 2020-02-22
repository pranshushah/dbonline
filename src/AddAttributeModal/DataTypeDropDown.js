import React from 'react';
import { dataTypes } from '../utils/attributeDataTypes';
import Select from 'react-select';

/**
 * @param {{onNewDataSelected:Function}} props
 */
function DataTypeDropDown({ onNewDataSelected, ...props }) {
  function changeHandler(value) {
    onNewDataSelected(value.value);
  }
  return (
    <div style={{ margin: '4px', marginTop: '15px' }}>
      <Select
        options={dataTypes}
        placeholder='Select DataType'
        onChange={changeHandler}
      />
    </div>
  );
}

export default DataTypeDropDown;
