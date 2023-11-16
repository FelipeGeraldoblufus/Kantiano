import { Controller, Get, Post, Body, Param, Put, Delete, Request, UseGuards } from '@nestjs/common';
import { ProyectosService } from './projects.service';
import { Proyecto } from './entities/projects.entity';
import { CreateProjectDto } from './dto/create-projects';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Get()
  findAll(): Promise<Proyecto[]> {
    return this.proyectosService.findAll();
  }

  
  @Post('crearProyecto')
  @UseGuards(AuthGuard)
  async create(@Request() req, @Body() proyectoData: CreateProjectDto) {
    const userId = req;
    const { name, descripcion } = proyectoData;
    const proyecto = await this.proyectosService.createProject(userId, name, descripcion);
    return proyecto;
  }
  
        
}