// edit-team.dto.ts

import { IsString, MinLength } from 'class-validator';

export class EditTeamDto {
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsString()
  descripcion: string;
}