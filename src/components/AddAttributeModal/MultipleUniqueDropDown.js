import React from 'react';
import Select from 'react-select';
import '../../utils/Types';

/**
 * @param {{currentTable:mainTableDetailsType,allTables:mainTableDetailsType[],onAttrSelected:Function}} props
 */

function MultipleUniqueDropDown({
  allTables,
  onAttrSelected,
  currentTable,
  currentValue,
}) {
  const index = allTables.findIndex(
    (mainTableDetail) => mainTableDetail.id === currentTable.id,
  );

  const options = [];
  for (let i = 0; i < allTables[index].attributes.length; i++) {
    options.push({
      label: allTables[index].attributes[i].name,
      value: allTables[index].attributes[i].id,
    });
  }
  // adding current value;
  if (currentValue) {
    options.push({ label: currentValue, value: null });
  }
  function uniqueSelectHandler(value) {
    onAttrSelected(value);
  }
  return (
    <Select
      options={options}
      isMulti
      onChange={uniqueSelectHandler}
      placeholder='Select Composite Unique Key'
    />
  );
}

export default MultipleUniqueDropDown;
