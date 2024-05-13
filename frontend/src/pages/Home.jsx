import { useState, useEffect, useRef } from "react";
import { Circles } from 'react-loader-spinner'
import * as S from './Home.styled'
import CreateNoteIcon from '../assets/icons/CreateNoteIcon.svg'
import CreateFolderIcon from '../assets/icons/CreateFolderIcon.svg'


const TreeNode = ({ node, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!node.children) {
      onSelect(node)
    }
  };

  return (
    <>
      <S.ItemWrapper>
        <S.ParentItem onClick={toggleOpen}>
          {node.title}
          {node.children && <span>{isOpen ? '-' : '+'}</span>}
        </S.ParentItem>
      </S.ItemWrapper>
      {isOpen && node.children && (
        <S.ChildBlock style={{ marginLeft: 16 }}>
          <S.LeftSeparator/>
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} onSelect={onSelect}/>
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
    handleCreateFolder,
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
            key={node.id}
            node={node}
            onSelect={onSelect}
          />
        ))}
        {creatingFolder && (
          <S.NewFolderInput
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={handleCreateFolderKeyDown}
            ref={newFolderInput}
            onFocus={() => newFolderInput.current.select()}
          />
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
        <TreeMenu
          width={width}
          minWidth={minWidth}
          maxWidth={maxWidth}
          onWidthChange={handleWidthChange}
          handleCreateFolder={handleCreateFolder}
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