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


 
  
  

  remove(id: number) {
    return `This action removes a #${id} user`;
  }



  async updatePassword(email: string): Promise<{ message: string }> {
    // Busca al usuario por su dirección de correo electrónico
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Genera una contraseña aleatoria
    const newPassword = this.generateRandomPassword();

    // Encripta la nueva contraseña con bcrypt
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Actualiza el campo de contraseña con la nueva contraseña encriptada
    user.password = hashedPassword;

    // Guarda los cambios en la base de datos
    await this.userRepository.save(user);

    // Envía el correo electrónico después de actualizar la contraseña
    await this.mailerService.sendEmail(
      email,
      'Actualización de contraseña',
      `Tu nueva contraseña es: ${newPassword}`
    );

    return { message: 'Contraseña actualizada exitosamente.' };
  }
  async updateUserProfile(user: User) {
    try {
      // Actualiza el perfil del usuario en la base de datos
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error);
      throw new Error('Error al actualizar el perfil del usuario');
    }
  }

  // Función para generar una contraseña aleatoria
  private generateRandomPassword(length: number = 12): string {
    const caracteresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let newPassword = "";

    for (let i = 0; i < length; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteresPermitidos.length);
      newPassword += caracteresPermitidos.charAt(indiceAleatorio);
    }

    return newPassword;
  }











}

 
