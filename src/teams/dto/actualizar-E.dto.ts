import { IsString, IsNotEmpty } from 'class-validator';

export class ActualizarEstadoCitaDto {
    @IsNotEmpty()
    @IsString()
    estado: string;
}