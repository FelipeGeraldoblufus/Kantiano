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
    equiposCreados: Equipo[];

    @Exclude()
    @OneToMany(() => Proyecto, proyecto => proyecto.creador)
    proyectosCreados: Proyecto[];

    @Column()
    rol: string;

    @DeleteDateColumn()
    deletedAt: Date;


}
