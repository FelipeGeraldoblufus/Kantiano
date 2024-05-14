import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComController } from './com.controller';
import { CommentService } from './com.service';
import { HorarioTrabajo } from './entities/horario.entity';

import { Cita } from 'src/teams/entities/citas.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioTrabajo, Cita, User])],
  controllers: [ComController],
  providers: [CommentService],
})
export class CommentModule {}