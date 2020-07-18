import React from 'react';
import { Checkbox } from 'react-ui-lib-pranshu';

/**
 * @param {{checkedConstraintObj:Object,onConstraintChecked:Function,checkBoxList:Array}} props
 */

function ConstraintCheckBoxContainer({
  checkedConstraintObj,
  onConstraintChecked,
  checkBoxList,
  stl,
  ...props
}) {
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };

  const checkboxContainer = checkBoxList.map((item) => {
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
