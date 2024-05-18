import { useState, useEffect, useRef } from "react";
import { Circles } from 'react-loader-spinner'
import ContextMenu from "../components/Home/ContextMenu";

import * as S from './Home.styled'
import CreateNoteIcon from '../assets/icons/CreateNoteIcon.svg'
import CreateFolderIcon from '../assets/icons/CreateFolderIcon.svg'
import RightArrowIcon from '../assets/icons/RightArrowIcon.svg'

import DeleteIconIcon from '../assets/icons/DeleteIcon.svg'
import NewTabIcon from '../assets/icons/NewTabIcon.svg'
import RenameIcon from '../assets/icons/RenameIcon.svg'


const TreeNode = ({
  node,
  onSelect,
  handleOnContextMenu,
  menuItemSelected
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!node.children) {
      onSelect(node)
    }
  }
  const isSelected = menuItemSelected?.id === node.id

  const arrowStyle = {
    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease-in-out',
  };

  return (
    <>
      <S.ItemWrapper>
        <S.ParentItem
          isSelected={isSelected}
          onClick={toggleOpen}
          onContextMenu={(e) => handleOnContextMenu(e, node)}
        >
          {
            node.children && <S.Arrow src={RightArrowIcon} style={arrowStyle}/>
          }
          {node.title}
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
            />
          ))}
        </S.ChildBlock>
      )}
    </>
  );
};

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
  }) => {

  const [isResizing, setIsResizing] = useState(false)
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const [creatingNote, setCreatingNote] = useState(false)
  const [newNoteName, setNewNoteName] = useState('')

  const newFolderInput = useRef()

  const handleCreateFolderClick = () => {
    setCreatingFolder(true)
    setNewFolderName('Untitled')
  }

  const handleCreateNoteClick = () => {
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
    }
  }

  const handleCreateNoteKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCreatingNote(false)
      setNewNoteName('')
      handleCreateNote(newNoteName)
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


const Home = () => {
  const [width, setWidth] = useState(260)
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [menuItemSelected, setMenuItemSelected] = useState(null)
  const minWidth = 20
  const maxWidth = 500

  const handleCreateFolder = async (newFolderName) => {
    if (!newFolderName) return;

    const newData = { ...data }
    newData.children = newData.children || []

    newData.children.push({
      id: 'temporary',
      title: newFolderName,
      children: []
    })
    setData(newData)

    try {
      const response = await fetch(
        '/api/v1/folders/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newFolderName,
            owner: null,
            parent: data?.id
          })
        }
      )
      const createdFolder = await response.json()

      const updatedData = { ...data }
      const folderIndex = updatedData.children.findIndex(
        child => child.id === 'temporary'
      )
      if (folderIndex > -1) {
        updatedData.children[folderIndex] = {
          ...createdFolder,
          children: []
        }
        setData(updatedData)
      } else {
        console.error('Failed to update folder:', createdFolder)
      }
    } catch {
      console.error('Error creating folder:', error)
    }
  }

  const handleDeleteItem = async (id) => {
    const updatedData = removeItemById(data, id)
    setData(updatedData)
    setMenuItemSelected(null)
    resetContextMenu()

    try {
      const response = await fetch(
        `/api/v1/items/delete/${id}`, {
          method: 'DELETE',
        }
      )
      if (response.status != 204){
        console.log('Failed to delete item')
      }
    } catch {
      console.error('Error deleting item:', error)
    }
  }

  const removeItemById = (node, id) => {
    if (!node) return null;
    if (node.id === id) return null;

    if (node.children && node.children.length > 0) {
      node.children = node.children
        .map(child => removeItemById(child, id))
        .filter(child => child !== null);
    }
    return node;
  };

  const handleCreateNote = async (newNoteName) => {
    if (!newNoteName) return;

    const newData = { ...data }
    newData.children = newData.children || []

    newData.children.push({
      id: 'temporary',
      title: newNoteName,
      children: []
    })
    setData(newData)

    try {
      const response = await fetch(
        '/api/v1/notes/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newNoteName,
            owner: null,
            folder: data?.id
          })
        }
      )
      const createdNote = await response.json()

      const updatedData = { ...data }
      const noteIndex = updatedData.children.findIndex(
        child => child.id === 'temporary'
      )
      if (noteIndex > -1) {
        updatedData.children[noteIndex] = {
          ...createdNote,
        }
        setData(updatedData)
        handleNoteSelect(createdNote)
      } else {
        console.error('Failed to update note:', createdNote)
      }
    } catch {
      console.error('Error creating note:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          '/api/v1/notes/1a1614f4-561b-4df6-9c2d-82c160af3740', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        )
        let data = await response.json()
        setData(data)
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message)
      } finally {
        setTimeout(() => setIsLoading(false), 1000)
      }
    }
    fetchData()
  }, [])

  const handleWidthChange = (newWidth) => {
    setWidth(newWidth)
  };

  const [selectedNote, setSelectedNote] = useState(null)

  const handleNoteSelect = (note) => {
    setSelectedNote(note)
  }

  const handleDescriptionChange = (e) => {
    const { value } = e.target

    setSelectedNote(prevNote => ({
      ...prevNote,
      description: value,
    }))
  }

  const contextMenuRef = useRef(null)

  const [contextMenu, setContextMenu] = useState({
    position: {
      x: 0,
      y: 0,
    },
    toggled: false
  })

  const handleOnContextMenu = (e, rightClickedItem) => {
    e.preventDefault()
    const contextMenuAttr = contextMenuRef.current.getBoundingClientRect()

    const isLeft = e.clientX < window?.innerWidth / 2

    let x
    let y = e.clientY

    if (isLeft) {
      x = e.clientX
    } else {
      x = e.clientX - contextMenuAttr.width
    }

    setContextMenu({
      position: {
        x,
        y
      },
      toggled: true
    })
    setMenuItemSelected(rightClickedItem)
    console.log(menuItemSelected)
  }
  
  const resetContextMenu = () => {
    setMenuItemSelected(null)
    setContextMenu({
      position: {
        x: 0,
        y: 0,
      },
      toggled: false,
    });
    console.log(menuItemSelected)
  };

  useEffect(() => {
    function handler(e) {
      if (contextMenuRef.current) {
        if (!contextMenuRef.current.contains(e.target)){
          resetContextMenu()
        }
      }
    }
    document.addEventListener('click', handler)
    return () => {
      document.removeEventListener('click', handler)
    }
  })

  return (
    <>
      {isLoading ? (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 1)',
          opacity: '0.2',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Circles color="#DDDDDD" size={50}/>
      </div>
     ) : (
      <S.Container>
        <ContextMenu
          contextMenuRef={contextMenuRef}
          isToggled={contextMenu.toggled}
          positionX={contextMenu.position.x}
          positionY={contextMenu.position.y}
          buttons={[
            {
              text: 'Open in new tab',
              icon: <S.ContextMenuIcon src={NewTabIcon}/>,
              onClick: () => alert('hello'),
              isSpacer: false,
            },
            {
              text: 'Rename',
              icon: <S.ContextMenuIcon src={RenameIcon}/>,
              onClick: () => alert('wow'),
              isSpacer: false,
            },
            {
              text: '',
              icon: null,
              onClick: () => null,
              isSpacer: true,
            },
            {
              text: 'Delete',
              icon: <S.ContextMenuIcon src={DeleteIconIcon}/>,
              onClick: () => handleDeleteItem(menuItemSelected.id),
              isSpacer: false,
            },
          ]}
        />
        <TreeMenu
          width={width}
          minWidth={minWidth}
          maxWidth={maxWidth}
          menuItemSelected={menuItemSelected}
          onWidthChange={handleWidthChange}
          handleCreateFolder={handleCreateFolder}
          handleCreateNote={handleCreateNote}
          handleOnContextMenu={handleOnContextMenu}
          data={data}
          onSelect={handleNoteSelect}
        />
        {
          selectedNote && (
            <S.NoteDetailsBlock>
              <S.NoteDetailsWrapper>
                <S.TitleForm value={selectedNote.title}/>
                <S.DescriptionForm
                  placeholder='Enter your text...'
                  value={selectedNote.description}
                  onChange={handleDescriptionChange}
                />
              </S.NoteDetailsWrapper>
            </S.NoteDetailsBlock>
          )
        }
      </S.Container>
     )
    }
  </>
  )
}

export default Home