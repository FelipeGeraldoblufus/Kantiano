import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesional } from './entities/medic.entity';
import { ProfesionalController } from './prof.controller';
import { ProfesionalService } from './prof.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profesional])],
  controllers: [ProfesionalController],
  providers: [ProfesionalService],
  exports: [ProfesionalService],
})
export class ProfesionalModule {}
