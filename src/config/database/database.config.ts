import { registerAs } from "@nestjs/config";
import { DatabaseConfig } from "./database-config.type";

export function getDatabaseConfig(): DatabaseConfig {
	return {
		host: process.env.DB_HOST,
		port: Number.parseInt(process.env.DB_PORT || "5432"),
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		name: process.env.DB_NAME,
	};
}

export default registerAs<DatabaseConfig>("database", () => {
	return getDatabaseConfig();
});
