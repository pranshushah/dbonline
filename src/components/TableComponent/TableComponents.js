import styled from 'styled-components';

const TableCard = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.2s;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  width: 20%;
  margin: 10px;
  position: absolute;
  left: ${props => `${props.left}px`};
  top: ${props => `${props.top}px`};
  &:hover {
    box-shadow: 0 0px 24px 8px rgba(0, 0, 0, 0.2);
  }
  max-height: 30vh;
  opacity: ${props => (props.isDragging ? 0.5 : 1)};
`;

const TableHeader = styled.h3`
  color: rgb(226, 226, 226);
  width: 100%;
  background: ${props => props.bgColor};
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
  background: rgb(225, 225, 225);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 3px;
`;

const AddAttributeLink = styled.a`
  text-decoration: none;
  color: ${props => props.fontColor};
  cursor: pointer;
`;

export { TableCard, TableHeader, TableContentContainer, AddAttributeLink };
