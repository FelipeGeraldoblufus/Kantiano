import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaNoDisponible } from './entities/day.entity';
import { CreateDiaNoDisponibleDto } from './dto/Create-day.dto';
import { Profesional } from 'src/profesional/entities/medic.entity';

@Injectable()
export class DiaNoDisponibleService {
  constructor(
    @InjectRepository(DiaNoDisponible)
    private readonly diaNoDisponibleRepository: Repository<DiaNoDisponible>,
    @InjectRepository(Profesional)
    private readonly profesionalRepository: Repository<Profesional>,
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

  async create(profesionalId: number, createDiaNoDisponibleDto: CreateDiaNoDisponibleDto): Promise<DiaNoDisponible> {
    const profesional = await this.profesionalRepository.findOne({
      where: { id: profesionalId },
      relations: ['diasNoDisponibles'],
    });
    if (!profesional) {
      throw new NotFoundException('Profesional no encontrado');
    }

    const diaNoDisponible = new DiaNoDisponible();
    diaNoDisponible.fecha = createDiaNoDisponibleDto.fecha;
    diaNoDisponible.motivo = createDiaNoDisponibleDto.motivo;
    diaNoDisponible.profesional = profesional;

    profesional.diasNoDisponibles.push(diaNoDisponible);

    await this.profesionalRepository.save(profesional);
    return this.diaNoDisponibleRepository.save(diaNoDisponible);
  }

  async findAll(): Promise<DiaNoDisponible[]> {
    return this.diaNoDisponibleRepository.find({ relations: ['profesional'] });
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