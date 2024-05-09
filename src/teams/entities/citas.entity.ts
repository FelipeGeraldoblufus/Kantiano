import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Profesional } from 'src/users/entities/medic.entity';

@Entity()
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

  @Column()
  hora: string;

  @Column()
  tipoReserva: string;

  @Column()
  estado: string;

  @ManyToOne(() => User, paciente => paciente.citas)
  paciente: User;

  @ManyToOne(() => Profesional, profesional => profesional.citas)
  profesional: Profesional;
}
  

