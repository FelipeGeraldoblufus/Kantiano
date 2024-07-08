import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { Profesional } from './entities/medic.entity';
import { ProfesionalService } from './prof.service';
import { CreateProfDto } from './dto/create-prof.dto';

@Controller('profesionales')
export class ProfesionalController {
  constructor(private readonly profesionalService: ProfesionalService) {}

  @Get()
  findAll(): Promise<Profesional[]> {
    return this.profesionalService.findAll();
  }

  @Post()
  create(@Body() createprofDto: CreateProfDto) {
    return this.
    profesionalService.create(createprofDto);
  }

  @Get(':id')
  async getUserById(@Param('id') userId: number) {
    const user = await this.profesionalService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }
}
