import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/citas.entity';
import { User } from 'src/users/entities/user.entity';
import { Profesional } from 'src/profesional/entities/medic.entity';
import { Secretaria } from 'src/secretaria/entities/secre.entity';
import { DiaNoDisponible } from 'src/Daysnot/entities/day.entity';
import { HorarioTrabajo } from 'src/comment/entities/horario.entity';
import { MailerModule } from 'src/mailer/mailer.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Cita, User, Profesional, Secretaria, DiaNoDisponible, HorarioTrabajo]),MailerModule],
  providers: [TeamsService],
  controllers: [TeamsController]
})
export class TeamsModule {}
