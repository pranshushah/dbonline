import React from 'react';
import Select from 'react-select';
import '../utils/Types';

/**
 * @param {{selectedTable:string,mainTableDetails:mainTableDetailsType[],onAttrSelected:Function}} props
 */
function SelectReferencingAttr({
  selectedTable,
  mainTableDetails,
  onAttrSelected,
}) {
  const index = mainTableDetails.findIndex(
    mainTableDetail => mainTableDetail.tableName === selectedTable,
  );

  let options = [];
  for (let i = 0; i < mainTableDetails[index].attributes.length; i++) {
    options.push({
      label: mainTableDetails[index].attributes[i].name,
      value: mainTableDetails[index].attributes[i].name,
    });
  }

  function attrSelectHandler(value) {
    onAttrSelected(value.value);
  }

  return (
    <Select
      options={options}
      onChange={attrSelectHandler}
      placeholder='Select Referencing Attribute'
    />
  );
}

export default SelectReferencingAttr;
