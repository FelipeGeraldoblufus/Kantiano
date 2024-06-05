import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profesional } from 'src/profesional/entities/medic.entity';

@Entity()
export class DiaNoDisponible {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

  @Column()
  motivo: string;

  @ManyToOne(() => Profesional, profesional => profesional.diasNoDisponibles)
  profesional: Profesional;
}