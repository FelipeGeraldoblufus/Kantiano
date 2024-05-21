import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfDto } from './dto/create-prof.dto';
import { Repository } from 'typeorm';
import { Profesional } from './entities/medic.entity';

@Injectable()
export class ProfesionalService {
  constructor(
    @InjectRepository(Profesional)
    private readonly profesionalRepository: Repository<Profesional>,
  ) {}

  async findAll(): Promise<Profesional[]> {
    return await this.profesionalRepository.find();
  }
  create(CreateProfDto: CreateProfDto) {
    return this.profesionalRepository.save(CreateProfDto);
  }

  findOneByEmail(email: string){
    return this.profesionalRepository.findOneBy({ email })
  }

  findOneByPass(password: string){
    return this.profesionalRepository.findOneBy({ password })
  }
  findOneByID(id: number){
    return this.profesionalRepository.findOneBy({ id })
  }

  async updateProfProfile(prof: Profesional) {
    try {
      // Actualiza el perfil del usuario en la base de datos
      await this.profesionalRepository.save(prof);
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error);
      throw new Error('Error al actualizar el perfil del usuario');
    }
  }

  async getUserById(userId: number): Promise<Profesional | undefined> {
    try {
      const user = await this.profesionalRepository.findOne({where: {id: userId }});
      return user;
    } catch (error) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
  async findOne(id: number): Promise<Profesional | undefined> {
    return await this.profesionalRepository.findOne({ where: { id } });
  }
  
}
