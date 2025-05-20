import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user') // 表名
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    length: 50,
  })
  name: string;
}
