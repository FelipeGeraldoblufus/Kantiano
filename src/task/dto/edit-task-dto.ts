import { IsString, IsOptional } from 'class-validator';

export class EditTaskDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}