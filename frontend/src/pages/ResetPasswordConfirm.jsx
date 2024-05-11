import * as S from './ResetPasswordConfirm.styled'


const ResetPasswordConfirm = () => {
  return (
    <S.Container>
      <S.ResetPasswordConfirmBlock>
        <S.Label>Enter new password</S.Label>
        <S.PasswordInput
          placeholder='Password...'
          type='password'
        />
        <S.ConfirmPasswordInput
          placeholder='Confirm Password...'
          type='password'
        />
        <S.ResetPasswordButton>
          Reset Password!
        </S.ResetPasswordButton>
        <S.CancelLabel>
          <S.Link>Cancel</S.Link>
        </S.CancelLabel>
      </S.ResetPasswordConfirmBlock>
    </S.Container>
  )
}

export default ResetPasswordConfirm