import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User) // Asegúrate de usar @InjectRepository con la entidad Usuario
    private readonly usuarioRepository: Repository<User>,
  ) {
    this.transporter = nodemailer.createTransport({
      // Configura las opciones de transporte aquí (por ejemplo, SMTP, Gmail, etc.).
      service: 'Gmail',
      auth: {
        user: 'testingparago@gmail.com',
        pass: 'bgax liom ldhe zygn',
      },
    });
  }

  async sendEmail(email: string, subject: string, text: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOneBy({email});
    
    if (usuario) {
        await this.transporter.sendMail({
            from: 'testingparago@gmail.com',
            to: usuario.email,
            subject,
            text,
      });
    } else {
      throw new Error('Usuario no encontrado'); // Puedes manejar esto según tus necesidades
    }
  }
}