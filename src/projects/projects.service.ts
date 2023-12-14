import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyecto } from './entities/projects.entity';
import { Repository, getRepository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { plainToClass } from 'class-transformer';
import * as flatted from 'flatted';
import { UpdateProjectDto } from './dto/update-project-dto';
import { Equipo } from 'src/teams/entities/team.entity';
import { AddTeamProjectDto } from './dto/add-teamproyect-dto';
import { RemoveTeamProjectDto } from './dto/remove-teamprojects-dto';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(User) // Inyecta el repositorio de usuarios
    private readonly usuarioRepository: Repository<User>,
    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,
    
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

  async findByNombreYUsuario(nombre: string, usuarioemail: string): Promise<Proyecto | undefined> {
    return this.proyectoRepository.findOne({
      where: { nombre, creador: { email: usuarioemail } },
      relations: ['creador', 'equipos', 'tareas'],
    });
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


  async addEquipoToProyecto(creadorId: number, addEquipoDto: AddTeamProjectDto): Promise<Proyecto> {
    const { equipo, projectName } = addEquipoDto;

    // Buscar el proyecto por el creador y el nombre
    const proyecto = await this.proyectoRepository.findOne({
      where: { creador: { id: creadorId }, nombre: projectName },
      relations: ['creador', 'equipos'],
    });

    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado o no tienes permisos.');
    }

    // Buscar el equipo por el nombre
    let equipoExistente = await this.equipoRepository.findOne({ where: { nombre: equipo } });

    // Si no existe el equipo, créalo
    if (!equipoExistente) {
      throw new NotFoundException('Equipo no encontrado.');
    }

    // Asignar el equipo al proyecto
    proyecto.equipos = proyecto.equipos || [];
    proyecto.equipos.push(equipoExistente);

    // Guardar los cambios en el proyecto
    await this.proyectoRepository.save(proyecto);

    // Devolver el proyecto actualizado
    return proyecto;
  }
  async removeEquipoFromProyecto(creadorId: number, removeEquipoDto: RemoveTeamProjectDto): Promise<Proyecto> {
    const { equipo, projectName } = removeEquipoDto;
    console.log('Entrando a removeEquipoFromProyecto', { creadorId, removeEquipoDto });
    // Buscar el proyecto por el creador y el nombre
    const proyecto = await this.proyectoRepository.findOne({
      where: { creador: { id: creadorId }, nombre: projectName },
      relations: ['creador', 'equipos'],
    });
    console.log('Proyecto encontrado:', proyecto);
    if (!proyecto) {
      throw new NotFoundException('Proyecto "${projectName}" no encontrado o no tienes permisos.');
    }

    // Buscar el equipo por el nombre
    const equipoExistente = await this.equipoRepository.findOne({ where: { nombre: equipo } });

    if (!equipoExistente) {
      throw new NotFoundException('Equipo no encontrado en el proyecto.');
    }

    // Remover el equipo del proyecto
    proyecto.equipos = proyecto.equipos.filter((e) => e.id !== equipoExistente.id);

    // Guardar los cambios en el proyecto
    await this.proyectoRepository.save(proyecto);

    // Devolver el proyecto actualizado
    return proyecto;
  }

  
  


  
}