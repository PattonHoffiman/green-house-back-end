"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatWaterDate;

function formatWaterDate(plant_water_day) {
  const water_day = new Date(plant_water_day);
  const formatWaterDay = `${water_day.getFullYear()}-${water_day.getMonth() + 1 >= 10 ? water_day.getMonth() + 1 : `0${water_day.getMonth() + 1}`}-${water_day.getUTCDate()}`;
  return formatWaterDay;
}