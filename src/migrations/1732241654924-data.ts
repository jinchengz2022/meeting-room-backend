import { MigrationInterface, QueryRunner } from "typeorm";

export class Data1732241654924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO `users` VALUES (1,'lina','202cb962ac59075b964b07152d234b70','哈哈哈哈','jinchengz@163.com',NULL,NULL,0,0,'2024-11-22 01:47:33.510188','2024-11-22 01:47:33.510188'),(2,'aa','202cb962ac59075b964b07152d234b70','哈哈哈哈','jinchengz@163.com',NULL,NULL,0,0,'2024-11-22 01:53:04.672166','2024-11-22 01:53:04.672166'),(3,'bb','202cb962ac59075b964b07152d234b70','嘻嘻嘻','jinchengz@163.com',NULL,NULL,0,1,'2024-11-22 01:53:14.492850','2024-11-22 01:53:30.809723');"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
