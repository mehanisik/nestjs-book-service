import { registerAs } from "@nestjs/config";
import { DatabaseConfig } from "./database-config.type";

export function getDatabaseConfig(): DatabaseConfig {
	return {
		host: process.env.DATABASE_HOST || "localhost",
		port: Number.parseInt(process.env.DATABASE_PORT || "5432", 10),
		username: process.env.DATABASE_USERNAME || "postgres",
		password: process.env.DATABASE_PASSWORD || "postgres",
		name: process.env.DATABASE_NAME || "nestjs_api",
	};
}

export default registerAs<DatabaseConfig>("database", () => {
	return getDatabaseConfig();
});
