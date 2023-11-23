// tarea.controller.ts
import { Controller, Post, Body, Param, Get, Query, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';

@Controller('tareas')
export class TaskController {
  constructor(private readonly tareaService: TaskService) {}

  

  // Implementa otras rutas y operaciones CRUD para las tareas
}