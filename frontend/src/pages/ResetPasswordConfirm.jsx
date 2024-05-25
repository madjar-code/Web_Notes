import { useState } from 'react'
import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import * as S from './ResetPasswordConfirm.styled'


const ResetPasswordConfirm = () => {
  const navigate = useNavigate()
  const { resetPasswordConfirm } = useContext(AuthContext)
  const { uid, token } = useParams()
  const [resetPasswordCredentials, setResetPasswordCredentials] = useState({
    new_password: '',
    confirm_new_password: ''
  })
  const [errors, setErrors] = useState({
    new_password: '',
    confirm_new_password: ''
  })

  const handleNewPasswordChange = (e) => {
    setResetPasswordCredentials(
      {...resetPasswordCredentials, new_password: e.target.value}
    )
  }

  const handleConfirmNewPasswordChange = (e) => {
    setResetPasswordCredentials(
      {...resetPasswordCredentials, confirm_new_password: e.target.value}
    )
  }

  const validatePasswords = () => {
    const { new_password, confirm_new_password } = resetPasswordCredentials
    let valid = true

    if (new_password.length < 3) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        new_password: 'Password must be at least 3 characters'
      }))
      valid = false
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        new_password: ''
      }))
    }    
    if (new_password !== confirm_new_password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirm_new_password: 'Passwords do not match'
      }))
      valid = false
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirm_new_password: ''
      }))
    }
    return valid
  }
  
  const handleResetPasswordClick = () => {
    if (validatePasswords()) {
      resetPasswordConfirm({
        new_password: resetPasswordCredentials.new_password,
        uid: uid,
        token: token,
      }).then((status) => {
        // update error handling
        if (status === 204) {
          alert('Password reset successful! You can now log in with your new password.')
        }
      })
    }
  }

  const areFieldsFilled = () => {
    return (
      resetPasswordCredentials.new_password &&
      resetPasswordCredentials.confirm_new_password
    )
  }

  return (
    <S.Container>
      <S.ResetPasswordConfirmBlock>
        <S.Label>Enter new password</S.Label>
        <S.PasswordInput
          placeholder='New Password...'
          type='password'
          onChange={handleNewPasswordChange}
        />
        {errors.new_password && (
          <S.ErrorMessage>{errors.new_password}</S.ErrorMessage>
        )}
        <S.ConfirmPasswordInput
          placeholder='Confirm New Password...'
          type='password'
          onChange={handleConfirmNewPasswordChange}
        />
        {errors.confirm_new_password && (
          <S.ErrorMessage>{errors.confirm_new_password}</S.ErrorMessage>
        )}
        <S.ResetPasswordButton
          onClick={handleResetPasswordClick}
          disabled={!areFieldsFilled()}
          style={{ opacity: !areFieldsFilled() ? 0.4 : 1 }}
        >
          Reset Password!
        </S.ResetPasswordButton>
        <S.CancelLabel>
          <S.Link onClick={() => navigate('/login')}>Cancel</S.Link>
        </S.CancelLabel>
      </S.ResetPasswordConfirmBlock>
    </S.Container>
  )
}

export default ResetPasswordConfirm