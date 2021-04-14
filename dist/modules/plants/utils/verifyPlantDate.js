"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = verifyPlantDate;

var _dateFns = require("date-fns");

var _subDays = _interopRequireDefault(require("date-fns/subDays"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function verifyPlantDate(created_day, updated_day, days_to_water) {
  const today = new Date();
  let water_last_time;
  let water_next_time;

  if (days_to_water === 2) {
    water_last_time = 'Before Yesterday';
    water_next_time = 'After Tomorrow';
  } else if (days_to_water === 1) {
    water_last_time = 'Yesterday';
    water_next_time = 'Tomorrow';
  } else {
    water_last_time = (0, _dateFns.format)((0, _subDays.default)(today, days_to_water), 'dd/MM/yyyy');
    water_next_time = (0, _dateFns.format)((0, _dateFns.addDays)(today, days_to_water), 'dd/MM/yyyy');
  }

  if ((0, _dateFns.format)(created_day, 'dd/MM/yyyy') === (0, _dateFns.format)(today, 'dd/MM/yyyy') || (0, _dateFns.format)(updated_day, 'dd/MM/yyyy') === (0, _dateFns.format)(today, 'dd/MM/yyyy')) water_last_time = 'None';
  return {
    water_last_time,
    water_next_time
  };
}