import styled from 'styled-components'


export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  /* align-items: center; */
  justify-content: center;
`

export const ResetPasswordBlock = styled.div`
  margin-top: 180px;
  width: 420px;
`

export const Label = styled.h2`
  text-align: center;
  font-weight: var(--semi-bold);
  font-size: 40px;
`

export const EmailInput = styled.input`
  margin-top: 35px;
  width: 420px;
  height: 50px;
  font-size: 17px;
  font-weight: var(--medium);
  background-color: #333333;
  border-radius: 10px;
  padding-left: 20px;

  &:focus {
    outline: 1px solid #276DF1;
    transition: 500ms;
  }
`

export const SubmitButton = styled.button`
  margin-top: 25px;
  width: 420px;
  height: 50px;
  background-color: #276DF1;
  cursor: pointer;
  border-radius: 10px;
  font-weight: var(--semi-bold);
  font-size: 19px;
`

export const CancelLabel = styled.p`
  text-align: center;
  margin-top: 25px;
`

export const Link = styled.a`
  font-size: 16px;
  font-weight: var(--semi-bold);
  color: #276DF1;
  text-align: center;
  &:hover {
    text-decoration: underline;
  }
`
