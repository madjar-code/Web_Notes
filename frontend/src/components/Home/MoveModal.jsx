import { useState } from 'react'
import * as S from './MoveModal.styled'


const MoveModal = ({
    isOpen,
    onClose,
    data,
    onMove
  }) => {
  const [searchFolder, setSearchFolder] = useState('')

  const collectAllFolders = (node, folderList = []) => {
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        if (child.children) {
          folderList.push(child)
          collectAllFolders(child, folderList)
        }
      })
    }
    return folderList
  }

  const allFolders = collectAllFolders(data)

  const filteredFolders = allFolders.filter((folder) => 
    folder.title.toLowerCase().includes(searchFolder.toLowerCase())
  )

  const handleOverlayClick = (e) => {
    e.stopPropagation()
    onClose()
  }

  const handleContentClick = (e) => {
    e.stopPropagation()
  }

  return (
    isOpen ? (
      <S.ModalOverlay onClick={handleOverlayClick}>
        <S.ModalContent onClick={handleContentClick}>
          <S.TitleInput
            placeholder='Enter Folder Name...'
            value={searchFolder}
            onChange={(e) => setSearchFolder(e.target.value)}
          />
          <S.Separator/>
          <S.FolderList>
            {filteredFolders.map((folder) => (
              <S.FolderItem key={folder.id} onClick={() => {
                onMove(folder.id)
                onClose()
              }}>
                {folder.title}
              </S.FolderItem>
            ))}
          </S.FolderList>
        </S.ModalContent>
      </S.ModalOverlay>
    ) : null
  )
}

export default MoveModal