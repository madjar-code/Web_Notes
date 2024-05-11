import * as S from './ResetPassword.styled'


const ResetPassword = () => {
  return (
    <S.Container>
      <S.ResetPasswordBlock>
        <S.Label>Enter your email to reset password</S.Label>
        <S.EmailInput
          placeholder='Email...'
          type='email'
        />
        <S.SubmitButton>
          Submit
        </S.SubmitButton>
        <S.CancelLabel>
          <S.Link>Cancel</S.Link>
        </S.CancelLabel>
      </S.ResetPasswordBlock>
    </S.Container>
  )
}

export default ResetPassword