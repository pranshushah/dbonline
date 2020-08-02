import React from 'react';
import Select from 'react-select';
import '../../utils/Types';

/**
 * @param {{selectedTable:string,mainTableDetails:mainTableDetailsType[],onAttrSelected:Function}} props
 */
function SelectReferencingAttr({
  selectedTable,
  mainTableDetails,
  onAttrSelected,
  value,
}) {
  const index = mainTableDetails.findIndex(
    (mainTableDetail) => mainTableDetail.id === selectedTable,
  );

  let options = [];
  for (let i = 0; i < mainTableDetails[index].attributes.length; i++) {
    if (
      (mainTableDetails[index].attributes[i].isNOTNULL &&
        mainTableDetails[index].attributes[i].isUNIQUE) ||
      mainTableDetails[index].attributes[i].isPRIMARYKEY
    )
      options.push({
        label: mainTableDetails[index].attributes[i].name,
        value: mainTableDetails[index].attributes[i].id,
      });
  }

  function attrSelectHandler(value) {
    onAttrSelected(value.value);
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
      onChange={attrSelectHandler}
      placeholder='Select Referencing Attribute'
      noOptionsMessage={() => 'Candidate key not found.'}
    />
  );
}

export default SelectReferencingAttr;
