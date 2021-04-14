"use strict";

require("reflect-metadata");

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _FakeMailProvider = _interopRequireDefault(require("../../../../shared/container/providers/MailProvider/fakes/FakeMailProvider"));

var _FakeUserTokensRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUserTokensRepository"));

var _FakeUsersRepository = _interopRequireDefault(require("../../repositories/fakes/FakeUsersRepository"));

var _SendForgotPasswordEmailService = _interopRequireDefault(require("../SendForgotPasswordEmailService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeMailProvider;
let fakeUsersRepository;
let fakeUserTokensRepository;
let sendForgotPasswordEmail;
describe('Send Forgot Password Email', () => {
  beforeEach(() => {
    fakeMailProvider = new _FakeMailProvider.default();
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeUserTokensRepository = new _FakeUserTokensRepository.default();
    sendForgotPasswordEmail = new _SendForgotPasswordEmailService.default(fakeMailProvider, fakeUsersRepository, fakeUserTokensRepository);
  });
  it('should be able to send an e-mail to recover password', async () => {
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    await sendForgotPasswordEmail.execute('PattonHoffiman@gmail.com');
    expect(fakeMailProvider.messages).toHaveLength(1);
  });
  it('should be able to generate an token to validate the user', async () => {
    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');
    await fakeUsersRepository.create('Patton Hoffiman', 'PattonHoffiman@gmail.com', 'a-password');
    const user = await fakeUsersRepository.findByEmail('PattonHoffiman@gmail.com');

    if (user) {
      await sendForgotPasswordEmail.execute('PattonHoffiman@gmail.com');
      expect(generate).toHaveBeenCalledWith(user.id, 'retrieve');
    }

    expect(user).not.toBeUndefined();
  });
  it('should not be able to send an e-mail if him does not exists', async () => {
    await expect(sendForgotPasswordEmail.execute('non-existent-email')).rejects.toBeInstanceOf(_AppError.default);
  });
});