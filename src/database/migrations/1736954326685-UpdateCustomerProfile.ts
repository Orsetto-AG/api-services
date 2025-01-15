import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateCustomerProfile1736954326685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let columnExist = await queryRunner.hasColumn(
      "customer",
      "is_completed_personal_info"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_completed_personal_info",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "is_completed_company_info"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_completed_company_info",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "is_completed_phone_otp_verification"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_completed_phone_otp_verification",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "is_completed_kyc_verification"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_completed_kyc_verification",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "is_completed_address_verification"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_completed_address_verification",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "is_completed_email_otp_verification"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_completed_email_otp_verification",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    columnExist = await queryRunner.hasColumn("customer", "birthday");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "birthday",
          type: "date",
          isPrimary: false,
          isNullable: true,
        })
      );

    columnExist = await queryRunner.hasColumn("customer", "street");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "street",
          type: "varchar",
          length: "128",
          isPrimary: false,
          isNullable: true,
        })
      );

    columnExist = await queryRunner.hasColumn("customer", "street_number");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "street_number",
          type: "varchar",
          length: "32",
          isPrimary: false,
          isNullable: true,
        })
      );

    columnExist = await queryRunner.hasColumn("customer", "zip_code");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "zip_code",
          type: "varchar",
          length: "16",
          isPrimary: false,
          isNullable: true,
        })
      );

    columnExist = await queryRunner.hasColumn("customer", "country");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "country",
          type: "varchar",
          length: "32",
          isPrimary: false,
          isNullable: true,
        })
      );

    columnExist = await queryRunner.hasColumn("customer", "other_address_info");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "other_address_info",
          type: "varchar",
          length: "256",
          isPrimary: false,
          isNullable: true,
        })
      );

    columnExist = await queryRunner.hasColumn("customer", "company_name");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "company_name",
          type: "varchar",
          length: "256",
          isPrimary: false,
          isNullable: true,
        })
      );

    columnExist = await queryRunner.hasColumn("customer", "is_vat_chargeable");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_vat_chargeable",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    columnExist = await queryRunner.hasColumn("customer", "vat_number");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "vat_number",
          type: "varchar",
          length: "128",
          isPrimary: false,
          isNullable: true,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "is_trade_registered"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_trade_registered",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "trade_registered_number"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "trade_registered_number",
          type: "varchar",
          length: "128",
          isPrimary: false,
          isNullable: true,
        })
      );

    columnExist = await queryRunner.hasColumn("customer", "is_register_owner");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_register_owner",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "is_accepted_term_and_conditions"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_accepted_term_and_conditions",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "is_completed_email_verification"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "is_completed_email_verification",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "register_person_name"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "register_person_name",
          type: "varchar",
          length: "256",
          isPrimary: false,
          isNullable: true,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "register_person_surname"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "register_person_surname",
          type: "varchar",
          length: "256",
          isPrimary: false,
          isNullable: true,
        })
      );

    columnExist = await queryRunner.hasColumn(
      "customer",
      "register_person_sex"
    );
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "register_person_sex",
          type: "varchar",
          length: "16",
          isPrimary: false,
          isNullable: true,
        })
      );

    let tableExist = await queryRunner.hasTable("customer_cart");

    if (tableExist) await queryRunner.dropTable("customer_cart");

    tableExist = await queryRunner.hasTable("zone");
    if (tableExist) await queryRunner.dropTable("zone");

    tableExist = await queryRunner.hasTable("country");
    if (tableExist) await queryRunner.dropTable("country");

    tableExist = await queryRunner.hasTable("address");
    if (tableExist) await queryRunner.dropTable("address");

    tableExist = await queryRunner.hasTable("customer_to_group");
    if (tableExist) await queryRunner.dropTable("customer_to_group");

    tableExist = await queryRunner.hasTable("product_special");
    if (tableExist) await queryRunner.dropTable("product_special");

    tableExist = await queryRunner.hasTable("customer_group");
    if (tableExist) await queryRunner.dropTable("customer_group");

    await queryRunner.dropColumn("customer", "is_completed");
    await queryRunner.dropColumn("customer", "country_id");
    await queryRunner.dropColumn("customer", "dob");
    await queryRunner.dropColumn("customer", "site_id");
    await queryRunner.dropColumn("customer", "locked_on");
    await queryRunner.dropColumn("customer", "local");
    await queryRunner.dropColumn("customer", "zone_id");
    await queryRunner.dropColumn("customer", "address");
    await queryRunner.dropColumn("customer", "oauth_data");
    await queryRunner.dropColumn("customer", "address2");
    await queryRunner.dropColumn("customer", "landmark");
    await queryRunner.dropColumn("customer", "avatar");
    await queryRunner.dropColumn("customer", "avatar_path");
    await queryRunner.dropColumn("customer", "newsletter");
    await queryRunner.dropColumn("customer", "customer_group_id");
    await queryRunner.dropColumn("customer", "safe");
    await queryRunner.dropColumn("customer", "ip");
    await queryRunner.dropColumn("customer", "mail_status");
    await queryRunner.dropColumn("customer", "mobile");
    await queryRunner.dropColumn("customer", "pincode");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    let columnExist = await queryRunner.hasColumn("customer", "is_completed");
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

    columnExist = await queryRunner.hasColumn("customer", "dob");
    if (!columnExist)
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "dob",
          type: "date",
          isPrimary: false,
          isNullable: true,
        })
      );

    await queryRunner.dropColumn("customer", "is_completed_personal_info");
    await queryRunner.dropColumn("customer", "is_completed_company_info");
    await queryRunner.dropColumn(
      "customer",
      "is_completed_phone_otp_verification"
    );
    await queryRunner.dropColumn("customer", "is_completed_kyc_verification");
    await queryRunner.dropColumn(
      "customer",
      "is_completed_address_verification"
    );
    await queryRunner.dropColumn(
      "customer",
      "is_completed_email_otp_verification"
    );
  }
}
