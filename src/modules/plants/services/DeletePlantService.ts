import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import Plant from '@modules/plants/infra/typeorm/entities/Plant';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPlantsRepository from '../repositories/IPlantsRepository';

@injectable()
export default class DeletePlantService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('PlantsRepository')
    private plantsRepository: IPlantsRepository,
  ) {}

  public async execute(id: string, user_id: string): Promise<void> {
    const cacheKey = `user-plants:${user_id}`;
    const plant = await this.plantsRepository.findById(id);

    if (!plant) throw new AppError('This plant does not exists!');

    if (plant.avatar_url) {
      await this.storageProvider.deleteFile(plant.avatar_url);
    }

    await this.plantsRepository.delete(id);

    const plants = await this.cacheProvider.recover<Plant[]>(cacheKey);

    if (plants) {
      const updatedPlants = plants.filter(
        arrayPlant => arrayPlant.id !== plant.id,
      );

      await this.cacheProvider.invalidate(cacheKey);
      await this.cacheProvider.save(cacheKey, classToClass(updatedPlants));
    }
  }
}
