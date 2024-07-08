import { IsDate, IsString, IsEmail, IsDateString } from 'class-validator';

export class AgendarCitaDto {
    @IsDateString()
    fecha: string;

    @IsString()
    hora: string;

    @IsString()
    tipoReserva: string;

    @IsString()
    estado: string;

    @IsEmail()
    pacienteEmail: string;

    @IsEmail()
    profesionalEmail: string;
}