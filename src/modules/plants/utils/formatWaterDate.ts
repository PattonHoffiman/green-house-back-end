export default function formatWaterDate(plant_water_day: Date): string {
  const water_day = new Date(plant_water_day);
  const formatWaterDay = `${water_day.getFullYear()}-${
    water_day.getMonth() + 1 >= 10
      ? water_day.getMonth() + 1
      : `0${water_day.getMonth() + 1}`
  }-${water_day.getUTCDate()}`;

  return formatWaterDay;
}
