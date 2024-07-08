import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Profesional } from 'src/profesional/entities/medic.entity';

@Entity()
export class HorarioTrabajo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: string; 

  @Column()
  horaInicio: string; // Formato "HH:mm"

  @Column()
  horaFin: string; // Formato "HH:mm"

  @ManyToOne(() => Profesional, profesional => profesional.horariosTrabajo)
  profesional: Profesional;
}
