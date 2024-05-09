import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Secretaria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
    
    @Column({ nullable: false })
    password: string;

    @Column()
    apellido: string;

    @Column()
    direccion: string;
    
    @Column()
    tipoUsuario: string;
}