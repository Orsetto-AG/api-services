import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateRegisterProcess1736715953697 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let columnExist = await queryRunner.hasColumn("customer", "is_company");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_company",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    columnExist = await queryRunner.hasColumn("customer", "is_completed");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_completed",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    await queryRunner.dropColumn("customer", "mail_otp_expire_time");
    await queryRunner.dropColumn("customer", "mail_otp");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("customer", "is_completed");
    await queryRunner.dropColumn("customer", "is_company");

    let columnExist = await queryRunner.hasColumn("customer", "mail_otp");

    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "mail_otp",
          type: "int",
          length: "11",
          comment: "BUYER MAIL CHANGE OTP",
          isPrimary: false,
          isNullable: true,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "mail_otp_expire_time"
    );

    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "mail_otp_expire_time",
          type: "datetime",
          comment: "BUYER MAIL CHANGE OTP EXPIRE TIME",
          isPrimary: false,
          isNullable: true,
        })
      );
  }
}
