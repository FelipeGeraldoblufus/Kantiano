import { Controller, Get, Post, Body, Param, Put, Delete, Request, UseGuards, Patch, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ProyectosService } from './projects.service';
import { Proyecto } from './entities/projects.entity';
import { CreateProjectDto } from './dto/create-projects';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UpdateProjectDto } from './dto/update-project-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddTeamProjectDto } from './dto/add-teamproyect-dto';
import { RemoveTeamProjectDto } from './dto/remove-teamprojects-dto';

@Controller('proyectos')
export class ProyectosController {
  constructor(@InjectRepository(Proyecto)
  private readonly proyectoRepository: Repository<Proyecto>, private readonly proyectosService: ProyectosService) {}

  @Get()
  findAll(): Promise<Proyecto[]> {
    return this.proyectosService.findAll();
  }

  @Get('misproyectos')
  @UseGuards(AuthGuard)
    async getAllTeams(@Request() req) {
      // Obtén el email del usuario desde el token
      const userEmail = req.user.email;

      // Llama al servicio de equipos para obtener los equipos asociados con el email del usuario
      const equipos = await this.proyectosService.getAllTeams(userEmail);

      return equipos;
  } 
  
  @Post('crearProyecto')
  @UseGuards(AuthGuard)
  async create(@Request() req, @Body() proyectoData: CreateProjectDto) {
    const userId = req.user.id;
    console.log("controlador",userId)
    const { name, descripcion } = proyectoData;
    const proyecto = await this.proyectosService.createProject(userId, name, descripcion);
    return proyecto;
  }
  @Delete(':name')
  @UseGuards(AuthGuard)
  async delete(@Request() req, @Param('name') proyectoId: string) {
    const userId = req.user.id;
    const result = await this.proyectosService.deleteProject(userId, proyectoId);
    return { success: result };
  }

  @Patch('editproject/:projectId')
  @UseGuards(AuthGuard)
  async update(@Request() req, @Param('projectId', ParseIntPipe) projectId: number, @Body() proyectoData: UpdateProjectDto) {
    const userId = req.user.id;
    const result = await this.proyectosService.updateProject(userId, proyectoData, projectId);
    return { success: result };
  }

  @Post('addequipos')
  @UseGuards(AuthGuard)
  async addEquipoToProyecto(
    @Request() req,
    @Body() addEquipoDto: AddTeamProjectDto,
  ){
    const userId = req.user.id;
    return this.proyectosService.addEquipoToProyecto(userId, addEquipoDto);
  }

  @Delete('removeequipo')
  @UseGuards(AuthGuard)
  async removeEquipoFromProyecto(
    @Request() req,
    @Body() removeEquipoDto: RemoveTeamProjectDto,
  ) {
    const userId = req.user.id;
    return this.proyectosService.removeEquipoFromProyecto(userId, removeEquipoDto);
  }
        
}