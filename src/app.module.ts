import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQLHOST') || configService.get('DB_HOST'),
        port: parseInt(configService.get('MYSQLPORT') || configService.get('DB_PORT') || '3306', 10),
        username: configService.get('MYSQLUSER') || configService.get('DB_USERNAME'),
        password: configService.get('MYSQLPASSWORD') || configService.get('DB_PASSWORD'),
        database: configService.get('MYSQLDATABASE') || configService.get('DB_DATABASE'),
        entities: [User],
        synchronize: configService.get('NODE_ENV') !== 'production',
        ssl: configService.get('NODE_ENV') === 'production' ? {
          rejectUnauthorized: false
        } : false,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000,
        extra: {
          connectionLimit: 5
        }
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    HealthModule,
  ],
})


export class AppModule {}
