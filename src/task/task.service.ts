import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Proyecto } from 'src/projects/entities/projects.entity';
import { Equipo } from 'src/teams/entities/team.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { STATUS_TASK } from './constants/status-task';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tareaRepository: Repository<Task>,
    @InjectRepository(Proyecto)
    private proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,
    @InjectRepository(User)
    private usuarioRepository: Repository<User>,
  ) {}
  async createTask(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    const { nombre, descripcion, equiporesponsable, proyecto, fechaTermino } = createTaskDto;

    const creador = await this.usuarioRepository.findOne({where: { id: userId }});
    if (!creador) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const proyectoAsignado = await this.proyectoRepository.findOne({
      where: { nombre: proyecto, creador },
      relations: ['equipos'],
    });

    if (!proyectoAsignado) {
      throw new NotFoundException('Proyecto no encontrado o no tienes permisos.');
    }

    const equipoAsignado = proyectoAsignado.equipos.find(
      (equipo) => equipo.nombre === equiporesponsable,
    );

    if (!equipoAsignado) {
      throw new NotFoundException('Equipo no encontrado en el proyecto.');
    }

    // Establece la fecha de inicio como la fecha actual
    const fechaInicio = new Date();

    const tarea = this.tareaRepository.create({
        nombre,
        descripcion,
        creador: creador,  // Asumiendo que tienes esta referencia disponible
        responsable: equipoAsignado,  // Asumiendo que ya tienes el equipo asignado
        proyecto: proyectoAsignado,  // Asumiendo que ya tienes el proyecto asignado
        estado: "Pendiente",
        fechaInicio,
        fechaTermino,
        eliminada: false,
        comentarios: [],
    });

    return this.tareaRepository.save(tarea);
}

async getTaskById(taskId: number): Promise<Task> {
  const task = await this.tareaRepository.findOne({
    where: { id: taskId },
    relations: ['comentarios'], // Especifica las relaciones que deseas cargar
  });
  if (!task) {
    throw new NotFoundException('Tarea no encontrada.');
  }

  return task;
}


async getAllTasksByProjectId(projectId: number): Promise<Task[]> {
  const tasks = await this.tareaRepository.find({
    where: { proyecto: { id: projectId } },
    relations: ['comentarios'], // Incluye relaciones adicionales según sea necesario
  });

  return tasks;
}



}
