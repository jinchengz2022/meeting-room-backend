import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioController } from './minio.controller';
import * as Minio from 'minio'

@Global()
@Module({
    providers: [
        {
            provide: 'MINIO_CLIENT',
            useFactory(configService: ConfigService) {
                const client = new Minio.Client({
                    endPoint: configService.get('minio_endPoint'),
                    port: +configService.get('minio_port'),
                    useSSL: false,
                    accessKey: configService.get('minio_accessKey'),
                    secretKey: configService.get('minio_secretKey')
                })
                return client;
            },
            inject: [ConfigService]
        }
    ],
    exports: ['MINIO_CLIENT'],
    controllers: [MinioController],
    
})
export class MinioModule {}