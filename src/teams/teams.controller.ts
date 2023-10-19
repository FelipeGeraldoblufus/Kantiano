import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsService } from './teams.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}
  
    @Get("team")
    getAllTeams() {
      return this.teamsService.getAllTeams();
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
}