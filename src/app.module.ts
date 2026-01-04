import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import * as Joi from 'joi';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    // 🔹 Importa ConfigModule antes que los demás
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    // 🔹 Usa ConfigService para acceder al valor de MONGODB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB'),
        dbName: 'pokemonsdb'
      }),
      inject: [ConfigService],
    }),

    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {
}
