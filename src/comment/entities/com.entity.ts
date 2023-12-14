import { Task } from "src/task/entities/task.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Comentario {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comentario: string;
  
  @ManyToOne(() => User, { nullable: false })
  creador: User;

  @ManyToOne(() => Task, task => task.comentarios)
  tarea: Task;

  @Column({ nullable: true })
  fechaInicio: Date;

  @Column({ default: false })
  eliminada: boolean;
  


}