import { useNavigate } from 'react-router-dom'
import * as S from './ResetPassword.styled'
import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'


const ResetPassword = () => {
  const navigate = useNavigate()
  const { resetPassword } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async () => {
    setError(null)
    if (!validateEmail(email)) {
      setError('Enter a valid email address.')
      return
    }
    resetPassword({email: email}).then((status) => {
      if (status === 204) {
        setSubmitted(true)
      }
    })
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  const areFieldFilled = () => email

  return (
    <S.Container>
      {submitted ? (
        <S.EmailSentBlock>
          <S.EmailSentText>
            If an account exists for {email},
            you will get an email with instructions on
            resetting your password. If it doesn't arrive,
            be sure to check your spam folder.
          </S.EmailSentText>
          <S.BackLink onClick={() => navigate('/login')}>Back to Login</S.BackLink>
        </S.EmailSentBlock>
      ) : (
        <S.ResetPasswordBlock>
          <S.Label>Enter your email to reset password</S.Label>
          <S.EmailInput
            placeholder='Email...'
            type='email'
            value={email}
            onChange={handleChange}
          />
          {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
          <S.SubmitButton
            onClick={handleSubmit}
            disabled={!areFieldFilled()}
            style={{ opacity: !areFieldFilled() ? 0.4 : 1 }}
          >
            Submit
          </S.SubmitButton>
          <S.CancelLabel>
            <S.Link onClick={() => navigate('/login')}>Cancel</S.Link>
          </S.CancelLabel>
        </S.ResetPasswordBlock>
      )}
    </S.Container>
  )
}

export default ResetPassword