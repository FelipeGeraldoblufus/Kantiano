import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  nombre: string;

  @Column()
  descripcion: string;

  @ManyToMany(() => User)
  @JoinTable()
  miembros: User[];

  @ManyToOne(() => User)
  creador: User;
}