import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { TeamsModule } from './teams/teams.module';
import { CommentModule } from './comment/com.module';
import { ProfesionalModule } from './profesional/prof.module';
import { SecretariaModule } from './secretaria/secre.module';
import { DiaNoDisponibleModule } from './Daysnot/day.module';


@Module({
  imports: [UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user_auth',
      password: 'root',
      database: 'dblogin',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    MailerModule,
    ProfesionalModule,
    SecretariaModule,
    TeamsModule,
    CommentModule,
    DiaNoDisponibleModule,
    
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
