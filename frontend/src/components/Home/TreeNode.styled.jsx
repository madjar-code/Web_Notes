import styled, { css } from 'styled-components'


export const ItemWrapper = styled.div`
`

export const ParentItem = styled.div`
  cursor: pointer;
  margin-top: 5px;
  font-size: 14px;
  font-weight: var(--medium);
  transition: background-color 0.3s ease;
  padding: 5px;
  padding-left: 15px;
  position: relative;
  background-color: ${({ isSelected }) => (isSelected ? '#333333' : 'transparent')};
  box-sizing: border-box;

  &:hover {
    background-color: #333333;
  }

  ${({ isSelected, isRenaming }) => css`
    ${isSelected && !isRenaming && css`
      box-shadow: 0 0 0 2px #666666;
    `}
    ${isRenaming && css`
      border: 2px solid #276DF1;
      ${!isSelected && css`
        background-color: #333333;
      `}
    `}
  `}
`;

export const Arrow = styled.img`
  position: absolute;
  top: 9px;
  left: 5px;
`

export const ChildBlock = styled.div`
  position: relative;
`

export const LeftSeparator = styled.div`
  width: 1px;
  position: absolute;
  height: 100%;
  left: -6px;
  background-color: #555555;
`
