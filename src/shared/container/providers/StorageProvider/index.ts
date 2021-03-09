import { container } from 'tsyringe';
import uploadConfig from '@config/upload.config';

import IStorageProvider from './models/IStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';
import DiskStorageProvider from './implementations/DiskStorageProvider';

const providers = {
  s3: container.resolve(S3StorageProvider),
  disk: container.resolve(DiskStorageProvider),
};

container.registerInstance<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
