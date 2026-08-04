import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from './infrastructures/database/naming-strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ContactModule } from './modules/contact/contact.module';
import { ProjectModule } from './modules/project/project.module';
import { TechnologyModule } from './modules/technology/technology.module';
import { HealthController } from './common/controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        namingStrategy: new SnakeNamingStrategy(),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: ['query', 'error'],
        autoLoadEntities: true,
        migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ContactModule,
    TechnologyModule,
    ProjectModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
