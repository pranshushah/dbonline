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
        customFontColor={'rgb(230,230,230)'}
        customCheckedColor={'rgb(28, 161, 242)'}
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
