import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cita } from 'src/teams/entities/citas.entity';


@Entity()
export class User {
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
    edad: number;

    @Column()
    direccion: string;

    @Column()
    rut: string;

    @Column()
    seguroMedico: string;

    @OneToMany(() => Cita, cita => cita.paciente)
    citas: Cita[];

    @Column()
    tipoUsuario: string;
}