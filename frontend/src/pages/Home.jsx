import {
  useState,
  useEffect,
  useRef
} from "react";
import { Circles } from 'react-loader-spinner'
import ContextMenu from "../components/Home/ContextMenu";

import * as S from './Home.styled'

import TreeMenu from "../components/Home/TreeMenu";

import DeleteIconIcon from '../assets/icons/DeleteIcon.svg'
import NewTabIcon from '../assets/icons/NewTabIcon.svg'
import RenameIcon from '../assets/icons/RenameIcon.svg'


const Home = () => {
  const [width, setWidth] = useState(260)
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [menuItemSelected, setMenuItemSelected] = useState(null)
  const contextMenuRef = useRef(null)
  const [contextMenu, setContextMenu] = useState({
    position: {
      x: 0,
      y: 0,
    },
    toggled: false
  })
  const minWidth = 20
  const maxWidth = 500

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
        console.log('Failed to delete item')
      }
    } catch {
      console.error('Error deleting item:', error)
    }
  }

  const handleNoteSelect = (note) => {
    setSelectedNote(note)
  }

  const handleWidthChange = (newWidth) => {
    setWidth(newWidth)
  };

  const handleDescriptionChange = (e) => {
    const { value } = e.target

    setSelectedNote(prevNote => ({
      ...prevNote,
      description: value,
    }))
  }

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


  return (
    <>
      {isLoading ? (
      <S.LoadingPage>
        <Circles color="#DDDDDD" size={50}/>
      </S.LoadingPage>
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