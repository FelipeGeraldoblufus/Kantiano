import { Proyecto } from "src/projects/entities/projects.entity";
import { Equipo } from "src/teams/entities/team.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
  
  @Column()
  descripcion: string;

  @ManyToOne(() => User, { nullable: false })
  creador: User;

  @ManyToOne(() => Equipo, { nullable: true })
  responsable: Equipo;

  @ManyToOne(() => Proyecto, { nullable: false })
  proyecto: Proyecto;

  @Column({ default: 'pendiente' }) 
  estado: string;

  @Column({ nullable: true })
  fechaInicio: Date;

  @Column({ nullable: true })
  fechaTermino: Date;

  @Column({ default: false })
  eliminada: boolean;


}