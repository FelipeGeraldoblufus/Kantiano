import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './entities/horario.entity';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/task/entities/task.entity';
import { CreateComDto } from './dto/Create-com-dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comentario)
    private readonly commentRepository: Repository<Comentario>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async createComment(createComDto: CreateComDto, userId: number): Promise<Comentario> {
    const { Tarea, Comentario } = createComDto;

    // Buscar usuario por nombre en el repositorio de usuarios
    const creador = await this.userRepository.findOne({where: { id: userId }});
    if (!creador) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    // Buscar tarea por nombre en el repositorio de tareas
    const tarea: Task = await this.taskRepository.findOne({ where: { nombre: Tarea } });

    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }

    // Establece la fecha de inicio como la fecha actual
    const fechaInicio = new Date();

    // Crear y guardar el comentario
    const nuevoComentario = this.commentRepository.create({
      comentario: Comentario,
      creador,
      tarea: tarea,
      fechaInicio,
      eliminada: false,
    });

    return this.commentRepository.save(nuevoComentario);
  }
}


