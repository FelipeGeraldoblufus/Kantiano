import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Proyecto } from 'src/projects/entities/projects.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ unique: true, nullable: false })
  nombre: string;

  @Column()
  descripcion: string;
  
  
  @ManyToMany(() => User)
  @JoinTable()
  miembros: User[];

  @ManyToOne(() => User)
  creador: User;
  
  @ManyToOne(() => Proyecto, proyecto => proyecto.equipos, { nullable: true }) // Un equipo puede pertenecer a un proyecto (opcional)
  proyecto: Proyecto;
}