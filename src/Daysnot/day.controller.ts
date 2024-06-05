import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DiaNoDisponibleService } from './day.service';
import { CreateDiaNoDisponibleDto } from './dto/Create-day.dto';

@Controller('dias-no-disponibles')
export class DiaNoDisponibleController {
  constructor(private readonly diaNoDisponibleService: DiaNoDisponibleService) {}

  @Post(':profesionalId')
  async agregarDiaNoDisponible(
    @Param('profesionalId') profesionalId: number,
    @Body() createDiaNoDisponibleDto: CreateDiaNoDisponibleDto,
  ) {
    return this.diaNoDisponibleService.agregarDiaNoDisponible(profesionalId, createDiaNoDisponibleDto);
  }

  @Get(':profesionalId')
  async obtenerDiasNoDisponibles(@Param('profesionalId') profesionalId: number) {
    return this.diaNoDisponibleService.obtenerDiasNoDisponibles(profesionalId);
  }

  @Delete(':id')
  async eliminarDiaNoDisponible(@Param('id') id: number) {
    return this.diaNoDisponibleService.eliminarDiaNoDisponible(id);
  }
}