import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaNoDisponible } from './entities/day.entity';
import { DiaNoDisponibleService } from './day.service';
import { DiaNoDisponibleController } from './day.controller';
import { Profesional } from 'src/profesional/entities/medic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiaNoDisponible, Profesional])],
  providers: [DiaNoDisponibleService],
  controllers: [DiaNoDisponibleController],
  exports: [DiaNoDisponibleService],
})
export class DiaNoDisponibleModule {}