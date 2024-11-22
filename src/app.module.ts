import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import * as path from "path";
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WinstonLogger,
  WinstonModule,
  utilities,
} from "nest-winston";
import * as winston from "winston";
import "winston-daily-rotate-file";

import { LoginGuard } from "./login.guard";
import { PermissionGuard } from "./permission.guard";
import { MeetingRoomModule } from "./meeting-room/meeting-room.module";
import { MeetingRoom } from "./meeting-room/entities/meeting-room.entity";
import { BookingModule } from "./booking/booking.module";
import { Booking } from "./booking/entities/booking.entity";
import { MinioModule } from "./minio/minio.module";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { Permission, User, Role } from "./user/entities/index";
import { RedisModule } from "./redis/redis.module";
import { EmailModule } from "./email/email.module";
import { CustomTypeOrmLogger } from "./CustomTypeOrmLogger";

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get("jwt_secret"),
          signOptions: {
            expiresIn: configService.get("jwt_access_token_expires_time"),
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService, logger: WinstonLogger) {
        return {
          type: "mysql",
          host: configService.get("mysql_server_host"),
          port: configService.get("mysql_server_port"),
          username: configService.get("mysql_server_username"),
          password: configService.get("mysql_server_password"),
          database: configService.get("mysql_server_database"),
          synchronize: false,
          logging: true,
          logger: new CustomTypeOrmLogger(logger),
          entities: [Permission, User, Role, MeetingRoom, Booking],
          poolSize: 10,
          connectorPackage: "mysql2",
          extra: {
            authPlugin: "sha256_password",
          },
        };
      },
      inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.join(__dirname, ".env"),
        path.join(__dirname, ".dev.env"),
      ],
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        level: configService.get('winston_level'),
        transports: [
          // new winston.transports.File({
          //   filename: `${process.cwd()}/log`,
          // }),
          new winston.transports.DailyRotateFile({
            level: configService.get('winston_level'),
            dirname: configService.get('winston_dirname'),
            filename: configService.get('winston_filename'),
            datePattern: configService.get('winston_datePattern'),
            maxSize: configService.get('winston_maxSize'),
          }),
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike()
            ),
          }),
          new winston.transports.Http({
            host: 'localhost',
            port: 3002,
            path: '/log'
          })
        ],
      }),
      inject: [ConfigService]
    }),

    UserModule,
    RedisModule,
    EmailModule,
    MeetingRoomModule,
    BookingModule,
    MinioModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
