import styled from 'styled-components'

export const LoadingPage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 1);
  opacity: 0.2;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`

export const Header = styled.header`
  height: 45px;
  background-color: #282828;
  flex-shrink: 0;
  position: relative;
`

export const AccountButton = styled.div`
  height: 30px;
  width: 50px;
  background-color: #333333;
  border-radius: 15px;
  user-select: none;
  position: absolute;
  right: 45px;
  top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover{
    background-color: #3e3e3e;
  }
`

export const Avatar = styled.p`
  user-select: none;
  margin-left: 3px;
  background-color: #2E76FF;
  width: 23px;
  height: 23px;
  border-radius: 11.5px;
  text-align: center;
  font-size: 14px;
  padding-top: 3px;
`

export const OpenArrow = styled.img`
  scale: 1.2;
  margin-right: 8px;
`

export const AccountMenu = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  background-color: #2F2F2F;
  width: 200px;
  height: 90px;
  position: absolute;
  right: 45px;
  top: 42.5px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  flex-direction: column;
`

export const TopWrapper = styled.div`
  margin-top: 12.5px;
  display: flex;
  align-items: center;
  padding: 0 25px;
  gap: 5px;
`

export const AccountTextWrapper = styled.div`
`

export const MenuAvatar = styled(Avatar)`
`

export const FullName = styled.p`
  font-size: 13px;
  max-width: 110px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`

export const Pointer = styled.p`
  font-size: 12px;
  color: #6f6f6f;
`

export const BottomWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

`

export const LogoutButton = styled.button`
  margin-top: 12.5px;
  color: #F12727;
  border: 1px solid #F12727;
  font-size: 13px;
  width: 140px;
  height: 24px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color:#F12727;
    color:#DDDDDD;
  }
`

export const Content = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`

export const NoteDetailsBlock = styled.div`
  padding-top: 70px;
  display: flex;
  justify-content: center;
  flex: 1;
  overflow: auto;
`

export const NoteDetailsWrapper = styled.div`
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

export const ContextMenuIcon = styled.img`
`
