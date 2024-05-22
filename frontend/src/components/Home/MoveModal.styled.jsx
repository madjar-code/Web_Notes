import styled from 'styled-components';

export const TitleInput = styled.input`
  margin-left: 25px;
  margin-top: 12px;
  font-size: 14px;
`

export const Separator = styled.hr`
  margin-top: 10px;
  margin-right: -4px;
  border: none;
  border-top: 1px solid #555;
  color: #555;
  background-color: #555;
`

export const ModalOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  opacity: 0;
  animation: fadeIn 0.5s forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export const ModalContent = styled.div`
  margin-top: 120px;
  background-color: #1F1F1F;
  border: 1px solid #555555;
  /* padding: 0 25px; */
  border-radius: 10px;
  width: 500px;
  min-height: 250px;
  max-height: 450px;
  padding-right: 4px;
  padding-bottom: 4px;
`

export const FolderList = styled.div`
  list-style: none;
  max-height: 390px;
  overflow-y: auto;
  padding-left: 15px;
  padding-right: 15px;

  /* Webkit Scrollbar Styles */
  &::-webkit-scrollbar {
    width: 6px;
    margin-right: -15px;
  }

  &::-webkit-scrollbar-track {
    background-color: #1F1F1F;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #555555;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #777;
  }
`

export const FolderItem = styled.li`
  padding: 8px 10px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #333333;
  }
`
