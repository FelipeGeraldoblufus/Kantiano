import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyecto } from './entities/projects.entity';
import { Repository, getRepository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { plainToClass } from 'class-transformer';
import * as flatted from 'flatted';
import { UpdateProjectDto } from './dto/update-project-dto';

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

  async getAllTeams(email: string) {
    const proyecto = await this.proyectoRepository
      .createQueryBuilder('proyecto')
      .leftJoin('proyecto.creador', 'creador')
      .where('creador.email = :email', { email })
      .getMany();
    return proyecto;
  }


  async createProject(creadorId: number, name: string, description: string): Promise<Proyecto> {
    
    try {
      //console.log("project services create project", creadorId, name, description)
      
      
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
      if (creador.proyectosCreados === undefined) {
        creador.proyectosCreados = [];
      }
      creador.proyectosCreados.push(project);
     

      // Guardar el proyecto y el usuario
      await this.proyectoRepository.save(project);
      await this.usuarioRepository.save(creador);

      return project;
    } catch (error) {
      //console.error(error);
      throw new Error('Error al crear el proyecto');
    }
  }



  async deleteProject(creadorId: number, proyectoId: string): Promise<boolean> {
    // Buscar al usuario creador
    const creador = await this.usuarioRepository.findOne({
      where: { id: creadorId },
      relations: ['proyectosCreados'],
    });

    if (!creador) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Buscar el proyecto a eliminar
    const proyecto = await this.proyectoRepository.findOne({
        where: { nombre: proyectoId },
        relations: ['creador'],
      });


    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    // Verificar que el usuario creador sea el propietario del proyecto
    if (proyecto.creador.id !== creador.id) {
      throw new NotFoundException('No tienes permisos para eliminar este proyecto');
    }

    // Eliminar el proyecto
    await this.proyectoRepository.remove(proyecto);

    // Eliminar el proyecto de la lista de proyectos del usuario
    creador.proyectosCreados = creador.proyectosCreados.filter(p => p.nombre !== proyecto.nombre);
    await this.usuarioRepository.save(creador);

    return true;
  }


  async updateProject(creadorId: number, proyectoData: UpdateProjectDto, projectId: number): Promise<boolean> {
    const creador = await this.usuarioRepository.findOne({
      where: { id: creadorId },
      relations: ['proyectosCreados'],
    });
  
    if (!creador) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: projectId },
      relations: ['creador'],
    });
  
    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }
  
    // Verificar que el usuario creador sea el propietario del proyecto
    if (proyecto.creador.id !== creador.id) {
      throw new NotFoundException('No tienes permisos para editar este proyecto');
    }
  
    // Actualizar los datos del proyecto
    proyecto.nombre = proyectoData.name;
    proyecto.descripcion = proyectoData.descripcion;
  
    await this.proyectoRepository.save(proyecto);
  
    return true;
  }
  


  
}