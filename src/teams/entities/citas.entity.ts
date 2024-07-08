import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Profesional } from 'src/profesional/entities/medic.entity';

@Entity()
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: string;

  @Column()
  hora: string;

  @Column()
  tipoReserva: string;

  @Column()
  estado: string;

  @ManyToOne(() => User, paciente => paciente.citas,  { onDelete: 'CASCADE' })
  paciente: User;

  @ManyToOne(() => Profesional, profesional => profesional.citas, { onDelete: 'CASCADE' })
  profesional: Profesional;
}
  

