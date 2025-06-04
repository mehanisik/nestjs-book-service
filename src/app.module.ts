import { Module } from "@nestjs/common";
import appConfig from "./config/app/app.config";
import databaseConfig from "./config/database/database.config";
import authConfig from "./config/auth/auth.config";
import cloudConfig from "./config/cloud/cloud.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiModule } from "./api/api.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
			load: [appConfig, databaseConfig, authConfig, cloudConfig],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: databaseConfig,
		}),
		ApiModule,
	],
})
export class AppModule {}
