import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/projects.entity';
import { ProyectosController } from './projects.controller';
import { ProyectosService } from './projects.service';
import { Equipo } from 'src/teams/entities/team.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, Equipo, User])],
  controllers: [ProyectosController],
  providers: [ProyectosService],
})
export class ProyectosModule {}