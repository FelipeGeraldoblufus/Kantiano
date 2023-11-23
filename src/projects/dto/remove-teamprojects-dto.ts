import { IsString } from 'class-validator';

export class RemoveTeamProjectDto {
  @IsString()
  equipo: string;

  @IsString()
  projectName: string;
}