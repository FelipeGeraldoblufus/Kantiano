import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, getRepository } from 'typeorm';
import { Equipo } from './entities/citas.entity'; // Suponemos que tienes una entidad Equipo
import { CreateTeamDto } from './dto/create-team.dto';
import { User } from 'src/users/entities/user.entity';
import { AddUserTeamDto } from './dto/adduser-team.dto';
import { EditTeamDto } from './dto/edit-team.dto';
import { RemoveUserTeamDto } from './dto/removeUser.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(User) // Inyecta el repositorio de usuarios
    private readonly usuarioRepository: Repository<User>,
  
  ) {}

  async getAllTeams(email: string): Promise<Equipo[]> {
    const equipos = await this.equipoRepository
      .createQueryBuilder('equipo')
      .leftJoin('equipo.creador', 'creador')
      .where('creador.email = :email', { email })
      .getMany();
    return equipos;
  }



async editarEquipo(userEmail: string, editTeamDto: EditTeamDto, equipoId: number): Promise<Equipo> {
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


  async createTeam(creadorId: number, name: string, description: string): Promise<Equipo> {
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
  
  async addMember(userId: number, addUserDto: AddUserTeamDto): Promise<Equipo> {
    const usuario = await this.usuarioRepository.findOne({ where: { id: userId } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const { teamName, email } = addUserDto;

    const team: Equipo = await this.equipoRepository.findOne({
      where: { nombre: teamName },
      relations: ['miembros', 'creador'],
    });

    const user = await this.usuarioRepository.findOne({ where: { email } });

    if (!team || !user) {
      throw new Error('Equipo o usuario no encontrado');
    }

    // Verifica si el creador está definido y si ya está en la lista de miembros
    const creadorEnLista = team?.creador?.id && team.miembros?.some((miembro) => miembro.id === team.creador.id);

    if (!creadorEnLista && team?.creador) {
      // Si el creador no está en la lista y está definido, agrégalo
      team.miembros.push(team.creador);
    }

    // Verifica si el nuevo usuario ya está en la lista de miembros
    const usuarioEnLista = user && team.miembros?.some((miembro) => miembro.id === user.id);

    if (!usuarioEnLista && user) {
      // Si el nuevo usuario no está en la lista y está definido, agrégalo
      team.miembros.push(user);
    }

    return await this.equipoRepository.save(team);
  }
  
  async removeMember(removeUserDto: RemoveUserTeamDto) {


    
    const { teamId, email } = removeUserDto;

    const team = await this.equipoRepository.findOne({
      where: { id: teamId },
      relations: ['miembros'],
    });

    if (!team) {
      throw new NotFoundException('Equipo no encontrado');
    }

    const user = await this.usuarioRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verifica si el usuario está en la lista de miembros
    const usuarioEnListaIndex = user && team.miembros?.findIndex((miembro) => miembro.id === user.id);

    if (usuarioEnListaIndex !== undefined && usuarioEnListaIndex !== -1) {
      // Si el usuario está en la lista, elimínalo
      team.miembros.splice(usuarioEnListaIndex, 1);
      await this.equipoRepository.save(team);
      return { message: 'Usuario removido exitosamente del equipo' };
    } else {
      throw new NotFoundException('Usuario no encontrado en la lista de miembros del equipo');
    }
  }

 
  async deleteTeamByName(name: string): Promise<string> {
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

  


