import React, { useState } from 'react';
import { dataTypes } from '../utils/attributeDataTypes';
import Select from 'react-select';

/**
 * @param {{onNewDataSelected:Function}} props
 */
function DataTypeDropDown({ onNewDataSelected, ...props }) {
  return (
    <div style={{ margin: '4px', marginTop: '15px' }}>
      <Select
        options={dataTypes}
        placeholder='Select DataType'
        onChange={onNewDataSelected}
      />
    </div>
  );
}

export default DataTypeDropDown;
