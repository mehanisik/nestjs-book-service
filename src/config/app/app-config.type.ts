export type AppConfig = {
	port: number;
	env: string;
	name: string;
	url: string;
	version: string;
	corsOrigin: string | string[];
	jwtSecret: string;
	jwtExpiresIn: string;
};
