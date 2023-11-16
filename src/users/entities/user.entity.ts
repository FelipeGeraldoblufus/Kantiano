import { Exclude } from "class-transformer";
import { Proyecto } from "src/projects/entities/projects.entity";
import { Equipo } from "src/teams/entities/team.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    
    @Exclude()
    @OneToMany(() => Equipo, equipo => equipo.miembros)
    equiposCreados: Equipo[];

    @Exclude()
    @OneToMany(() => Proyecto, proyecto => proyecto.creador)
    proyectosCreados: Proyecto[];

    @Column({ default: "user" })
    rol: string;

    @DeleteDateColumn()
    deletedAt: Date;


}
