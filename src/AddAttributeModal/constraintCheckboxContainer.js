import React, { useState } from 'react';
import constraintCheckBoxList from '../utils/constraintCheckBox';
import { Checkbox } from 'react-ui-lib-pranshu';

function ConstraintCheckBoxContainer(props) {
  const [checkedItems, updateCheckedItems] = useState(new Map());

  function checkBoxChangeHandler(e) {
    console.log(checkedItems);
    updateCheckedItems(checkedItems =>
      checkedItems.set(e.target.name, e.target.checked),
    );
  }

  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };

  const checkboxContainer = constraintCheckBoxList.map(item => {
    return (
      <Checkbox
        label={item.label}
        key={item.name}
        name={item.name}
        checked={checkedItems.get(item.name)}
        onChange={checkBoxChangeHandler}
      />
    );
  });
  return <div style={style}>{checkboxContainer}</div>;
}

export default ConstraintCheckBoxContainer;
