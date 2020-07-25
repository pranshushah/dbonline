import styled from 'styled-components';

const Grid = styled.main`
  width: 100%;
  height: 170vh;
  position: relative;
  background: ${(props) =>
    props.showGrid
      ? `linear-gradient(-90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(-90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
    linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
    linear-gradient(
      transparent 3px,
      #ffffff 3px,
      #ffffff 78px,
      transparent 78px
    ),
    linear-gradient(-90deg, #aaa 1px, transparent 1px),
    linear-gradient(
      -90deg,
      transparent 3px,
      #ffffff 3px,
      #ffffff 78px,
      transparent 78px
    ),
    linear-gradient(#aaa 1px, transparent 1px), #ffffff;
  background-size: 16px 16px, 16px 16px, 80px 80px, 80px 80px, 80px 80px,
    80px 80px, 80px 80px, 80px 80px`
      : null};
`;

export default Grid;
