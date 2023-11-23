import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Proyecto } from 'src/projects/entities/projects.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tareaRepository: Repository<Task>,
    @InjectRepository(Proyecto)
    private proyectoRepository: Repository<Proyecto>,
  ) {
    
  }

}
