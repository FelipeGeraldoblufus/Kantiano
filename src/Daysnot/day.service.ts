import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaNoDisponible } from './entities/day.entity';
import { CreateDiaNoDisponibleDto } from './dto/Create-day.dto';

@Injectable()
export class DiaNoDisponibleService {
  constructor(
    @InjectRepository(DiaNoDisponible)
    private readonly diaNoDisponibleRepository: Repository<DiaNoDisponible>,
  ) {}

  async agregarDiaNoDisponible(profesionalId: number, createDiaNoDisponibleDto: CreateDiaNoDisponibleDto): Promise<DiaNoDisponible> {
    const { fecha, motivo } = createDiaNoDisponibleDto;

    const diaNoDisponible = this.diaNoDisponibleRepository.create({
      fecha,
      motivo,
      profesional: { id: profesionalId } as any,
    });

    return this.diaNoDisponibleRepository.save(diaNoDisponible);
  }

  async obtenerDiasNoDisponibles(profesionalId: number): Promise<DiaNoDisponible[]> {
    return this.diaNoDisponibleRepository.find({ where: { profesional: { id: profesionalId } } });
  }

  async eliminarDiaNoDisponible(id: number): Promise<void> {
    const result = await this.diaNoDisponibleRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Día no disponible con ID ${id} no encontrado`);
    }
  }
}