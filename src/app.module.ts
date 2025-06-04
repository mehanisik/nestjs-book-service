import { Module } from "@nestjs/common";
import { HealthModule } from "./api/health/health.module";
import appConfig from "./config/app/app.config";
import databaseConfig from "./config/database/database.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./api/auth/auth.module";

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
		AuthModule,
	],
})
export class AppModule {}
