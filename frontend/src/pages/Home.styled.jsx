import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

export const Header = styled.div`
`

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

export const ContextMenuIcon = styled.img`
`
