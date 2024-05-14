import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from './constants/jwt.constant';
import { ProfesionalModule } from 'src/profesional/prof.module';
import { SecretariaModule } from 'src/secretaria/secre.module';

@Module({
  imports: [UsersModule,
    ProfesionalModule,
    SecretariaModule,
  JwtModule.register({
    global: true,
    secret: JwtConstants.secret,
    signOptions: { expiresIn: "1d" },
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
