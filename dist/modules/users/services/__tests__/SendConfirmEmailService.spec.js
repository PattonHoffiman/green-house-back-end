"use strict";

require("reflect-metadata");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _FakeMailProvider = _interopRequireDefault(require("../../../../shared/container/providers/MailProvider/fakes/FakeMailProvider"));

var _FakeUserTokensRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUserTokensRepository"));

var _FakeUsersRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUsersRepository"));

var _SendConfirmEmailService = _interopRequireDefault(require("../SendConfirmEmailService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeMailProvider;
let fakeUsersRepository;
let fakeUserTokensRepository;
let sendConfirmEmail;
describe('Send Confirm Email', () => {
  beforeEach(() => {
    fakeMailProvider = new _FakeMailProvider.default();
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeUserTokensRepository = new _FakeUserTokensRepository.default();
    sendConfirmEmail = new _SendConfirmEmailService.default(fakeMailProvider, fakeUsersRepository, fakeUserTokensRepository);
  });
  it('should be able to send an e-mail to confirm the email', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    await sendConfirmEmail.execute('PattonHoffiman@gmail.com');
    expect(fakeMailProvider.messages).toHaveLength(1);
  });
  it('should be able to generate an token to validate the user', async () => {
    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      await sendConfirmEmail.execute('PattonHoffiman@gmail.com');
      expect(generate).toHaveBeenCalledWith(user.id, 'confirm');
    }

    expect(user).not.toBeUndefined();
  });
  it('should not be able to send an e-mail if him does not exists', async () => {
    await expect(sendConfirmEmail.execute('non-existent-email')).rejects.toBeInstanceOf(_AppError.default);
  });
});