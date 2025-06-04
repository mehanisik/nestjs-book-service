import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { GlobalConfig } from "./config/config.type";
import { ConsoleLogger } from "@nestjs/common";
import setupSwagger from "./swagger/swagger.setup";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: new ConsoleLogger({
			json: true,
		}),
	});

	const configService = app.get(ConfigService<GlobalConfig>);
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

	await app.listen(configService.getOrThrow("app.port", { infer: true }));
	console.log(
		`🚀 Server running at http://localhost:${configService.getOrThrow("app.port", { infer: true })}/api`,
	);
	return app;
}
bootstrap();
