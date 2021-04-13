import { getRepository, Repository } from 'typeorm';

import IPlantRepository from '@modules/plants/repositories/IPlantsRepository';
import Plant from '../entities/Plant';

export default class PlantsRepository implements IPlantRepository {
  private ormRepository: Repository<Plant>;

  constructor() {
    this.ormRepository = getRepository(Plant);
  }

  public async save(plant: Plant): Promise<void> {
    await this.ormRepository.save(plant);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async saveAll(plants: Plant[]): Promise<void> {
    await this.ormRepository.save(plants);
  }

  public async findById(id: string): Promise<Plant | undefined> {
    const plant = await this.ormRepository.findOne(id);
    return plant;
  }

  public async findAll(user_id: string): Promise<Plant[] | undefined> {
    const plants = await this.ormRepository.find({ where: { user_id } });
    return plants.length === 0 ? undefined : plants;
  }

  public async findByDate(
    user_id: string,
    date: Date,
  ): Promise<Plant[] | undefined> {
    const plants = await this.ormRepository.find({
      where: { user_id, water_day: date },
    });

    return plants.length === 0 ? undefined : plants;
  }

  public async create(
    user_id: string,
    name: string,
    days_to_water: number,
    water_day: Date,
  ): Promise<Plant> {
    const newPlant = this.ormRepository.create({
      user_id,
      name,
      days_to_water,
      water_day,
    });

    await this.ormRepository.save(newPlant);
    return newPlant;
  }
}
