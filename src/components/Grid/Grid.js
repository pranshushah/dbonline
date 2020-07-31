import styled from 'styled-components';

const Grid = styled.main`
  height: 170vh;
  position: relative;
  background: ${(props) =>
    props.showGrid
      ? `linear-gradient(-90deg, rgba(230,230,230, 0.05) 1px, transparent 1px),
    linear-gradient(rgba(230,230,230, 0.05) 1px, transparent 1px),
    linear-gradient(-90deg, rgba(230,230,230, 0.04) 1px, transparent 1px),
    linear-gradient(rgba(230,230,230, 0.04) 1px, transparent 1px),
    linear-gradient(
      transparent 3px,
      #191c20 3px,
      #191c20 78px,
      transparent 78px
    ),
    linear-gradient(-90deg, #aaa 1px, transparent 1px),
    linear-gradient(
      -90deg,
      transparent 3px,
      #191c20 3px,
      #191c20 78px,
      transparent 78px
    ),
    linear-gradient(#aaa 1px, transparent 1px), #191c20;
  background-size: 16px 16px, 16px 16px, 80px 80px, 80px 80px, 80px 80px,
    80px 80px, 80px 80px, 80px 80px`
      : 'rgb(15,15,15)'};

  @media print {
    & {
      background: none;
    }
  }
  width: 100%;
`;

export default Grid;
