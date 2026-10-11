import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

export function configureCloudinary(): void {
  if (
    !env.cloudinary.cloudName ||
    !env.cloudinary.apiKey ||
    !env.cloudinary.apiSecret
  ) {
    console.warn("Cloudinary credentials missing — uploads will fail until configured");
    return;
  }
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

export { cloudinary };
