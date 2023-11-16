import { IsString, IsEmail, IsNumber } from 'class-validator';

export class RemoveUserTeamDto {
    
  @IsNumber()
  teamId: number;

  @IsEmail()
  email: string;
}