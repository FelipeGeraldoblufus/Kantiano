import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsService } from './teams.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AddUserTeamDto } from './dto/adduser-team.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cita } from './entities/citas.entity';
import { EditTeamDto } from './dto/edit-team.dto';
import { RemoveUserTeamDto } from './dto/removeUser.dto';
import { AgendarCitaDto } from './dto/agendar-cita.dto';
import { SecretariaService } from 'src/secretaria/secre.service';
import { User } from 'src/users/entities/user.entity';
import { BuscarDisponibilidadDto } from './dto/buscar-disponibilidad.dto';
import { BuscarHorariosDisponiblesDto } from './dto/buscar-horarios-disponibles.dto';
import { ActualizarEstadoCitaDto } from './dto/actualizar-E.dto';
import { EliminarCitaDto } from './dto/eliminarcita-dto';

@Controller('citas')
export class TeamsController {
    constructor(
    @InjectRepository(Cita)
    private equipoRepository: Repository<Cita>,
    private readonly teamsService: TeamsService,
) {}

@Post('buscarD')
  async buscarDisponibilidad(@Body() buscarDisponibilidadDto: BuscarDisponibilidadDto) {
    return this.teamsService.buscarDisponibilidad(buscarDisponibilidadDto);
  }

@Post('buscarH')
async buscarHorariosDisponibles(@Body() buscarHorariosDisponiblesDto: BuscarHorariosDisponiblesDto) {
  return this.teamsService.buscarHorariosDisponibles(buscarHorariosDisponiblesDto);
}

@Post('agendar')
    agendarCita(@Body() agendarCitaDto: AgendarCitaDto) {
        return this.teamsService.agendarCita(agendarCitaDto);
}
@Delete('eliminar')
  async eliminarCita(@Body() eliminarCitaDto: EliminarCitaDto) {
    await this.teamsService.eliminarCita(eliminarCitaDto);
  }


@Get('todas')
@UseGuards(AuthGuard)
async getAllCitas(@Request() req): Promise<Cita[]> {
    try {
        // Obtén el email del usuario desde el token
        const userEmail = req.user.email;

        // Llama al servicio para obtener todas las citas asociadas con el email del usuario
        const citas = await this.teamsService.getAllCitas(userEmail);
        
        return citas;
    } catch (error) {
        throw new NotFoundException('No se pudieron obtener las citas');
    }
}

@Get('pendientesU')
@UseGuards(AuthGuard)
async getAllCitasPendientesU(@Request() req): Promise<Cita[]> {
    try {
        // Obtén el email del usuario desde el token
        const userEmail = req.user.email;

        // Llama al servicio para obtener todas las citas asociadas con el email del usuario
        const citas = await this.teamsService.getCitasPendienteUsuario(userEmail);
        
        return citas;
    } catch (error) {
        throw new NotFoundException('No se pudieron obtener las citas');
    }
}

@Put(':id/estado')
  async actualizarEstadoCita(
    @Param('id') id: number,
    @Body() actualizarEstadoCitaDto: ActualizarEstadoCitaDto,
  ): Promise<Cita> {
    try {
      return await this.teamsService.actualizarEstadoCita(id, actualizarEstadoCitaDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }


@Get('todasP')
  @UseGuards(AuthGuard)
  async getAllCitasP(@Request() req): Promise<Cita[]> {
    try {
      // Obtén el email del usuario desde el token
      const userEmail = req.user.email;

      // Llama al servicio para obtener todas las citas asociadas con el email del usuario
      const citas = await this.teamsService.getAllCitasP(userEmail);
      
      return citas;
    } catch (error) {
      throw new NotFoundException('No se pudieron obtener las citas');
    }
  }

  @Get('pendientes')
  @UseGuards(AuthGuard)
  async getAllCitasPendiente(@Request() req): Promise<Cita[]> {
    try {
      // Obtén el email del usuario desde el token
      const userEmail = req.user.email;

      // Llama al servicio para obtener todas las citas asociadas con el email del usuario
      const citas = await this.teamsService.getCitasPendiente(userEmail);
      
      return citas;
    } catch (error) {
      throw new NotFoundException('No se pudieron obtener las citas');
    }
  }


  
    /*@Post('agendar')
    @UseGuards(AuthGuard)
    async agendarCita(@Body() agendarCitaDto: AgendarCitaDto): Promise<Cita> {
        try {
            // Llamar al servicio para agendar la cita
            const nuevaCita = await this.teamsService.agendarCita(agendarCitaDto);

            return nuevaCita;
        } catch (error) {
            throw new NotFoundException('No se pudo agendar la cita');
        }
    }*/
       

    

    /*@Post("crearTeam")
    @UseGuards(AuthGuard)
    async createEquipo(@Request() req, @Body() createTeamDto: CreateTeamDto): Promise<Cita> {
        const userId = req.user.id;
        const { name, descripcion } = createTeamDto;   
        try{
          const equipo = await this.teamsService.createTeam(userId, name, descripcion);
          return equipo;
        }
        catch (error) {
          throw new NotFoundException(`No se pudo crear el equipo`);
        }
    }
    @Delete(':name')
    deleteTeamByName(@Param('name') name: string): Promise<string> {
      return this.teamsService.deleteTeamByName(name);
    }*/
  /*
  
    
    @Get(':id/miembros')
    async getMiembrosDeEquipo(@Param('id') id: number) {
      
      try{
        const equipo = await this.equipoRepository.createQueryBuilder('equipo')
      .leftJoinAndSelect('equipo.miembros', 'miembros')
      .where('equipo.id = :id', { id })
      .getOne();

      if (!equipo) {
        throw new NotFoundException('Equipo no encontrado');
      }

      return equipo.profesional;
        
      }
      catch (error) {
      throw new NotFoundException(`No se pudo obtener al equipo`);
    }
    }
    


    @Patch('editarteam/:equipoId')
    @UseGuards(AuthGuard)
    editarPerfil(@Request() req, @Body() editTeamDto: EditTeamDto, @Param('equipoId', ParseIntPipe) equipoId: number): Promise<Cita> {
      const userEmail = req.user.email; // Obtén el email del usuario autenticado desde el token
      console.log('Usuario autenticado:', req.user.email);
      
      try{
        // Llama a la función de edición del servicio
      const equipoActualizado = this.teamsService.editarEquipo(userEmail, editTeamDto, equipoId);

      return equipoActualizado;

      }
      catch (error) {
        throw new NotFoundException(`No se pudo editar el equipo`);
      }
      
    }



    
    @Post('addMember')
    @UseGuards(AuthGuard)
    async addMember(@Request() req, @Body() addUserDto: AddUserTeamDto): Promise<Cita> {
    const userId = req.user.id;
    try{
      return await this.teamsService.addMember(userId, addUserDto);
    }
    catch (error) {
      throw new NotFoundException(`No se pudo añadir un miembro al equipo`);
    }
    }

    @Post('removemember')
    @UseGuards(AuthGuard)
    async removeMember(@Body() removeUserDto: RemoveUserTeamDto) {
      try{
        return this.teamsService.removeMember(removeUserDto);
      }
      catch (error) {
        throw new NotFoundException(`No se pudo remover un miembro al equipo`);
      }
    }
*/
  }
