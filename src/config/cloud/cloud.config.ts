import { registerAs } from "@nestjs/config";
import { CloudConfig } from "./cloud-config.type";

export function getCloudConfig(): CloudConfig {
	return {
		cloudinaryUrl: process.env.CLOUDINARY_URL,
		cloudinaryFolder: process.env.CLOUDINARY_FOLDER || "nestjs_book_api_covers",
	};
}

export default registerAs<CloudConfig>("cloud", () => {
	return getCloudConfig();
});
