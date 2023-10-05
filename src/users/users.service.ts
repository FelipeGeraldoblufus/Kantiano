import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ResetPassDto } from 'src/auth/dot/resetPass.dto';
import * as bcryptjs from "bcryptjs";
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class UsersService {
  

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    
    ) {}
  

  savepass(updateUserDto: UpdateUserDto) {
    return this.userRepository.save(updateUserDto);
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  

  findOneByEmail(email: string){
    return this.userRepository.findOneBy({ email })
  }

  findOneByPass(password: string){
    return this.userRepository.findOneBy({ password })
  }
  findOneByID(id: number){
    return this.userRepository.findOneBy({ id })
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async resetPassword(tempPassword: string, resetPassDto: ResetPassDto): Promise<void> {
    const { newpassword } = resetPassDto;

    // Busca al usuario por su contraseña temporal en lugar del ID
    const user = await this.userRepository.findOneBy({ password: tempPassword });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Actualiza el campo de contraseña con la nueva contraseña sin encriptar
    user.password = newpassword;
    await this.userRepository.save(user);
  }


  async updatePassword(id: number, newPassword: string): Promise<{ message: string }>  {
    // Busca al usuario por su ID
    const user = await this.userRepository.findOneBy({id});
  
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    // Actualiza el campo de contraseña con la nueva contraseña
    user.password = newPassword;
    
    // Guarda los cambios en la base de datos
    await this.userRepository.save(user);
    // Envía el correo electrónico después de actualizar la contraseña
    await this.mailerService.sendEmail(id, "Actualización de contraseña", 'Su contraseña ha sido actualizada con éxito.');


    return { message: 'Contraseña actualizada exitosamente.' };

    
  }
  
  
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

 
