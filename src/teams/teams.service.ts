import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonEvents, Repository, getConnection, getRepository } from 'typeorm';
import { Cita } from './entities/citas.entity'; // Suponemos que tienes una entidad Equipo
import { CreateTeamDto } from './dto/create-team.dto';
import { User } from 'src/users/entities/user.entity';
import { AddUserTeamDto } from './dto/adduser-team.dto';
import { EditTeamDto } from './dto/edit-team.dto';
import { RemoveUserTeamDto } from './dto/removeUser.dto';
import { Profesional } from 'src/profesional/entities/medic.entity';
import { DiaNoDisponible } from 'src/Daysnot/entities/day.entity';
import { HorarioTrabajo } from 'src/comment/entities/horario.entity'; 
import { AgendarCitaDto } from './dto/agendar-cita.dto';
import { BuscarHorariosDisponiblesDto } from './dto/buscar-horarios-disponibles.dto';
import { BuscarDisponibilidadDto } from './dto/buscar-disponibilidad.dto';
import { ActualizarEstadoCitaDto } from './dto/actualizar-E.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    @InjectRepository(User) // Inyecta el repositorio de usuarios
    private readonly usuarioRepository: Repository<User>,
    @InjectRepository(Profesional)
    private readonly profesionalRepository: Repository<Profesional>,
    @InjectRepository(HorarioTrabajo)
    private readonly horarioRepository: Repository<HorarioTrabajo>,
    @InjectRepository(DiaNoDisponible)
    private readonly diaNoDisponibleRepository: Repository<DiaNoDisponible>,
  
  ) {}

  async getAllCitas(email: string):  Promise<Cita[]> {
    
    const user = await this.usuarioRepository
        .createQueryBuilder('user')
      .leftJoinAndSelect('user.citas', 'cita')
      .leftJoinAndSelect('cita.profesional', 'profesional')
      .where('user.email = :email', { email })
      .getOne();
      if (user) {
        return user.citas; // Retorna solo la propiedad 'citas' del usuario
      } else {
        return []; // Si el usuario no tiene citas, retornamos un array vacío
      }
  }


  async getAllCitasP(email: string): Promise<Cita[]> {
    const profesional = await this.profesionalRepository
      .createQueryBuilder('profesional')
      .leftJoinAndSelect('profesional.citas', 'cita')
      .where('profesional.email = :email', { email })
      .getOne();

    if (profesional && profesional.citas) {
      return profesional.citas; // Retorna solo la propiedad 'citas' del profesional
    } else {
      throw new NotFoundException('No se encontraron citas para este profesional');
    }
  }

  async getCitasPendiente(email: string): Promise<Cita[]> {
    const citas = await this.citaRepository
      .createQueryBuilder('cita')
      .leftJoinAndSelect('cita.profesional', 'profesional')
      .where('profesional.email = :email', { email })
      .andWhere('cita.estado = :estado', { estado: 'Pendiente' })
      .getMany();

    if (citas.length > 0) {
      return citas;
    } else {
      throw new NotFoundException('No se encontraron citas finalizadas para este profesional');
    }
  }

  async getCitasPendienteUsuario(email: string): Promise<Cita[]> {
    const citas = await this.citaRepository
      .createQueryBuilder('cita')
      .leftJoinAndSelect('cita.paciente', 'user')
      .where('user.email = :email', { email })
      .andWhere('cita.estado = :estado', { estado: 'Pendiente' })
      .getMany();

    if (citas.length > 0) {
      return citas;
    } else {
      throw new NotFoundException('No se encontraron citas finalizadas para este paciente');
    }
  }

  async actualizarEstadoCita(id: number, actualizarEstadoCitaDto: ActualizarEstadoCitaDto): Promise<Cita> {
    const { estado } = actualizarEstadoCitaDto;

    const cita = await this.citaRepository.findOne({ where: { id }, relations: ['profesional'] });

    if (!cita) {
        throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }
// Actualizar el estado de la cita
    cita.estado = estado;

    // Guardar los cambios en la base de datos
    return await this.citaRepository.save(cita);
    } catch (error) {
    // Manejar cualquier error que pueda ocurrir durante la búsqueda o actualización
    throw new Error(`Error al actualizar la cita: ${error.message}`);
  }

  

  async findAll(): Promise<Cita[]> {
    return this.citaRepository.find({ relations: ['paciente', 'profesional'] });
  }

  async buscarHorariosDisponibles(buscarHorariosDisponiblesDto: BuscarHorariosDisponiblesDto): Promise<any> {
    const { especialidad, horarioPreferido, fechaSeleccionada } = buscarHorariosDisponiblesDto;

    try {
        console.log(`Buscando horarios disponibles para especialidad: ${especialidad}, horarioPreferido: ${horarioPreferido}, fechaSeleccionada: ${fechaSeleccionada}`);

        const profesionales = await this.profesionalRepository.find({ where: { especialidad } });
        console.log('Profesionales encontrados:', profesionales);

        if (profesionales.length === 0) {
            throw new NotFoundException(`No se encontraron profesionales con la especialidad ${especialidad}`);
        }

        const horarios = await this.horarioRepository.find({
          where: [
              ...profesionales.map(profesional => ({
                  profesional,
                  fecha: fechaSeleccionada,
              })),
          ],
          relations: ['profesional'], // Cargar la relación profesional
      });
        console.log('Horarios de trabajo encontrados:', horarios);

        const diasNoDisponibles = await this.diaNoDisponibleRepository.find({
            where: [
                ...profesionales.map(profesional => ({
                    profesional,
                    fecha: fechaSeleccionada,
                })),
            ],
        });
        console.log('Días no disponibles encontrados:', diasNoDisponibles);

        const citas = await this.citaRepository.find({
            where: { fecha: fechaSeleccionada },
            relations: ['profesional']
        });
        console.log('Citas encontradas:', citas);

        const horariosDisponibles = horarios.filter(horario => {
            const diaNoDisponible = diasNoDisponibles.find(dia => dia.profesional.id === horario.profesional.id);
            const citaExistente = citas.find(cita => cita.hora === horario.horaInicio && cita.profesional.id === horario.profesional.id);

            const esMañana = horarioPreferido === 'mañana' && horario.horaInicio >= '09:00' && horario.horaInicio < '12:00';
            const esTarde = horarioPreferido === 'tarde' && horario.horaInicio >= '13:00' && horario.horaInicio < '17:00';

            console.log(`Horario: ${horario.horaInicio} - Profesional: ${horario.profesional ? horario.profesional.nombre : 'N/A'}`);
            
            return !diaNoDisponible && !citaExistente && (esMañana || esTarde);
        }).map(horario => ({
            hora: horario.horaInicio,
            doctor: horario.profesional ? `${horario.profesional.nombre} ${horario.profesional.apellido}` : 'Profesional no disponible',
            email: horario.profesional ? `${horario.profesional.email}` : 'Email no disponible'
        }));

        console.log('Horarios disponibles:', horariosDisponibles);

        return {
            fechaSeleccionada,
            horariosDisponibles,
        };
    } catch (error) {
        console.error('Error al buscar horarios disponibles:', error);
        throw new InternalServerErrorException('Error al buscar horarios disponibles');
    }
}



  async buscarDisponibilidad(buscarDisponibilidadDto: BuscarDisponibilidadDto): Promise<any> {
    const { especialidad, horarioPreferido } = buscarDisponibilidadDto;

    // Buscar todos los profesionales que tienen la especialidad especificada
    const profesionales = await this.profesionalRepository.find({ where: { especialidad } });

    if (profesionales.length === 0) {
        throw new NotFoundException(`No se encontraron profesionales con la especialidad ${especialidad}`);
    }

    // Obtener los horarios de trabajo de los profesionales y días no disponibles
    const horariosTrabajo = await this.horarioRepository.find({
        where: profesionales.map(profesional => ({ profesional })),
    });

    const diasNoDisponibles = await this.diaNoDisponibleRepository.find({
        where: profesionales.map(profesional => ({ profesional })),
    });

    const citas = await this.citaRepository.find();

    // Utilizar un conjunto para almacenar fechas únicas disponibles
    const fechasDisponiblesSet = new Set<string>();

    // Iterar sobre los horarios de trabajo y filtrar por horario preferido
    horariosTrabajo.forEach(horario => {
        const diaNoDisponible = diasNoDisponibles.find(dia => dia.fecha === horario.fecha && dia.profesional.id === horario.profesional.id);
        const citaExistente = citas.find(cita => cita.fecha === horario.fecha && cita.hora === horario.horaInicio && cita.profesional.id === horario.profesional.id);

        // Filtrar por horario preferido
        const esMañana = horarioPreferido === 'mañana' && horario.horaInicio >= '09:00' && horario.horaInicio < '12:00';
        const esTarde = horarioPreferido === 'tarde' && horario.horaInicio >= '13:00' && horario.horaInicio < '17:00';

        if (!diaNoDisponible && !citaExistente && (esMañana || esTarde)) {
            fechasDisponiblesSet.add(horario.fecha);
        }
    });

    // Convertir el conjunto a un array y devolverlo como resultado
    const fechasDisponibles = Array.from(fechasDisponiblesSet);

    return { fechasDisponibles };
}
  
async agendarCita(agendarCitaDto: AgendarCitaDto): Promise<Cita> {
  const { fecha, hora, tipoReserva, estado, pacienteEmail, profesionalEmail } = agendarCitaDto;

  const paciente = await this.usuarioRepository.findOne({ where: { email: pacienteEmail } });
  if (!paciente) {
      throw new NotFoundException(`Paciente con email ${pacienteEmail} no encontrado`);
  }

  const profesional = await this.profesionalRepository.findOne({ where: { email: profesionalEmail } });
  if (!profesional) {
      throw new NotFoundException(`Profesional con email ${profesionalEmail} no encontrado`);
  }

  const citaExistente = await this.citaRepository.findOne({ where: { fecha, hora, profesional } });
  if (citaExistente) {
      throw new ConflictException(`El horario ${hora} del ${fecha} ya está reservado para el profesional ${profesional.nombre} ${profesional.apellido}`);
  }

  const diaNoDisponible = await this.diaNoDisponibleRepository.findOne({ where: { fecha, profesional } });
  if (diaNoDisponible) {
      throw new ConflictException(`El profesional ${profesional.nombre} ${profesional.apellido} no está disponible el ${fecha}`);
  }

  const nuevoHorarioTrabajo = await this.horarioRepository.findOne({
      where: { fecha, horaInicio: hora, profesional }
  });
  if (!nuevoHorarioTrabajo) {
      throw new ConflictException(`El profesional ${profesional.nombre} ${profesional.apellido} no tiene un horario de trabajo definido para el ${fecha} a las ${hora}`);
  }

  const cita = new Cita();
  cita.fecha = fecha;
  cita.hora = hora;
  cita.tipoReserva = tipoReserva;
  cita.estado = estado;
  cita.paciente = paciente;
  cita.profesional = profesional;

  return this.citaRepository.save(cita);
}


  


 
  
}

  


