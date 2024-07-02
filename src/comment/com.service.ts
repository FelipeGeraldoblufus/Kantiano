import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioTrabajo } from './entities/horario.entity';
import { User } from 'src/users/entities/user.entity';

import {CreateHorarioTrabajoDto } from './dto/Create-com-dto';
import { Profesional } from 'src/profesional/entities/medic.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(HorarioTrabajo)
    private readonly horarioTrabajoRepository: Repository<HorarioTrabajo>,
    @InjectRepository(Profesional)
    private readonly profesionalRepository: Repository<Profesional>,
  ) {}


  async create(createHorarioTrabajoDto: CreateHorarioTrabajoDto): Promise<HorarioTrabajo[]> {
    const profesional = await this.profesionalRepository.findOne({
      where: { email: createHorarioTrabajoDto.emailDoctor },
    });
    if (!profesional) {
      throw new NotFoundException('Profesional no encontrado');
    }

    const { fecha, horaInicio, horaFin } = createHorarioTrabajoDto;
    const horarios: HorarioTrabajo[] = [];

    let currentHour = this.convertToMinutes(horaInicio);
    const endHour = this.convertToMinutes(horaFin);

    while (currentHour < endHour) {
      const horario = new HorarioTrabajo();
      horario.fecha = fecha;
      horario.horaInicio = this.convertToTimeString(currentHour);
      currentHour += 60; // Añadir 60 minutos para el siguiente intervalo
      horario.horaFin = this.convertToTimeString(currentHour);
      horario.profesional = profesional;

      horarios.push(horario);
    }

    return this.horarioTrabajoRepository.save(horarios);
  }

  private convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private convertToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
  }
  /*
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
  */
}


