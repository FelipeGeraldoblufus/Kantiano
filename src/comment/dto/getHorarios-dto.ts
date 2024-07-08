import { IsNotEmpty, IsEmail } from 'class-validator';

export class GetHorariosTrabajoDto {
  @IsNotEmpty()
  @IsEmail()
  emailDoctor: string;
}