import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Config } from "../../config/config.type";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class CloudinaryService {
	private readonly logger = new Logger(CloudinaryService.name);
	private readonly allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
	private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

	constructor(private readonly configService: ConfigService<Config>) {
		const cloudinaryUrl = this.configService.getOrThrow("cloud.cloudinaryUrl", {
			infer: true,
		});
		const url = new URL(cloudinaryUrl);

		cloudinary.config({
			cloud_name: url.hostname.split(".")[0],
			api_key: url.username,
			api_secret: url.password,
			secure: true,
		});

		this.logger.log("Cloudinary service initialized");
	}

	public async uploadImage(file: Express.Multer.File): Promise<string> {
		try {
			this.logger.debug(`Uploading image: ${file.originalname}`);

			if (!file.buffer || file.buffer.length === 0) {
				throw new BadRequestException("Empty file");
			}

			if (!this.allowedMimeTypes.includes(file.mimetype)) {
				throw new BadRequestException(
					`Invalid file type. Allowed types: ${this.allowedMimeTypes.join(", ")}`,
				);
			}

			if (file.size > this.maxFileSize) {
				throw new BadRequestException(
					`File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`,
				);
			}

			const b64 = Buffer.from(file.buffer).toString("base64");
			const dataURI = `data:${file.mimetype};base64,${b64}`;

			const result = await cloudinary.uploader.upload(dataURI, {
				folder: this.configService.getOrThrow("cloud.cloudinaryFolder", {
					infer: true,
				}),
				transformation: [{ width: 500, height: 500, crop: "limit" }],
				resource_type: "image",
			});

			this.logger.log(`Image uploaded: ${result.secure_url}`);
			return result.secure_url;
		} catch (error) {
			this.logger.error(
				`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
			throw error;
		}
	}

	public async deleteImage(publicId: string): Promise<void> {
		try {
			this.logger.debug(`Deleting image: ${publicId}`);
			await cloudinary.uploader.destroy(publicId);
			this.logger.log(`Image deleted: ${publicId}`);
		} catch (error) {
			this.logger.error(
				`Delete failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
			throw error;
		}
	}
}
