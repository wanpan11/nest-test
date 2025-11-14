import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username', length: 50 })
  username: string;

  @Column({ name: 'password', length: 50 })
  password: string;
}
