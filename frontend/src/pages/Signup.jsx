import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from './Signup.styled'
import GoogleIcon from '../assets/icons/GoogleIcon.svg'
import AuthContext from "../context/AuthContext";


const Signup = () => {
  const navigate = useNavigate()
  const {loginUser, signupUser} = useContext(AuthContext)

  const [signupCredentials, setSignupCredentials] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  })

  const [validationErrors, setValidationErrors] = useState({})

  const handleFullNameChange = (e) => {
    setSignupCredentials(
      {...signupCredentials, full_name: e.target.value}
    )
  }

  const handleEmailChange = (e) => {
    setSignupCredentials(
      {...signupCredentials, email: e.target.value}
    )
  }

  const handlePasswordChange = (e) => {
    setSignupCredentials(
      {...signupCredentials, password: e.target.value}
    )
  }

  const handleConfirmPasswordChange = (e) => {
    setSignupCredentials(
      {...signupCredentials, confirm_password: e.target.value}
    )
  }
  
  const validateFullName = (full_name) => {
    const nameParts = full_name.trim().split(' ')
    return nameParts.length === 2
  }
  
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }
  
  const validatePasswords = (password, confirm_password) => {
    return password.length >= 3 && password === confirm_password
  }
  
  const handleSignupClick = () => {
    const { full_name, email, password, confirm_password } = signupCredentials

    const isFullNameValid = validateFullName(full_name)
    const isEmailValid = validateEmail(email)
    const arePasswordsValid = validatePasswords(password, confirm_password)

    const errors = {}
    if (!isFullNameValid) errors.full_name = 'Full name must consist of 2 words'
    if (!isEmailValid) errors.email = 'Invalid email format'
    if (!arePasswordsValid) {
      if (password.length < 3) errors.password = 'Password must be at least 3 characters'
      if (password !== confirm_password) errors.confirm_password = 'Passwords do not match'
    }

    setValidationErrors(errors)

    const [first_name, last_name] = signupCredentials.full_name.trim().split(' ')

    if (isFullNameValid && isEmailValid && arePasswordsValid) {
      signupUser({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password
      }).then((response_obj) => {
        if (response_obj.status == 400) {
          if (response_obj.data?.email) {
            setValidationErrors({
              email: response_obj.data.email[0]
            })
          }
        } else {
          loginUser({
            email: signupCredentials.email,
            password: signupCredentials.password,
          }).then(() => navigate('/'))
        }
      })
    }
  }

  const areFieldsFilled = () => {
    return (
      signupCredentials.full_name &&
      signupCredentials.email &&
      signupCredentials.password &&
      signupCredentials.confirm_password
    )
  }

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
          onChange={handleFullNameChange}
        />
        {validationErrors.full_name && (
          <S.ErrorMessage>{validationErrors.full_name}</S.ErrorMessage>
        )}
        <S.EmailInput
          placeholder='Email...'
          type='email'
          onChange={handleEmailChange}
        />
        {validationErrors.email && (
          <S.ErrorMessage>{validationErrors.email}</S.ErrorMessage>
        )}
        <S.PasswordInput
          placeholder='Password...'
          type='password'
          onChange={handlePasswordChange}
        />
        {validationErrors.password && (
          <S.ErrorMessage>{validationErrors.password}</S.ErrorMessage>
        )}
        <S.PasswordInput
          placeholder='Confirm Password...'
          type='password'
          onChange={handleConfirmPasswordChange}
        />
        {validationErrors.confirm_password && (
          <S.ErrorMessage>{validationErrors.confirm_password}</S.ErrorMessage>
        )}
        <S.SignupButton
          onClick={handleSignupClick}
          disabled={!areFieldsFilled()}
          style={{ opacity: !areFieldsFilled() ? 0.4 : 1 }}
        >
          Create Account!
        </S.SignupButton>
        <S.AccountLabel>
          Have an account?
          <S.Link onClick={() => navigate('/login')}> Login!</S.Link>
        </S.AccountLabel>
      </S.SignupBlock>
    </S.Container>
  )
}

export default Signup