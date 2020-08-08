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
      #00000d 3px,
      #00000d 78px,
      transparent 78px
    ),
    linear-gradient(-90deg, #aaa 1px, transparent 1px),
    linear-gradient(
      -90deg,
      transparent 3px,
      #00000d 3px,
      #00000d 78px,
      transparent 78px
    ),
    linear-gradient(#aaa 1px, transparent 1px), #00000d;
  background-size: 16px 16px, 16px 16px, 80px 80px, 80px 80px, 80px 80px,
    80px 80px, 80px 80px, 80px 80px`
      : '00000d'};

  @media print {
    & {
      background: none;
    }
  }
  width: 100%;
`;

export default Grid;
