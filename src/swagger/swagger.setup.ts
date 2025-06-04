import { type GlobalConfig } from "@/config/config.type";
import { type INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

function setupSwagger(app: INestApplication): OpenAPIObject {
	const configService = app.get(ConfigService<GlobalConfig>);
	const appName = configService.getOrThrow("app.name", { infer: true });

	const config = new DocumentBuilder()
		.setTitle(appName)
		.setDescription(
			`<p>Nestjs Book Service.</p>
      <p>Click <a href="/api/auth/reference">here</a> to see authentication API's.</p>`,
		)
		.setVersion("1.0")
		.addBearerAuth()
		.addApiKey({ type: "apiKey", name: "Api-Key", in: "header" }, "Api-Key")
		.addServer(
			configService.getOrThrow("app.url", { infer: true }),
			"Development",
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("/swagger", app, document);

	return document;
}

export default setupSwagger;
