import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyecto } from './entities/projects.entity';
import { Repository, getRepository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { plainToClass } from 'class-transformer';
import * as flatted from 'flatted';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(User) // Inyecta el repositorio de usuarios
    private readonly usuarioRepository: Repository<User>,
  
    
  ) {}

  async findAll(): Promise<Proyecto[]> {
    return this.proyectoRepository.find();
  }

 

  async createProject(creadorId: number, name: string, description: string): Promise<Proyecto> {
    try {
      const creador = await this.usuarioRepository.findOne({
        where: { id: creadorId },
        relations: ['proyectosCreados'],
      });

      if (!creador) {
        throw new Error('Usuario no encontrado');
      }

      const project = this.proyectoRepository.create({
        creador: creador,
        nombre: name,
        descripcion: description,
      });

      // Agregar el proyecto a la lista de proyectos del usuario
      creador.proyectosCreados = creador.proyectosCreados || [];
      creador.proyectosCreados.push(project);

      // Guardar el proyecto y el usuario
      await this.proyectoRepository.save(project);
      await this.usuarioRepository.save(creador);

      return project;
    } catch (error) {
      console.error(error);
      throw new Error('Error al crear el proyecto');
    }
  }
}