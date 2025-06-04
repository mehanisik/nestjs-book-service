import { Module } from "@nestjs/common";
import { HealthModule } from "./api/health/health.module";
import appConfig from "./config/app/app.config";
import databaseConfig from "./config/database/database.config";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
			load: [appConfig, databaseConfig],
		}),
		HealthModule,
	],
})
export class AppModule {}
