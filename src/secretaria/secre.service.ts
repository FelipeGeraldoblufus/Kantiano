import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSecreDto } from './dto/create-secre.dto';
import { Repository } from 'typeorm';
import { Secretaria } from './entities/secre.entity';

@Injectable()
export class SecretariaService {
  constructor(
    @InjectRepository(Secretaria)
    private readonly secretariaRepository: Repository<Secretaria>,
  ) {}

  async findAll(): Promise<Secretaria[]> {
    return await this.secretariaRepository.find();
  }

  create(CreateSecreDto: CreateSecreDto) {
    return this.secretariaRepository.save(CreateSecreDto);
  }

  findOneByEmail(email: string){
    return this.secretariaRepository.findOneBy({ email })
  }

  findOneByPass(password: string){
    return this.secretariaRepository.findOneBy({ password })
  }
  findOneByID(id: number){
    return this.secretariaRepository.findOneBy({ id })
  }

  async updateSecreProfile(secre: Secretaria) {
    try {
      // Actualiza el perfil del usuario en la base de datos
      await this.secretariaRepository.save(secre);
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error);
      throw new Error('Error al actualizar el perfil del usuario');
    }
  }

  async getUserById(userId: number): Promise<Secretaria | undefined> {
    try {
      const user = await this.secretariaRepository.findOne({ where: { id: userId } });
      return user;
    } catch (error) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
  
  async findOne(id: number): Promise<Secretaria | undefined> {
    return await this.secretariaRepository.findOne({ where: { id } });
  }
}