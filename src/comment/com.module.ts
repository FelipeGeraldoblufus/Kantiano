import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComController } from './com.controller';
import { CommentService } from './com.service';
import { Comentario } from './entities/horario.entity';
import { Proyecto } from 'src/projects/entities/projects.entity'; // Asegúrate de importar la entidad del proyecto
import { Equipo } from 'src/teams/entities/citas.entity';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/task/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comentario,Task, Proyecto, Equipo, User])],
  controllers: [ComController],
  providers: [CommentService],
})
export class CommentModule {}