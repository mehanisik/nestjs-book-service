import { Module } from "@nestjs/common";
import { HealthModule } from "./api/health/health.module";
import appConfig from "./config/app/app.config";
import databaseConfig from "./config/database/database.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
			load: [appConfig, databaseConfig],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: databaseConfig,
		}),
		HealthModule,
	],
})
export class AppModule {}
