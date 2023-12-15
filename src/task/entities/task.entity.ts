import { Proyecto } from "src/projects/entities/projects.entity";
import { Equipo } from "src/teams/entities/team.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { STATUS_TASK } from "../constants/status-task";
import { Exclude } from "class-transformer";
import { Comentario } from "src/comment/entities/com.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( {unique: true} )
  nombre: string;
  
  @Column()
  descripcion: string;

  @ManyToOne(() => User, { nullable: false })
  creador: User;

  @ManyToOne(() => Equipo, { nullable: true })
  responsable: Equipo;

  @ManyToOne(() => Proyecto, { nullable: false })
  proyecto: Proyecto;

  @Column() 
  estado: string;

  @Column({ nullable: true })
  fechaInicio: Date;

  @Column({ nullable: true })
  fechaTermino: Date;

  @Column({ default: false })
  eliminada: boolean;


  @OneToMany(() => Comentario, comment => comment.tarea, { cascade: true })
  comentarios: Comentario[];

  




}