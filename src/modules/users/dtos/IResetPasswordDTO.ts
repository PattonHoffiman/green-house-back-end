export default interface IResetPasswordDTO {
  token: string;
  password: string;
  password_confirmation: string;
}
