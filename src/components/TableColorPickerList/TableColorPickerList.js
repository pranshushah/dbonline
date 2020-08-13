import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import TableColor from '../../utils/tableColors';
import Styles from './TableColorPickerList.module.scss';

const ColorPickerSpan = styled.span`
  width: 10px;
  padding: 8px;
  margin: 8px;
  cursor: pointer;
  background-color: ${(props) => props.bgColor};
  outline: ${(props) => `1px solid ${props.bgColor}`};
  &::first-child {
    margin-left: 0;
  }
`;

/**
 *
 * @param {{onTableColorSelected:Function,selectedColor:string}} props
 */

function TableColorPickerList({
  onTableColorSelected,
  selectedColor,
  ...props
}) {
  /**
   *
   * @param {MouseEvent<HTMLSpanElement>} e
   */
  function ClickHandler(e) {
    e.preventDefault();
    onTableColorSelected(
      window.getComputedStyle(e.target).getPropertyValue('background-color'),
    );
  }

  const ColorList = Object.values(TableColor);
  const ColorPickerList = ColorList.map((color, id) => {
    return (
      <ColorPickerSpan
        key={id}
        style={
          selectedColor === color ? { outline: '2px solid #A9A9A9' } : null
        }
        onClick={ClickHandler}
        bgColor={color}
      />
    );
  });
  return (
    <>
      <h3 className={Styles.heading}>Select color for table:</h3>
      <div className={Styles.colorContainer}>{ColorPickerList}</div>
    </>
  );
}

export default TableColorPickerList;
