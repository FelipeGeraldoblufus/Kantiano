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

  @Get(':nombre')
  @UseGuards(AuthGuard)
  async findByNombre(@Param('nombre') nombre: string, @Request() req): Promise<Proyecto | undefined> {
    // Obtén el usuario autenticado desde el token
    const usuario= req.user.email;

    try{
      // Llama al servicio de proyectos para obtener el proyecto asociado al usuario autenticado y con el nombre dado
    const proyectoEncontrado = await this.proyectosService.findByNombreYUsuario(nombre, usuario);

    if (!proyectoEncontrado) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return proyectoEncontrado;

    }catch (error) {
      throw new NotFoundException(`No se pudieron obtener el proyecto`);
    }
  }

  
  @Post('crearProyecto')
  @UseGuards(AuthGuard)
  async create(@Request() req, @Body() proyectoData: CreateProjectDto) {
    const userId = req.user.id;
    console.log("controlador",userId)
    const { name, descripcion } = proyectoData;
    try{
      const proyecto = await this.proyectosService.createProject(userId, name, descripcion);
      return proyecto;
    }catch (error) {
      throw new NotFoundException(`No se pudo crear el proyecto`);
    }
  }
  @Delete(':name')
  @UseGuards(AuthGuard)
  async delete(@Request() req, @Param('name') proyectoId: string) {
    const userId = req.user.id;
    try{
    const result = await this.proyectosService.deleteProject(userId, proyectoId);
    return { success: result };
    }catch (error) {
      throw new NotFoundException(`No se pudo eliminar el proyecto`);
    }
  }

  @Patch('editproject/:projectId')
  @UseGuards(AuthGuard)
  async update(@Request() req, @Param('projectId', ParseIntPipe) projectId: number, @Body() proyectoData: UpdateProjectDto) {
    const userId = req.user.id;
    try{
    const result = await this.proyectosService.updateProject(userId, proyectoData, projectId);
    return { success: result };
    }catch (error) {
      throw new NotFoundException(`No se pudo editar el proyecto`);
    }
  }

  @Post('addequipos')
  @UseGuards(AuthGuard)
  async addEquipoToProyecto(
    @Request() req,
    @Body() addEquipoDto: AddTeamProjectDto,
  ){
    const userId = req.user.id;
    try{
      return this.proyectosService.addEquipoToProyecto(userId, addEquipoDto);
    }catch (error) {
      throw new NotFoundException(`No se pudieron añadir equipos al proyecto`);
    }

  }

  @Delete('removeequipo')
  @UseGuards(AuthGuard)
  async removeEquipoFromProyecto(
    @Request() req,
    @Body() removeEquipoDto: RemoveTeamProjectDto,
  ) {
    const userId = req.user.id;
    try{
      return this.proyectosService.removeEquipoFromProyecto(userId, removeEquipoDto);

    }catch (error) {
      throw new NotFoundException(`No se pudieron eliminar equipos del proyecto`);
    }
  }
        
}