import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { Proyecto } from 'src/projects/entities/projects.entity'; // Asegúrate de importar la entidad del proyecto

@Module({
  imports: [TypeOrmModule.forFeature([Task, Proyecto])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}