import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { Secretaria } from './entities/secre.entity';
import { SecretariaService } from './secre.service';
import { CreateSecreDto } from 'src/secretaria/dto/create-secre.dto';

@Controller('secretarias')
export class SecretariaController {
  constructor(private readonly secretariaService: SecretariaService) {}

  @Post()
  create(@Body() createsecreDto: CreateSecreDto) {
    return this.
    secretariaService.create(createsecreDto);
  }


  @Get()
  findAll(): Promise<Secretaria[]> {
    return this.secretariaService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') userId: number) {
    const user = await this.secretariaService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }
}