import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from './entities/team.entity'; // Suponemos que tienes una entidad Equipo
import { CreateTeamDto } from './dto/create-team.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(User) // Inyecta el repositorio de usuarios
    private readonly usuarioRepository: Repository<User>,
  ) {}

  async getAllTeams() {
    return this.equipoRepository.find();
  }

 /* async createTeam(createTeamDto: CreateTeamDto, creadorId: number) {
    const { name, descripcion } = createTeamDto;
    const equipo = this.equipoRepository.create({ creador: { id: creadorId }, nombre: name, descripcion: descripcion });
    return this.equipoRepository.save(equipo);
}*/

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





  /*async createEquipo(creadorId: number, createTeamDto: CreateTeamDto) {
    const { name, descripcion } = createTeamDto;
    const equipo = this.equipoRepository.create({ creador: { id: creadorId }, nombre: name, descripcion });
    return this.equipoRepository.save(equipo);
  }*/
}
