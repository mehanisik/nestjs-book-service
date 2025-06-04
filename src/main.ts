import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Config } from "./config/config.type";
import { Logger } from "@nestjs/common";
import setupSwagger from "./swagger/swagger.setup";

async function bootstrap() {
	const logger = new Logger("Bootstrap");
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "warn", "log", "debug", "verbose"],
	});

	const configService = app.get(ConfigService<Config>);
	app.setGlobalPrefix("api");

	app.enableCors({
		origin: configService.getOrThrow("app.corsOrigin", { infer: true }),
		methods: ["GET", "PATCH", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"Accept",
		],
		credentials: true,
	});

	const env = configService.getOrThrow("app.env", { infer: true });
	if (env !== "production") {
		setupSwagger(app);
	}

	const port = configService.getOrThrow("app.port", { infer: true });
	await app.listen(port);
	logger.log(`🚀 Server running at http://localhost:${port}/api`);
	return app;
}
bootstrap();
