import { IsString, MinLength } from 'class-validator';

export class EditCitaDto {
  @IsString()
  estado: string;
}