import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/citas.entity';
import { User } from 'src/users/entities/user.entity';
import { Profesional } from 'src/profesional/entities/medic.entity';
import { Secretaria } from 'src/secretaria/entities/secre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita, User, Profesional, Secretaria])],
  providers: [TeamsService],
  controllers: [TeamsController]
})
export class TeamsModule {}
