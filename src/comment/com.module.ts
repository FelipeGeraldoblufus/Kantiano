import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComController } from './com.controller';
import { CommentService } from './com.service';
import { HorarioTrabajo } from './entities/horario.entity';

import { Cita } from 'src/teams/entities/citas.entity';
import { User } from 'src/users/entities/user.entity';
import { Profesional } from 'src/profesional/entities/medic.entity';
import { ProfesionalService } from 'src/profesional/prof.service';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioTrabajo, Cita, User, Profesional])],
  controllers: [ComController],
  providers: [CommentService,ProfesionalService],
})
export class CommentModule {}