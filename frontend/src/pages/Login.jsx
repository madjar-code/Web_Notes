import { useNavigate } from "react-router-dom";
import * as S from './Login.styled'
import GoogleIcon from '../assets/icons/GoogleIcon.svg'


const Login = () => {
  const navigate = useNavigate()

  return (
    <S.Container>
      <S.LoginBlock>
        <S.Label>Log in to NoteMD</S.Label>
        <S.GoogleButton>
          <S.GoogleIcon src={GoogleIcon}/>Continue with Google!
        </S.GoogleButton>
        <S.OrLabel>OR</S.OrLabel>
        <S.EmailInput
          placeholder='Email...'
          type='email'
        />
        <S.PasswordInput
          placeholder='Password...'
          type='password'
        />
        <S.LoginButton>
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