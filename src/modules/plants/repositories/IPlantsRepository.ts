import Plant from '../infra/typeorm/entities/Plant';

export default interface IPlantRepository {
  save(plant: Plant): Promise<void>;
  delete(id: string): Promise<void>;
  saveAll(plants: Plant[]): Promise<void>;
  findById(id: string): Promise<Plant | undefined>;
  findAll(user_id: string): Promise<Plant[] | undefined>;
  findByDate(user_id: string, date: Date): Promise<Plant[] | undefined>;
  create(
    user_id: string,
    name: string,
    days_to_water: number,
    water_day: Date,
  ): Promise<Plant>;
}
