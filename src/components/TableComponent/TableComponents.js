import React from 'react';
import styled from 'styled-components';
/**
 * @typedef{ import('react').HTMLProps<HTMLAnchorElement>} anchorProps */

const TableCard = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.2s;
  border: 1px solid rgb(66, 66, 66);
  border-radius: 1px;
  margin: 10px;
  position: absolute;
  left: ${(props) => `${props.left}px`};
  top: ${(props) => `${props.top}px`};
  &:hover {
    box-shadow: 0 0px 24px 8px rgba(0, 0, 0, 0.2);
  }
  max-height: 30vh;
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
`;

const TableHeader = styled.h3`
  color: rgb(226, 226, 226);
  width: 100%;
  background: ${(props) => props.bgColor};
  text-align: left;
  padding: 2px;
  padding-left: 8px;
  letter-spacing: 0.5px;
  height: 15%;
  font-size: 0.8rem;
  &:hover {
    cursor: grab;
  }
`;

const TableContentContainer = styled.div`
  background: rgb(240, 240, 240);
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  padding: 0 0 3px 0;
`;

const AttributeLink = styled.a`
  text-decoration: none;
  text-align: center;
  padding-bottom: 5px;
  color: ${(props) => props.fontColor};
  cursor: pointer;
`;

/**
 * @param {{tableDndDetail:Object} & anchorProps} props*/

function AddAttributeLink({ onClick, tableDndDetail, children, ...props }) {
  function linkClickHandler() {
    onClick(tableDndDetail);
  }
  return (
    <AttributeLink {...props} onClick={linkClickHandler}>
      {children}
    </AttributeLink>
  );
}

export { TableCard, TableHeader, TableContentContainer, AddAttributeLink };
