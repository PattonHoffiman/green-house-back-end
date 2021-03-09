import 'reflect-metadata';
import { addDays } from 'date-fns';

import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ShowUserPlantsService from '../ShowUserPlantsService';
import FakePlantsRepository from '../../repositories/fakes/FakePlantsRepository';

let showUserPlants: ShowUserPlantsService;
let fakeUsersRepository: FakeUsersRepository;
let fakePlantsRepository: FakePlantsRepository;

describe('Show User Plants Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePlantsRepository = new FakePlantsRepository();

    showUserPlants = new ShowUserPlantsService(
      fakeUsersRepository,
      fakePlantsRepository,
    );
  });

  it('should be able to list all plants for a given user', async () => {
    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      const today = new Date();

      await fakePlantsRepository.create(user.id, 'Ann', 2, addDays(today, 2));
      await fakePlantsRepository.create(user.id, 'Jack', 3, addDays(today, 3));
      await fakePlantsRepository.create(user.id, 'Fredy', 4, addDays(today, 4));

      const userPlants = await showUserPlants.execute(user.id);

      if (userPlants) {
        expect(userPlants.length).toEqual(3);
      }

      expect(userPlants).not.toBeNull();
    }

    expect(user).not.toBeUndefined();
  });

  it("should not be able to list plants if the user doesn't exists", async () => {
    await expect(showUserPlants.execute('fake-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should be returning null if the user does not have any plants', async () => {
    await fakeUsersRepository.create(
      'Patton Hoffiman',
      'PattonHoffiman@gmail.com',
      'a-password',
    );

    const user = await fakeUsersRepository.findByEmail(
      'PattonHoffiman@gmail.com',
    );

    if (user) {
      const userPlants = await showUserPlants.execute(user.id);
      expect(userPlants).toBeNull();
    }

    expect(user).not.toBeUndefined();
  });
});
