import { useNavigate } from "react-router-dom";
import * as S from './Signup.styled'
import GoogleIcon from '../assets/icons/GoogleIcon.svg'


const Signup = () => {
  const navigate = useNavigate()

  return (
    <S.Container>
      <S.SignupBlock>
        <S.Label>Sign up for NoteMD</S.Label>
        <S.GoogleButton>
          <S.GoogleIcon src={GoogleIcon}/>Continue with Google!
        </S.GoogleButton>
        <S.OrLabel>OR</S.OrLabel>
        <S.FullNameInput
          placeholder='Full Name...'
          type='text'
        />
        <S.EmailInput
          placeholder='Email...'
          type='email'
        />
        <S.PasswordInput
          placeholder='Password...'
          type='password'
        />
        <S.PasswordInput
          placeholder='Confirm Password...'
          type='password'
        />
        <S.SignupButton>
          Create Account!
        </S.SignupButton>
        <S.AccountLabel>
          Have an account?
          <S.Link> Login!</S.Link>
        </S.AccountLabel>
      </S.SignupBlock>
    </S.Container>
  )
}

export default Signup