import React, { MouseEvent, useState } from 'react';
import styled from 'styled-components';
import TableColor from '../../utils/tableColors';

const ColorPickerSpan = styled.span`
  width: 10px;
  padding: 8px;
  margin: 6px;
  cursor: pointer;
  background-color: ${props => props.bgColor};
  border: ${props => `1px solid ${props.bgColor}`};
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
 * @param {{onTableColorSelected:Function}} props
 */

function TableColorPickerList(props) {
  const [selectedColor, setSelectedColor] = useState(-1);
  /**
   *
   * @param {MouseEvent<HTMLSpanElement>} e
   */
  function ClickHandler(id, e) {
    e.preventDefault();
    setSelectedColor(id);
    props.onTableColorSelected(
      window.getComputedStyle(e.target).getPropertyValue('background-color'),
    );
  }

  const ColorList = Object.values(TableColor);
  const ColorPickerList = ColorList.map((color, id) => {
    return (
      <ColorPickerSpan
        key={id}
        style={selectedColor === id ? { border: '2px solid #A9A9A9' } : null}
        onClick={ClickHandler.bind(this, id)}
        bgColor={color}
      />
    );
  });
  console.log(typeof React.memo);
  return (
    <>
      <TableHeading>*Pick Your Color</TableHeading>
      <ColorPickerListDiv>{ColorPickerList}</ColorPickerListDiv>
    </>
  );
}

export default React.memo(TableColorPickerList);
