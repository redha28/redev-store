import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@email.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  password: string;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
