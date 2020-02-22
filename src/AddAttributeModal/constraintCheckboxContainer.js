import React, { useState } from 'react';
import constraintCheckBoxList from '../utils/constraintCheckBox';
import { Checkbox } from 'react-ui-lib-pranshu';

/**
 * @param {{checkedConstraintObj:Object,onConstraintChecked:Function}} props
 */

function ConstraintCheckBoxContainer({
  checkedConstraintObj,
  onConstraintChecked,
  ...props
}) {
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
        checked={
          checkedConstraintObj[item.name]
            ? checkedConstraintObj[item.name]
            : false
        }
        onChange={onConstraintChecked}
      />
    );
  });
  return <div style={style}>{checkboxContainer}</div>;
}

export default ConstraintCheckBoxContainer;
