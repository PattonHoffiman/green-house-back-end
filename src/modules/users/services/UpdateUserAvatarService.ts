import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';
import IUpdateAvatarDTO from '../dtos/IUpdateAvatarDTO';

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    avatar_filename,
  }: IUpdateAvatarDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('This users do not exists', 400);

    if (user.avatar_url) {
      await this.storageProvider.deleteFile(user.avatar_url);
    }

    const filename = await this.storageProvider.saveFile(avatar_filename);

    user.avatar_url = filename;
    await this.usersRepository.save(user);

    return user;
  }
}
