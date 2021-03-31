import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IPlantsRepository from '../repositories/IPlantsRepository';

import Plant from '../infra/typeorm/entities/Plant';
import IUpdateAvatarDTO from '../dtos/IUpdateAvatarDTO';

@injectable()
export default class UpdatePlantAvatarService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('PlantsRepository')
    private plantsRepository: IPlantsRepository,
  ) {}

  public async execute({
    user_id,
    plant_id,
    avatar_filename,
  }: IUpdateAvatarDTO): Promise<Plant> {
    const cacheKey = `user-plants:${user_id}`;
    const plant = await this.plantsRepository.findById(plant_id);

    if (!plant) throw new AppError('This plant does not exists!', 400);

    if (plant.avatar_url) {
      await this.storageProvider.deleteFile(plant.avatar_url);
    }

    const filename = await this.storageProvider.saveFile(avatar_filename);

    plant.avatar_url = filename;
    await this.plantsRepository.save(plant);

    const plants = await this.cacheProvider.recover<Plant[]>(cacheKey);

    if (plants) {
      const updatedPlants = plants.map(plantArray => {
        if (plantArray.id === plant.id) {
          const address = plant.getAvatar_url();
          if (address) plantArray.avatar_url = address;
        }

        return plantArray;
      });

      await this.cacheProvider.invalidate(cacheKey);
      await this.cacheProvider.save(cacheKey, classToClass(updatedPlants));
    }

    return plant;
  }
}
