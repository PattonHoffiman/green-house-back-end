import { v4 as uuid } from 'uuid';
import Plant from '@modules/plants/infra/typeorm/entities/Plant';
import IPlantsRepository from '../IPlantsRepository';

export default class FakePlantsRepository implements IPlantsRepository {
  public plants: Plant[] = [];

  public async save(plant: Plant): Promise<void> {
    this.plants = this.plants.map(arrayPlant => {
      if (arrayPlant.id === plant.id) return plant;
      return arrayPlant;
    });
  }

  public async delete(id: string): Promise<void> {
    const updatedPlants = this.plants.filter(plant => plant.id !== id);
    this.plants = updatedPlants;
  }

  public async saveAll(plants: Plant[]): Promise<void> {
    this.plants = plants;
  }

  public async findById(id: string): Promise<Plant | undefined> {
    const plant = this.plants.find(plant => plant.id === id);
    return plant;
  }

  public async findAll(user_id: string): Promise<Plant[] | undefined> {
    const user_plants = this.plants.filter(plant => plant.user_id === user_id);
    return user_plants.length === 0 ? undefined : user_plants;
  }

  public async findByDate(
    user_id: string,
    date: Date,
  ): Promise<Plant[] | undefined> {
    const water_plants = this.plants.filter(
      plant => plant.user_id === user_id && plant.water_day === date,
    );

    return water_plants.length === 0 ? undefined : water_plants;
  }

  public async create(
    user_id: string,
    name: string,
    days_to_water: number,
    water_day: Date,
  ): Promise<Plant> {
    const plant = new Plant();

    Object.assign(plant, {
      name,
      user_id,
      water_day,
      id: uuid(),
      days_to_water,
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.plants.push(plant);
    return plant;
  }
}
