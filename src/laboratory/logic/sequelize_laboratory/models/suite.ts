import { DataType, Column, Model, Table } from 'sequelize-typescript';

import { ISuite, SuiteVolume } from '../../interfaces';

import { jsonColumn } from './decorators';

@Table
export class Suite extends Model<Suite> implements ISuite {
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  name!: string;

  @Column(DataType.STRING)
  author!: string;

  @Column(DataType.STRING)
  benchmark!: string;

  // TODO: REVIEW: magic number 1024
  @Column(jsonColumn<SuiteVolume[]>('volumes', 1024))
  volumes!: SuiteVolume[];
}
