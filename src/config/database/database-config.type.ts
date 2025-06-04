export type DatabaseConfig = {
	url: string;
	type: "postgres";
	ssl: boolean;
	synchronize: boolean;
	entities: string[];
};
