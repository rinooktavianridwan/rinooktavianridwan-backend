import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { ProfileController } from './controllers/profile.controller';
import { User } from '../../infrastructures/database/entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { JwtStrategy } from './guards/jwt.strategy';
import { LocalStrategy } from './guards/local.strategy';
import { ContactModule } from '../contact/contact.module';
import { ProjectModule } from '../project/project.module';
import { TechnologyModule } from '../technology/technology.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
    ContactModule,
    ProjectModule,
    TechnologyModule,
  ],
  controllers: [UserController, AuthController, ProfileController],
  providers: [
    UserService,
    AuthService,
    UserRepository,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [UserService, AuthService],
})
export class UserModule { }
