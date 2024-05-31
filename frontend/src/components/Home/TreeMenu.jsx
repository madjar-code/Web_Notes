import { useState, useRef } from 'react'
import * as S from './TreeMenu.styled'

import CreateNoteIcon from '../../assets/icons/CreateNoteIcon.svg';
import CreateFolderIcon from '../../assets/icons/CreateFolderIcon.svg';
import RightArrowIcon from '../../assets/icons/RightArrowIcon.svg';

import TreeNode from "./TreeNode";

const TreeMenu = ({
  width,
  minWidth,
  maxWidth,
  onWidthChange,
  menuItemSelected,
  handleCreateFolder,
  handleOnContextMenu,
  handleCreateNote,
  data,
  onSelect,
  renameMenuItem,
  handleRenameKeyDown,
  handleRenameChange,
}) => {

const [isResizing, setIsResizing] = useState(false)
const [creatingFolder, setCreatingFolder] = useState(false)
const [newFolderName, setNewFolderName] = useState('')

const [creatingNote, setCreatingNote] = useState(false)
const [newNoteName, setNewNoteName] = useState('')

const newFolderInput = useRef()

const handleCreateFolderClick = () => {
  setCreatingNote(false)
  setCreatingFolder(true)
  setNewFolderName('Untitled')
}

const handleCreateNoteClick = () => {
  setCreatingFolder(false)
  setCreatingNote(true)
  setNewNoteName('Untitled')
}

const newNoteInput = useRef()

const handleMouseDown = (event) => {
  setIsResizing(true)
  const startX = event.clientX
  const startWidth = width

  const handleMouseMove = (event) => {
    const newWidth = startWidth + (event.clientX - startX)
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      onWidthChange(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.removeEventListener(
      'mousemove',
      handleMouseMove
    )
    document.removeEventListener(
      'mouseup',
      handleMouseUp
    )
  }

  document.addEventListener(
    'mousemove',
    handleMouseMove
  )
  document.addEventListener(
    'mouseup',
    handleMouseUp
  )
}

const handleCreateFolderKeyDown = (e) => {
  if (e.key === 'Enter') {
    setCreatingFolder(false)
    setNewFolderName('')
    handleCreateFolder(newFolderName)
  } else if (e.key === 'Escape') {
    setCreatingFolder(false)
    setNewFolderName('')
  }
}

const handleCreateNoteKeyDown = (e) => {
  if (e.key === 'Enter') {
    setCreatingNote(false)
    setNewNoteName('')
    handleCreateNote(newNoteName)
  } else if (e.key == 'Escape') {
    setCreatingNote(false)
    setNewNoteName('')
  }
}

return (
  <S.TreeMenuBlock width={width}>
    <S.ButtonWrapper>
      <S.CreateNoteButton onClick={handleCreateNoteClick}>
        <S.CreateNoteIcon src={CreateNoteIcon}/>
      </S.CreateNoteButton>
      <S.CreateFolderButton onClick={handleCreateFolderClick}>
        <S.CreateFolderIcon src={CreateFolderIcon}/>
      </S.CreateFolderButton>
    </S.ButtonWrapper>
    <S.MenuTitle>{data?.title}</S.MenuTitle>
    <S.NotesFoldersBlock>
      {data?.children?.map(node => (
        <TreeNode
          handleOnContextMenu={handleOnContextMenu}
          menuItemSelected={menuItemSelected}
          key={node.id}
          node={node}
          onSelect={onSelect}
          renameMenuItem={renameMenuItem}
          handleRenameKeyDown={handleRenameKeyDown}
          handleRenameChange={handleRenameChange}
        />
      ))}
      {creatingFolder && (
        <S.NewFolderWrapper>
          <S.NewFolderRightArrow src={RightArrowIcon}/>
          <S.NewFolderInput
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={handleCreateFolderKeyDown}
            ref={newFolderInput}
            onFocus={() => newFolderInput.current.select()}
          />
        </S.NewFolderWrapper>
      )}
      {creatingNote && (
        <S.NewNoteWrapper>
          <S.NewNoteInput
            type="text"
            value={newNoteName}
            onChange={(e) => setNewNoteName(e.target.value)}
            onKeyDown={handleCreateNoteKeyDown}
            ref={newNoteInput}
            onFocus={() => newNoteInput.current.select()}
          />
        </S.NewNoteWrapper>
      )}
    </S.NotesFoldersBlock>
    <S.RightBorder
      isResizing={isResizing}
      onMouseDown={(event) => {
        const rightBoundary = event.target.getBoundingClientRect().right
        const mouseX = event.clientX
        const resizeZoneWidth = 10
        if (mouseX >= rightBoundary - resizeZoneWidth) {
          handleMouseDown(event)
        } 
      }}
    />
  </S.TreeMenuBlock>
);
};

export default TreeMenu
