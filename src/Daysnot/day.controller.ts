import { Body, Controller, Delete, Get, Param, Post,Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { DiaNoDisponibleService } from './day.service';
import { CreateDiaNoDisponibleDto } from './dto/Create-day.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Profesional } from 'src/profesional/entities/medic.entity';

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

  @Post()
  @UseGuards(AuthGuard)
  async create(@Request() req, @Body() createDiaNoDisponibleDto: CreateDiaNoDisponibleDto) {
    const profesional = req.user as Profesional;
    if (!profesional || profesional.tipoUsuario !== 'profesional') {
      throw new UnauthorizedException('Solo los profesionales pueden agregar días no disponibles');
    }
    return this.diaNoDisponibleService.create(profesional.id, createDiaNoDisponibleDto);
  }

  @Get()
  async findAll() {
    return this.diaNoDisponibleService.findAll();
  }

  @Get('profesional')
  @UseGuards(AuthGuard)
  async findByProfesional(@Request() req) {
    const profesional = req.user as Profesional;
    if (!profesional || profesional.tipoUsuario !== 'profesional') {
      throw new UnauthorizedException('Solo los profesionales pueden ver sus días no disponibles');
    }
    return this.diaNoDisponibleService.obtenerDiasNoDisponibles(profesional.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.diaNoDisponibleService.eliminarDiaNoDisponible(id);
  }
}