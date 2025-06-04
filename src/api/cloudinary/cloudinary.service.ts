import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { RequestHandler } from "express";

interface CloudinaryConfig {
	cloudName: string;
	apiKey: string;
	apiSecret: string;
}

interface CloudinaryUploadOptions {
	folder: string;
	transformation: Array<{ width: number; height: number; crop: string }>;
	resourceType: "auto" | "image" | "video" | "raw";
}

type CloudinaryStorageParams = {
	folder: string;
	allowed_formats: string[];
	transformation: Array<{ width: number; height: number; crop: string }>;
	resource_type: "auto" | "image" | "video" | "raw";
};

@Injectable()
export class CloudinaryService {
	private readonly upload: multer.Multer;
	private readonly uploadOptions: CloudinaryUploadOptions;

	constructor(private readonly configService: ConfigService) {
		const config = this.parseCloudinaryUrl();
		this.initializeCloudinary(config);
		this.uploadOptions = this.getUploadOptions();
		this.upload = this.initializeMulter();
	}

	private parseCloudinaryUrl(): CloudinaryConfig {
		const cloudinaryUrl =
			this.configService.getOrThrow<string>("CLOUDINARY_URL");
		const url = new URL(cloudinaryUrl);
		return {
			cloudName: url.hostname.split(".")[0],
			apiKey: url.username,
			apiSecret: url.password,
		};
	}

	private initializeCloudinary(config: CloudinaryConfig): void {
		cloudinary.config({
			cloud_name: config.cloudName,
			api_key: config.apiKey,
			api_secret: config.apiSecret,
			secure: true,
		});
	}

	private getUploadOptions(): CloudinaryUploadOptions {
		return {
			folder: this.configService.getOrThrow<string>("CLOUDINARY_FOLDER"),
			transformation: [{ width: 500, height: 500, crop: "limit" }],
			resourceType: "image",
		};
	}

	private initializeMulter(): multer.Multer {
		const params: CloudinaryStorageParams = {
			folder: this.uploadOptions.folder,
			allowed_formats: ["jpg", "jpeg", "png"],
			transformation: this.uploadOptions.transformation,
			resource_type: this.uploadOptions.resourceType,
		};

		const storage = new CloudinaryStorage({
			cloudinary,
			params,
		});
		return multer({ storage });
	}

	public getUploadMiddleware(): RequestHandler {
		return this.upload.single("coverImage");
	}

	public async uploadImage(file: Express.Multer.File): Promise<string> {
		try {
			const dataURI = this.convertToDataURI(file);
			const options: UploadApiOptions = {
				folder: this.uploadOptions.folder,
				transformation: this.uploadOptions.transformation,
				resource_type: this.uploadOptions.resourceType,
			};
			const result = await cloudinary.uploader.upload(dataURI, options);
			return result.secure_url;
		} catch (error) {
			throw new Error(
				`Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	private convertToDataURI(file: Express.Multer.File): string {
		const b64 = Buffer.from(file.buffer).toString("base64");
		return `data:${file.mimetype};base64,${b64}`;
	}

	public async deleteImage(publicId: string): Promise<void> {
		try {
			await cloudinary.uploader.destroy(publicId);
		} catch (error) {
			throw new Error(
				`Failed to delete image: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}
}
