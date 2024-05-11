import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

export const Header = styled.div`
`

export const TreeMenuBlock = styled.div`
  width: ${(props) => props.width}px;
  height: 100vh;
  padding: 15px;
  background-color: #282828;
  border: 0.5px solid #555555;
  float: left;
  position: relative;
  user-select: none;
`

export const RightBorder = styled.div`
  position: absolute;
  height: 100%;
  top: 0;
  right: -1px;
  width: 2px;
  cursor: col-resize;
  transition: background-color 0.3s ease;

  background-color: ${({ isResizing }) => (isResizing ? '#276DF1' : 'transparent')};
  &:hover{
    background-color: #276DF1;
  }
`

export const ButtonWrapper = styled.div`
  margin-left: 10px;
  display: flex;
`

export const CreateNoteButton = styled.div`
  width: 27.5px;
  height: 27.5px;
  background-color: inherit;
  transition: background-color 0.3s ease;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 2px;
  border-radius: 5px;

  &:hover {
    background-color: #333333;
  }
`

export const CreateFolderButton = styled(CreateNoteButton)`
  padding-top: 2px;
  margin-top: 4px;
  height: 23px;
  margin-left: 5px;
  padding-left: 0;
`

export const CreateNoteIcon = styled.img`
`

export const CreateFolderIcon = styled.img`
`

export const MenuTitle = styled.h4`
  margin-left: 15px;
  margin-top: 15px;
  font-size: 13px;
  font-weight: var(--bold);
  color: #DDDDDD;
`

export const NotesFoldersBlock = styled.div`
  margin-top: 15px;
  margin-left: 5px;
`


export const ItemWrapper = styled.div`
`

export const ParentItem = styled.div`
  cursor: pointer;
  margin-top: 5px;
  font-size: 14px;
  font-weight: var(--medium);
  transition: background-color 0.3s ease;
  padding: 5px;
  padding-left: 10px;

  &:hover {
    background-color: #333333;
  }
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

export const NoteDetailsBlock = styled.div`
  /* background-color: aliceblue; */
  padding-top: 70px;
  display: flex;
  justify-content: center;
  height: 100vh;
`

export const NoteDetailsWrapper = styled.div`
  /* background-color: aquamarine; */
  /* max-width: 640px; */
  width: 800px;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const TitleForm = styled.input`
  /* background-color: red; */
  font-size: 30px;
  width: 100%;
  font-weight: var(--semi-bold);
`

export const DescriptionForm = styled.textarea`
  resize: none;
  /* background-color: red; */
  width: 100%;
  margin-top: 23px;
  font-size: 14px;
  font-weight: var(--medium);
  min-height: 500px;
  height: auto;
  overflow-y: auto;
`
