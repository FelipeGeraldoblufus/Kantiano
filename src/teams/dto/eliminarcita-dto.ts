import { IsDateString, IsString, IsEmail } from 'class-validator';

export class EliminarCitaDto {
    @IsDateString()
    fecha: string;

    @IsString()
    hora: string;

    @IsEmail()
    pacienteEmail: string;

    @IsEmail()
    profesionalEmail: string;
}