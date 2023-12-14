import { Controller, Post, Body, Param, Get, Query, Delete, Request, UseGuards } from '@nestjs/common';
import { CommentService } from './com.service';
import { Comentario } from './entities/com.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateComDto } from './dto/Create-com-dto';
import { User } from 'src/users/entities/user.entity';

@Controller('com')
export class ComController {
  constructor(private readonly commentService: CommentService) {}

  @Post('crearComentario')
  @UseGuards(AuthGuard)
  async createComment(@Body() createComDto: CreateComDto, @Request() req): Promise<Comentario> {
    // Obtener el usuario autenticado desde el token
    const userId = req.user.id;

    // Llamar al servicio de comentarios para crear el comentario
    return this.commentService.createComment(createComDto, userId);
  }
}

  // Implementa otras rutas y operaciones CRUD para las tareas
