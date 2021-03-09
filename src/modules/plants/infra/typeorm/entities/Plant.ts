import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Expose } from 'class-transformer';
import uploadConfig from '@config/upload.config';

@Entity('plants')
export default class Plant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  avatar_url: string;

  @Column('integer')
  days_to_water: number;

  @Column('date')
  water_day: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatar_url(): string | null {
    if (!this.avatar_url) return null;

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar_url}`;

      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar_url}`;

      default:
        return null;
    }
  }
}
