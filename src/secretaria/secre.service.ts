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