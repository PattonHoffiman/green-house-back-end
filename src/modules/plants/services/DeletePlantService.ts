import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IPlantsRepository from '../repositories/IPlantsRepository';

@injectable()
export default class DeletePlantService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('PlantsRepository')
    private plantsRepository: IPlantsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const plant = await this.plantsRepository.findById(id);

    if (!plant) throw new AppError('This plant does not exists!');

    if (plant.avatar_url) {
      await this.storageProvider.deleteFile(plant.avatar_url);
    }

    await this.plantsRepository.delete(id);
  }
}
