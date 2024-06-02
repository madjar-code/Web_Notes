import {
  useState,
  useEffect,
  useRef,
  useContext
} from "react";
import { Circles } from 'react-loader-spinner'

import * as S from './Home.styled'

import TreeMenu from "../components/Home/TreeMenu";
import ContextMenu from "../components/Home/ContextMenu";
import MoveModal from "../components/Home/MoveModal";
import AuthContext from "../context/AuthContext";

import DeleteIconIcon from '../assets/icons/DeleteIcon.svg'
import NewTabIcon from '../assets/icons/NewTabIcon.svg'
import RenameIcon from '../assets/icons/RenameIcon.svg'
import MoveToIcon from '../assets/icons/MoveToIcon.svg'
import OpenArrowIcon from '../assets/icons/OpenArrowIcon.svg'


const Home = () => {
  const { authTokens, logoutUser } = useContext(AuthContext)
  const [width, setWidth] = useState(260)
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [menuItemSelected, setMenuItemSelected] = useState(null)
  const [renameMenuItem, setRenameMenuItem] = useState(null)
  const [moveItem, setMoveItem] = useState(null)
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)
  const contextMenuRef = useRef(null)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState({
    position: {
      x: 0,
      y: 0,
    },
    toggled: false
  })
  const minWidth = 20
  const maxWidth = 500

  const [currentUser, setCurrentUser] = useState(null)

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          '/api/v1/auth/users/me/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${authTokens.access}` // Ensure you are passing the token
            }
          }
        )
        const userData = await response.json()
        setCurrentUser(userData)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [authTokens.access])

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

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(prevState => !prevState)
  }

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

  const handleDeleteItem = async (id) => {
    const removeItemById = (node, id) => {
      if (!node) return null
      if (node.id === id) return null
  
      if (node.children && node.children.length > 0) {
        node.children = node.children
          .map(child => removeItemById(child, id))
          .filter(child => child !== null)
      }
      return node;
    }

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
      if (response.status !== 204){
        console.error('Failed to delete item')
      }
    } catch {
      console.error('Error deleting item:', error)
    }
  }

  const handleNoteSelect = (note) => {
    setMenuItemSelected(null)
    resetContextMenu()
    setSelectedNote(note)
  }

  const handleWidthChange = (newWidth) => {
    setWidth(newWidth)
  }

  const handleRenameItem = (item) => {
    setMenuItemSelected(null)
    resetContextMenu()
    setRenameMenuItem(item)
  }

  const handleDescriptionChange = (e) => {
    const { value } = e.target

    setSelectedNote(prevNote => ({
      ...prevNote,
      description: value,
    }))
  }

  const descriptionRef = useRef(null);

  const adjustTextareaHeight = () => {
    const textarea = descriptionRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  useEffect(() => {
    adjustTextareaHeight();
  }, [selectedNote?.description]);

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
  }

  const handleRenameKeyDown = async (e) => {
    if (e.key === 'Enter') {
      const updatedData = { ...data }
      const renameNode = (node, id, newTitle) => {
        if (node.id === id) {
          node.title = newTitle
        } else if (node.children) {
          node.children = node.children.map((child) => renameNode(child, id, newTitle))
        }
        return node
      }
      renameNode(
        updatedData,
        renameMenuItem.id,
        renameMenuItem.title
      )
      setData(updatedData)
      setRenameMenuItem(null)

      try {
        await fetch(`api/v1/items/update-titles/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            updates: [
              {
                id: renameMenuItem.id,
                title: renameMenuItem.title
              }
            ]
          })
        }
        )
      } catch (error){
        console.error('Error renaming item:', error)
      }
    }
  }

  const handleRenameChange = (e) => {
    setRenameMenuItem((prev) => ({
      ...prev,
      title: e.target.value,
    }))
  }

  const handleMoveItem = (item) => {
    resetContextMenu()
    setMenuItemSelected(item)
    setMoveItem(item)
    setIsMoveModalOpen(true)
  }

  const handleFolderMove = async (folderId) => {
    const updatedData = { ...data }
  
    const moveNode = (node, id) => {
      if (node.children){
        node.children = node.children.filter((child) => child.id !== id)
        node.children.forEach((child) => moveNode(child, id))
      }
      return node
    }
    moveNode(updatedData, moveItem?.id)

    const addToFolder = (node, id, newNode) => {
      if (node.id === id) {
        node.children = node.children || []
        node.children.push(newNode)
      } else if (node.children) {
        node.children.forEach((child) => addToFolder(child, id, newNode))
      }
      return node
    }
    addToFolder(updatedData, folderId, moveItem)
    setData(updatedData)
    setMoveItem(null)
    setMenuItemSelected(null)

    try {
      const response = await fetch(
        `/api/v1/items/move/${moveItem?.id}/${folderId}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
      if (!response.ok) {
        console.error('Failed to move item')
      }
    } catch {
      console.error('Failed to move item')
    }
  }

  return (
    <>
      {isLoading ? (
      <S.LoadingPage>
        <Circles color="#DDDDDD" size={50}/>
      </S.LoadingPage>
     ) : (
      <S.Container>
        <S.Header>
          <S.AccountButton onClick={toggleAccountMenu}>
            <S.Avatar>{currentUser?.first_name?.[0]}</S.Avatar>
            <S.OpenArrow src={OpenArrowIcon}/>
          </S.AccountButton>
          <S.AccountMenu isOpen={isAccountMenuOpen}>
            <S.TopWrapper>
              <S.MenuAvatar>
                {currentUser?.first_name?.[0]}
              </S.MenuAvatar>
              <S.AccountTextWrapper>
                <S.FullName>
                  {currentUser?.first_name} {currentUser?.last_name}
                </S.FullName>
                <S.Pointer>You</S.Pointer>
              </S.AccountTextWrapper>
            </S.TopWrapper>
            <S.BottomWrapper>
              <S.LogoutButton onClick={logoutUser}>
                Logout!
              </S.LogoutButton>
            </S.BottomWrapper>
          </S.AccountMenu>
        </S.Header>
        <S.Content>
          <ContextMenu
            contextMenuRef={contextMenuRef}
            isToggled={contextMenu.toggled}
            positionX={contextMenu.position.x}
            positionY={contextMenu.position.y}
            buttons={[
              menuItemSelected && menuItemSelected.children
              ? null : {
                text: 'Open in new tab',
                icon: <S.ContextMenuIcon src={NewTabIcon}/>,
                onClick: () => handleNoteSelect(menuItemSelected),
                isSpacer: false,
              },
              {
                text: 'Move to...',
                icon: <S.ContextMenuIcon src={MoveToIcon}/>,
                onClick: () => handleMoveItem(menuItemSelected),
              },
              {
                text: 'Rename',
                icon: <S.ContextMenuIcon src={RenameIcon}/>,
                onClick: () => handleRenameItem(menuItemSelected),
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
          <MoveModal
            isOpen={isMoveModalOpen}
            onClose={() => setIsMoveModalOpen(false)}
            data={data}
            onMove={handleFolderMove}
            moveItem={moveItem}
          />
          <TreeMenu
            data={data}
            width={width}
            minWidth={minWidth}
            maxWidth={maxWidth}
            onSelect={handleNoteSelect}
            menuItemSelected={menuItemSelected}
            onWidthChange={handleWidthChange}
            handleCreateFolder={handleCreateFolder}
            handleCreateNote={handleCreateNote}
            handleOnContextMenu={handleOnContextMenu}

            renameMenuItem={renameMenuItem}
            handleRenameKeyDown={handleRenameKeyDown}
            handleRenameChange={handleRenameChange}
          />
          {
            selectedNote && (
              <S.NoteDetailsBlock>
                <S.NoteDetailsWrapper>
                  <S.TitleForm value={selectedNote.title}/>
                  <S.DescriptionForm
                    ref={descriptionRef}
                    placeholder='Enter your text...'
                    value={selectedNote.description}
                    onChange={handleDescriptionChange}
                    onInput={adjustTextareaHeight}
                  />
                </S.NoteDetailsWrapper>
              </S.NoteDetailsBlock>
            )
          }
        </S.Content>
      </S.Container>
     )
    }
  </>
  )
}

export default Home