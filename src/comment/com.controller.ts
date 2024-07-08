import { Controller, Post, Body, Param, Get, Query, Delete, Request, UseGuards, UnauthorizedException, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './com.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateHorarioTrabajoDto } from './dto/Create-com-dto';
import { User } from 'src/users/entities/user.entity';
import { ProfesionalService } from 'src/profesional/prof.service';
import { GetHorariosTrabajoDto } from './dto/getHorarios-dto';
import { HorarioTrabajo } from './entities/horario.entity';
import { EliminarHorarioDto } from './dto/eliminarHorario-dto';

@Controller('com')
export class ComController {
  constructor(private readonly horarioTrabajoService: CommentService,
    private readonly profesionalService: ProfesionalService
  ) {}

  @Post()
  async create(@Body() createHorarioTrabajoDto: CreateHorarioTrabajoDto) {
    // Lógica para encontrar al profesional por su email
    const profesional = await this.profesionalService.findOneByEmail(createHorarioTrabajoDto.emailDoctor);

    if (!profesional) {
      throw new NotFoundException(`No se encontró al profesional con email ${createHorarioTrabajoDto.emailDoctor}`);
    }
    return this.horarioTrabajoService.create(createHorarioTrabajoDto);
  }
  @Get()
  async getHorariosTrabajo(@Body() getHorariosTrabajoDto: GetHorariosTrabajoDto): Promise<HorarioTrabajo[]> {
    return this.horarioTrabajoService.getHorariosTrabajo(getHorariosTrabajoDto);
  }

  @Delete()
  async eliminarHorario(@Body() eliminarHorarioDto: EliminarHorarioDto): Promise<void> {
    const { emailDoctor, horarioId } = eliminarHorarioDto;
    return this.horarioTrabajoService.eliminarHorario(emailDoctor, horarioId);
  }
}


/*
  @Post('crearComentario')
  @UseGuards(AuthGuard)
  async createComment(@Body() createComDto: CreateComDto, @Request() req) {
    // Obtener el usuario autenticado desde el token
    const userId = req.user.id;

    // Llamar al servicio de comentarios para crear el comentario
    return this.commentService.createComment(createComDto, userId);
  }
  */
