import { Controller, Inject, Query, Get } from "@nestjs/common";
import * as Minio from "minio";

@Controller("minio")
export class MinioController {
  @Inject("MINIO_CLIENT")
  private minioClient: Minio.Client;

  @Get("presignedUrl")
  presignedUrl(@Query("name") name: string) {
    return this.minioClient.presignedPutObject(
      "bucket1",
      name,
      3600
    );
  }
}
