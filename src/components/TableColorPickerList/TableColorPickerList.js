import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import TableColor from '../../utils/tableColors';

const ColorPickerSpan = styled.span`
  width: 10px;
  padding: 8px;
  margin: 6px;
  cursor: pointer;
  background-color: ${(props) => props.bgColor};
  border: ${(props) => `1px solid ${props.bgColor}`};
`;

const ColorPickerListDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 6px;
  align-items: center;
`;

const TableHeading = styled.h3`
  margin: 5px;
  margin-top: 15px;
  color: rgb(50, 50, 50);
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
        style={selectedColor === color ? { border: '2px solid #A9A9A9' } : null}
        onClick={ClickHandler}
        bgColor={color}
      />
    );
  });
  return (
    <>
      <TableHeading>*Pick Your Color</TableHeading>
      <ColorPickerListDiv>{ColorPickerList}</ColorPickerListDiv>
    </>
  );
}

export default React.memo(TableColorPickerList);
