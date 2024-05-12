import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secretaria } from './entities/secre.entity';
import { SecretariaController } from './secre.controller';
import { SecretariaService } from './secre.service';

@Module({
  imports: [TypeOrmModule.forFeature([Secretaria])],
  controllers: [SecretariaController],
  providers: [SecretariaService],
})
export class SecretariaModule {}