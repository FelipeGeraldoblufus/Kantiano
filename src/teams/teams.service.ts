import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, getRepository } from 'typeorm';
import { Equipo } from './entities/team.entity'; // Suponemos que tienes una entidad Equipo
import { CreateTeamDto } from './dto/create-team.dto';
import { User } from 'src/users/entities/user.entity';
import { AddUserTeamDto } from './dto/adduser-team.dto';
import { EditTeamDto } from './dto/edit-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(User) // Inyecta el repositorio de usuarios
    private readonly usuarioRepository: Repository<User>,
  
  ) {}

  async getAllTeams(email: string) {
    const equipos = await this.equipoRepository
      .createQueryBuilder('equipo')
      .leftJoin('equipo.creador', 'creador')
      .where('creador.email = :email', { email })
      .getMany();
    return equipos;
  }


 /* async createTeam(createTeamDto: CreateTeamDto, creadorId: number) {
    const { name, descripcion } = createTeamDto;
    const equipo = this.equipoRepository.create({ creador: { id: creadorId }, nombre: name, descripcion: descripcion });
    return this.equipoRepository.save(equipo);
}*/

async editarEquipo(userEmail: string, editTeamDto: EditTeamDto, equipoId: number) {
  try {
    // Busca al usuario por su correo electrónico
    const usuario = await this.usuarioRepository.findOne({ where: { email: userEmail } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verifica que el equipo exista
    const equipo = await this.equipoRepository.findOne({ where: { id: equipoId } });

    if (!equipo) {
      throw new NotFoundException('Equipo no encontrado');
    }

    // Actualiza los campos del equipo con los valores del DTO
    equipo.nombre = editTeamDto.nombre;
    equipo.descripcion = editTeamDto.descripcion;

    // Guarda los cambios en la base de datos
    await this.equipoRepository.save(equipo);

    return equipo;
  } catch (error) {
    throw new BadRequestException('No se pudo actualizar el equipo', error.message);
  }
}


  async createTeam(creadorId: number, name: string, description: string) {
    const creador = await this.usuarioRepository.findOne({
      where: { id: creadorId }, // Busca al usuario por su ID
    });

    if (!creador) {
      throw new Error('Usuario no encontrado'); // Puedes personalizar el mensaje de error
    }

    const equipo = this.equipoRepository.create({
      creador: creador,
      nombre: name,
      descripcion: description,
      miembros: [creador], // Agregar el creador a la lista de miembros
    });

    return this.equipoRepository.save(equipo);
  }
  async addUserToTeamByEmail(userId: number, email: string, equipoId: number) {
    try {
      // Busca al usuario por ID
      const usuario = await this.usuarioRepository.findOne({ where: { id: userId } });

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verifica que el equipo existe
      const equipo = await this.equipoRepository.findOne({ where: { id: equipoId } });

      if (!equipo) {
        throw new NotFoundException('Equipo no encontrado');
      }

      // Verifica que el usuario con el correo electrónico existe
      const usuarioNuevo = await this.usuarioRepository.findOne({ where: { email } });

      if (!usuarioNuevo) {
        throw new NotFoundException('Usuario con este correo electrónico no encontrado');
      }

      // Verifica que equipo y equipo.miembros no sean undefined antes de usar "some"
      if (equipo && equipo.miembros) {
        if (!equipo.miembros.some((miembro) => miembro.id === usuarioNuevo.id)) {
          equipo.miembros.push(usuarioNuevo);
          await this.equipoRepository.save(equipo);
        }
      }
      
      return equipo;
    } catch (error) {
      throw new BadRequestException('No se pudo agregar al usuario al equipo', error.message);
    }
  }
  
  
  
  
  
  

  /*
  async eliminarEquipoDeUsuario(email: string, equipoId: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { email: email } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const equipo = await this.equipoRepository.findOne({ where: { id: equipoId }});
    if (!equipo) {
      throw new NotFoundException('Equipo no encontrado');
    }

    // Asegúrate de que el usuario y el equipo existan antes de continuar
    if (usuario && equipo) {
      // Elimina el usuario del equipo y viceversa
      usuario.equiposCreados = usuario.equiposCreados.filter((e) => e.id !== equipoId);
      equipo.miembros = equipo.miembros.filter((u) => u.email !== email);

      // Guarda los cambios en la base de datos
      await this.usuarioRepository.save(usuario);
      await this.equipoRepository.save(equipo);
    } else {
      throw new NotFoundException('Usuario o equipo no encontrado');
    }
  }*/
  async deleteTeamByName(name: string) {
    const team = await this.equipoRepository.findOne({ where: { nombre: name } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
  
    // Utiliza 'miembros' en lugar de 'Team'
    await this.equipoRepository
      .createQueryBuilder()
      .relation('miembros')
      .of(team)
      .remove(team.miembros);
  
    // Remove the team
    await this.equipoRepository.remove(team);
  
    return `Team "${name}" and its relations have been deleted successfully`;
  }


  findOneByName(nombre: string) {
    return this.equipoRepository.findOneBy({ nombre })
  }
 
  
  
}

  






  /*async createEquipo(creadorId: number, createTeamDto: CreateTeamDto) {
    const { name, descripcion } = createTeamDto;
    const equipo = this.equipoRepository.create({ creador: { id: creadorId }, nombre: name, descripcion });
    return this.equipoRepository.save(equipo);
  }*/

