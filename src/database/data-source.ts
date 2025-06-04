import "reflect-metadata";
import { DataSource } from "typeorm";
import { getDatabaseConfig } from "../config/database/database.config";

const dataSource = new DataSource(getDatabaseConfig());

export default dataSource;
