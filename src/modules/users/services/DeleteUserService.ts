import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
export default class DeleteUserService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) throw new AppError('This user does not exists!', 400);

    if (user.avatar_url) {
      this.storageProvider.deleteFile(user.avatar_url);
    }

    await this.usersRepository.delete(id);
  }
}
