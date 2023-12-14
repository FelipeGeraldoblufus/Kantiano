// tarea.controller.ts
import { Controller, Post, Body, Param, Get, Query, Delete, Request, UseGuards, NotFoundException } from '@nestjs/common';
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

  @Get(':id')
  async getTaskById(@Param('id') taskId: number): Promise<Task> {
    // Llama al servicio para obtener la tarea por ID
    return this.taskService.getTaskById(taskId);
  }
  @Get('proyecto/:id')
  async getAllTasksByProjectId(@Param('id') projectId: number): Promise<Task[]> {
    try {
      const tasks = await this.taskService.getAllTasksByProjectId(projectId);
      return tasks;
    } catch (error) {
      throw new NotFoundException(`No se pudieron obtener las tareas para el proyecto con ID ${projectId}`);
    }
  }

  

 
}