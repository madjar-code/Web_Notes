import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    data,
    onSelect,
  }) => {
  const [isResizing, setIsResizing] = useState(false)

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
  return (
    <S.TreeMenuBlock width={width}>
      <S.ButtonWrapper>
        <S.CreateNoteButton>
          <S.CreateNoteIcon src={CreateNoteIcon}/>
        </S.CreateNoteButton>
        <S.CreateFolderButton>
          <S.CreateFolderIcon src={CreateFolderIcon}/>
        </S.CreateFolderButton>
      </S.ButtonWrapper>
      <S.MenuTitle>NOTE NETWORKS</S.MenuTitle>
      <S.NotesFoldersBlock>
        {data.map(node => (
          <TreeNode
            key={node.id}
            node={node}
            onSelect={onSelect}
          />
        ))}
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

const data = [
  {
    id: '1',
    title: 'Folder 1',

    children: [
      {
        id: '2',
        title: 'File 1',
        description: 'Description 1'
      },
      {
        id: '3',
        title: 'File 2',
        description: 'Description 2'
      }
    ]
  },
  {
    id: '4',
    title: 'Folder 2',
    children: [
      {
        id: '5',
        title: 'Subfolder 1',
        children: [
          {
            id: '6',
            title: 'File 3',
            description: 'Description 3'
          },
          {
            id: '7',
            title: 'File 4',
            description: 'Description 4'
          }
        ]
      }
    ]
  }
];

const Home = () => {
  const [width, setWidth] = useState(310)
  const minWidth = 20
  const maxWidth = 500

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
    <S.Container>
      <TreeMenu
        width={width}
        minWidth={minWidth}
        maxWidth={maxWidth}
        onWidthChange={handleWidthChange}
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

export default Home