import React from 'react';
import Select from 'react-select';
import '../../utils/Types';

/**
 * @param {{primaryKeyValues:Array,currentTable:mainTableDetailsType,allTables:mainTableDetailsType[],onAttrSelected:Function}} props
 */

function primaryKeyDropDown({
  allTables,
  onAttrSelected,
  currentTable,
  currentValue,
  primaryKeyValues,
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
    multiValue: (base, state) => ({
      ...base,
      background: '#dcbc4f',
      color: 'rgb(35,35,35)',
    }),
    multiValueLabel: (base, state) => ({
      ...base,
      color: 'rgb(35,35,35)',
    }),
    menu: (base, state) => ({
      ...base,
      background: '#282c34',
      color: 'rgb(235, 235, 235)',
    }),
    option: (base, state) => {
      return {
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
      };
    },
  };
  return (
    <Select
      options={options}
      value={primaryKeyValues}
      isMulti
      styles={customStyles}
      onChange={uniqueSelectHandler}
      placeholder='Select primary key'
    />
  );
}

export default primaryKeyDropDown;
