import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
export default class DeleteUserService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const cacheKey = `user-plants:${id}`;
    const user = await this.usersRepository.findById(id);

    if (!user) throw new AppError('This user does not exists!', 400);

    if (user.avatar_url) {
      this.storageProvider.deleteFile(user.avatar_url);
    }

    await this.usersRepository.delete(id);
    await this.cacheProvider.invalidate(cacheKey);
  }
}
