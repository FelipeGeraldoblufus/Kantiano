// tarea.controller.ts
import { Controller, Post, Body, Param, Get, Query, Delete, Request, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('createtask')
  @UseGuards(AuthGuard)
  async create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    const userId = req.user.id;
    return this.taskService.createTask(userId, createTaskDto);
  }

  // Implementa otras rutas y operaciones CRUD para las tareas
}