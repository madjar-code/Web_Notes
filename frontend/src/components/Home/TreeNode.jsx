import { useState, useRef, useEffect } from "react";
import * as S from './TreeNode.styled'
import RightArrowIcon from '../../assets/icons/RightArrowIcon.svg'

const TreeNode = ({
  node,
  onSelect,
  handleOnContextMenu,
  menuItemSelected,
  renameMenuItem,
  handleRenameKeyDown,
  handleRenameChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null)

  useEffect(() => {
    if (renameMenuItem && renameMenuItem.id === node.id) {
      inputRef.current.focus()
    }
  }, [renameMenuItem])

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!node.children) {
      onSelect(node)
    }
  }
  const isSelected = menuItemSelected?.id === node.id
  const isRenaming = renameMenuItem && renameMenuItem.id === node.id

  const arrowStyle = {
    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease-in-out',
  }

  return (
    <>
      <S.ItemWrapper>
        <S.ParentItem
          isSelected={isSelected}
          isRenaming={isRenaming}
          onClick={toggleOpen}
          onContextMenu={(e) => handleOnContextMenu(e, node)}
        >
          {
            node.children && <S.Arrow src={RightArrowIcon} style={arrowStyle}/>
          }
          {isRenaming ? (
            <input
              type="text"
              value={renameMenuItem.title}
              onChange={handleRenameChange}
              onKeyDown={handleRenameKeyDown}
              ref={inputRef}
            />
          ) : (
            node.title
          )}
        </S.ParentItem>
      </S.ItemWrapper>
      {isOpen && node.children && (
        <S.ChildBlock style={{ marginLeft: 16 }}>
          <S.LeftSeparator/>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              onSelect={onSelect}
              menuItemSelected={menuItemSelected}
              handleOnContextMenu={handleOnContextMenu}
              renameMenuItem={renameMenuItem}
              handleRenameChange={handleRenameChange}
              handleRenameKeyDown={handleRenameKeyDown}
            />
          ))}
        </S.ChildBlock>
      )}
    </>
  )
}

export default TreeNode