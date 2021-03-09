import { addDays, format } from 'date-fns';
import subDays from 'date-fns/subDays';

interface IResponse {
  water_last_time: string;
  water_next_time: string;
}

export default function verifyPlantDate(
  water_day: Date,
  created_day: Date,
  days_to_water: number,
): IResponse {
  const today = new Date();

  let water_last_time: string;
  let water_next_time: string;

  if (days_to_water === 2) {
    water_last_time = 'Before Yesterday';
    water_next_time = 'After Tomorrow';
  } else if (days_to_water === 1) {
    water_last_time = 'Yesterday';
    water_next_time = 'Tomorrow';
  } else {
    water_last_time = format(subDays(today, days_to_water), 'dd/MM/yyyy');
    water_next_time = format(addDays(today, days_to_water), 'dd/MM/yyyy');
  }

  if (format(created_day, 'dd/MM/yyyy') === format(today, 'dd/MM/yyyy'))
    water_last_time = 'None';

  return {
    water_last_time,
    water_next_time,
  };
}
