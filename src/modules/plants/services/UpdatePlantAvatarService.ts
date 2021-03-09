import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IPlantsRepository from '../repositories/IPlantsRepository';

import Plant from '../infra/typeorm/entities/Plant';
import IUpdateAvatarDTO from '../dtos/IUpdateAvatarDTO';

@injectable()
export default class UpdatePlantAvatarService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('PlantsRepository')
    private plantsRepository: IPlantsRepository,
  ) {}

  public async execute({
    plant_id,
    avatar_filename,
  }: IUpdateAvatarDTO): Promise<Plant> {
    const plant = await this.plantsRepository.findById(plant_id);

    if (!plant) throw new AppError('This plant does not exists!', 400);

    if (plant.avatar_url) {
      await this.storageProvider.deleteFile(plant.avatar_url);
    }

    const filename = await this.storageProvider.saveFile(avatar_filename);

    plant.avatar_url = filename;
    await this.plantsRepository.save(plant);

    return plant;
  }
}
