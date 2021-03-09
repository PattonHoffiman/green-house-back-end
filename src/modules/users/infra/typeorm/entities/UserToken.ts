import {
  Entity,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_tokens')
export default class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('')
  @Generated('uuid')
  token: string;

  @Column('uuid')
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('enum')
  type: 'confirm' | 'retrieve';
}
