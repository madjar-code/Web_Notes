import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"

import GoogleIcon from '../assets/icons/GoogleIcon.svg'
import * as S from './Login.styled'


const Login = () => {
  const navigate = useNavigate()

  const {loginUser} = useContext(AuthContext)
  const [loginValid, setLoginValid] = useState(true)
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: ''
  })

  const handleEmailChange = (e) => {
    setLoginCredentials(
      {...loginCredentials, email: e.target.value }
    )
  }

  const handlePasswordChange = (e) => {
    setLoginCredentials(
      { ...loginCredentials, password: e.target.value }
    )
  }

  const handleLoginClick = () => {
    setLoginValid(true)
    loginUser(loginCredentials).then(
      status => {
        if (status === 200) {
          navigate('/')
        } else {
          setLoginValid(false)
        }
      }
    )
  }

  return (
    <S.Container>
      <S.LoginBlock>
        <S.Label>Log in to NoteMD</S.Label>
        {!loginValid && <S.LoginErrorMessage>Incorrect email or password</S.LoginErrorMessage>}
        <S.GoogleButton>
          <S.GoogleIcon src={GoogleIcon}/>Continue with Google!
        </S.GoogleButton>
        <S.OrLabel>OR</S.OrLabel>
        <S.EmailInput
          placeholder='Email...'
          type='email'
          onChange={handleEmailChange}
        />
        <S.PasswordInput
          placeholder='Password...'
          type='password'
          onChange={handlePasswordChange}
        />
        <S.LoginButton onClick={handleLoginClick}>
          Log in!
        </S.LoginButton>
        <S.ResetLabel>
          <S.Link>Reset Password</S.Link>
        </S.ResetLabel>
        <S.NoAccountLabel>
          No account?
          <S.Link> Create!</S.Link>
        </S.NoAccountLabel>
      </S.LoginBlock>
    </S.Container>
  )
}

export default Login