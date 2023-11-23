import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Equipo } from 'src/teams/entities/team.entity';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/task/entities/task.entity';


@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ unique: true, nullable: false })
  nombre: string;

  @Column()
  descripcion?: string;
  
  
  @ManyToOne(() => User)
  creador: User;


  @OneToMany(() => Equipo, equipo => equipo.proyecto)
  equipos: Equipo[];

  @OneToMany(() => Task, tarea => tarea.proyecto) // Relación bidireccional
  tareas: Task[];

}