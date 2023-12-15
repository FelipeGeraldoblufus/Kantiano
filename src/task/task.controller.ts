// tarea.controller.ts
import { Controller, Post, Body, Param, Get, Query, Delete, Request, UseGuards, NotFoundException, Patch, ForbiddenException } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task-dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}



  @Post('createtask')
  @UseGuards(AuthGuard)
  async create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    const userId = req.user.id;
    
    try{
      return this.taskService.createTask(userId, createTaskDto);
    }
    catch (error) {
    throw new NotFoundException(`No se pudo crear la tarea`);
  }
  }

  @Get(':id')
  async getTaskById(@Param('id') taskId: number): Promise<Task> {
    try {
    return this.taskService.getTaskById(taskId);
    }catch (error) {
      throw new NotFoundException(`No se pudieron obtener las tareas con ID ${taskId}`);
    }
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

  @Delete(':id')
  async deleteTask(@Param('id') taskId: number): Promise<void> {
    try {
      await this.taskService.deleteTask(taskId);
    } catch (error) {
      throw new NotFoundException(`No se pudo eliminar la tarea con ID ${taskId}`);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async editTask(
    @Request() req,
    @Param('id') taskId: number,
    @Body() editTaskDto: EditTaskDto,
  ): Promise<Task> {
    try {
      const userId = req.user.id; 
      const editedTask = await this.taskService.editTask(userId, taskId, editTaskDto);
      return editedTask;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error; // Reenvía las excepciones específicas
      } else {
        throw new NotFoundException(`No se pudo editar la tarea con ID ${taskId}`);
      }
    }
  }

  

 
}