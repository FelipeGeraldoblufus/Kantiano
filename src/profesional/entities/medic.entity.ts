import { DiaNoDisponible } from 'src/Daysnot/entities/day.entity';
import { HorarioTrabajo } from 'src/comment/entities/horario.entity';
import { Cita } from 'src/teams/entities/citas.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Profesional {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column()
    apellido: string;

    @Column()
    especialidad: string;

    @OneToMany(() => HorarioTrabajo, horarioTrabajo => horarioTrabajo.profesional)
    horariosTrabajo: HorarioTrabajo[];

    @OneToMany(() => Cita, cita => cita.profesional)
    citas: Cita[];

    @OneToMany(() => DiaNoDisponible, diaNoDisponible => diaNoDisponible.profesional)
    diasNoDisponibles: DiaNoDisponible[];

    @Column()
    tipoUsuario: string;
}