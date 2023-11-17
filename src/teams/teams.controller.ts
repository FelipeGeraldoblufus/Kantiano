import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsService } from './teams.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AddUserTeamDto } from './dto/adduser-team.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipo } from './entities/team.entity';
import { EditTeamDto } from './dto/edit-team.dto';
import { RemoveUserTeamDto } from './dto/removeUser.dto';

@Controller('teams')
export class TeamsController {
    constructor(
    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,
    private readonly teamsService: TeamsService,) {}
  
    @Get('equipos')
    @UseGuards(AuthGuard)
    async getAllTeams(@Request() req) {
      // Obtén el email del usuario desde el token
      const userEmail = req.user.email;

      // Llama al servicio de equipos para obtener los equipos asociados con el email del usuario
      const equipos = await this.teamsService.getAllTeams(userEmail);

      return equipos;
    }
    @Get(':id/miembros')
    async getMiembrosDeEquipo(@Param('id') id: number) {
      const equipo = await this.equipoRepository.createQueryBuilder('equipo')
      .leftJoinAndSelect('equipo.miembros', 'miembros')
      .where('equipo.id = :id', { id })
      .getOne();

      if (!equipo) {
        throw new NotFoundException('Equipo no encontrado');
      }

      return equipo.miembros;
    }
        
    /*@Post("crearteam")
    createTeam(@Body() createTeamDto: CreateTeamDto) {
      return this.teamsService.createTeam(createTeamDto);
    }*/

    @Patch('editarteam/:equipoId')
    @UseGuards(AuthGuard)
    editarPerfil(@Request() req, @Body() editTeamDto: EditTeamDto, @Param('equipoId', ParseIntPipe) equipoId: number) {
      const userEmail = req.user.email; // Obtén el email del usuario autenticado desde el token
      console.log('Usuario autenticado:', req.user.email);
      
      // Llama a la función de edición del servicio
      const equipoActualizado = this.teamsService.editarEquipo(userEmail, editTeamDto, equipoId);

      return { message: 'Equipo actualizado exitosamente', equipo: equipoActualizado };
    }

    
   
    @Post("crearTeam")
    @UseGuards(AuthGuard)
    async createEquipo(@Request() req, @Body() createTeamDto: CreateTeamDto) {
        const userId = req.user.id;
        const { name, descripcion } = createTeamDto;
        const equipo = await this.teamsService.createTeam(userId, name, descripcion);
        return equipo;
    }
    @Delete(':name')
    deleteTeamByName(@Param('name') name: string) {
      return this.teamsService.deleteTeamByName(name);
    }


    @Post(':equipoId/members')
    @UseGuards(AuthGuard)
    async addUserToTeam(
      @Request() req,
      @Body() addUserDto: AddUserTeamDto,
      @Param('equipoId') equipoId: number,
    ) {
      const usuario = req.user; // El usuario autenticado

      // Asegúrate de que el DTO tenga el campo "email"
      const email = addUserDto.email;

      // Llama al servicio para agregar al usuario al equipo
      const equipo = await this.teamsService.addUserToTeamByEmail(usuario.id, email, equipoId);

      return equipo;
    }
    
    @Post('addMember')
    @UseGuards(AuthGuard)
    async addMember(@Request() req, @Body() addUserDto: AddUserTeamDto) {
    const userId = req.user.id;
    return await this.teamsService.addMember(userId, addUserDto);
    }

    @Post('removemember')
    @UseGuards(AuthGuard)
    async removeMember(@Body() removeUserDto: RemoveUserTeamDto) {
    return this.teamsService.removeMember(removeUserDto);
    }


}