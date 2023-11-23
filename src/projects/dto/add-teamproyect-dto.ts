import { IsInt, IsString } from 'class-validator';

export class AddTeamProjectDto {
    
  @IsString()
  equipo: string;

  @IsString()
  projectName: string;

}