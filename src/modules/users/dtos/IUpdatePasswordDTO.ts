export default interface IUpdatePasswordDTO {
  id: string;
  password: string;
  new_password: string;
  confirm_password: string;
}
