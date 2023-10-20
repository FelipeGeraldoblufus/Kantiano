import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsService } from './teams.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}
  
    @Get()
    @UseGuards(AuthGuard)
    async getAllTeams(@Request() req) {
      // Obtén el email del usuario desde el token
      const userEmail = req.user.email;

      // Llama al servicio de equipos para obtener los equipos asociados con el email del usuario
      const equipos = await this.teamsService.getAllTeams(userEmail);

      return equipos;
    }
        
    /*@Post("crearteam")
    createTeam(@Body() createTeamDto: CreateTeamDto) {
      return this.teamsService.createTeam(createTeamDto);
    }*/

    // En tu teams.controller.ts
   
    @Post("crearTeam")
    @UseGuards(AuthGuard)
    async createEquipo(@Request() req, @Body() createTeamDto: CreateTeamDto) {
        const userId = req.user.id;
        const { name, descripcion } = createTeamDto;
        const equipo = await this.teamsService.createTeam(userId, name, descripcion);
        return equipo;
    }
    /*
    @Delete('equipos/:equipoId/eliminar')
    async eliminarEquipo(
      @Request() req,
      @Param('equipoId') equipoId: number,
    ) {
      const usuarioId = req.user.id; // Obtén el ID del usuario logeado desde el token
      await this.teamsService.eliminarEquipoDeUsuario(usuarioId, equipoId);
      return { message: 'Equipo eliminado del usuario' };
    }*/
}