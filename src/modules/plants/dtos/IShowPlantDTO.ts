import Plant from '../infra/typeorm/entities/Plant';

export default interface IShowPlantDTO {
  plant: Plant;
  water_last_time: Date | string;
  water_next_time: Date | string;
}
