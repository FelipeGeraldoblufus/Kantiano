
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profesional } from 'src/users/entities/medic.entity';
@Entity()
export class HorarioTrabajo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    diaSemana: string;

    @Column()
    horaInicio: string;

    @Column()
    horaFin: string;

    @ManyToOne(() => Profesional, profesional => profesional.horariosTrabajo)
    profesional: Profesional;
}