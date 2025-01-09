import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuctionBidRelation1736112926266 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // `product` tablosuna açık artırma ile ilgili sütunlar ekleniyor
    await queryRunner.query(`
      ALTER TABLE product
      ADD COLUMN is_auction TINYINT(1) DEFAULT 0 NOT NULL COMMENT '0->Normal, 1->Auction'
    `);

    // `auctions` tablosu oluşturuluyor
    await queryRunner.query(`
        CREATE TABLE auction (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL COMMENT 'Referenced product',
            start_time TIMESTAMP NOT NULL COMMENT 'Auction start time',
            end_time TIMESTAMP NOT NULL COMMENT 'Auction end time',
            max_cycles INT NOT NULL COMMENT 'Maximum auction cycles',
            current_cycle INT DEFAULT 0 NOT NULL COMMENT 'Current auction cycle',
            base_price DECIMAL(10, 2) NOT NULL COMMENT 'Starting price of the auction',
            auction_days INT NOT NULL COMMENT 'Number of days for auction',
            min_increment DECIMAL(10, 2) NOT NULL COMMENT 'Minimum increment for bids',
            is_active TINYINT(1) DEFAULT 1 COMMENT 'Auction active status (1 = active, 0 = inactive)',
            created_date DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT 'Record creation date',
            modified_date DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT 'Record modification date',
            created_by INT NULL COMMENT 'User who created the record',
            modified_by INT NULL COMMENT 'User who last modified the record',
            FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
        CREATE TABLE bid (
            id INT AUTO_INCREMENT PRIMARY KEY,
            auction_id INT NOT NULL COMMENT 'Referenced auction',
            bidder_id INT NOT NULL COMMENT 'Customer placing the bid',
            initial_bid_amount DECIMAL(10, 2) NOT NULL COMMENT 'Initial bid amount',
            current_bid_amount DECIMAL(10, 2) NULL COMMENT 'Current active bid amount if not null',
            max_bid_amount DECIMAL(10, 2) NULL COMMENT 'Maximum bid amount',
            created_date DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT 'Record creation date',
            modified_date DATETIME DEFAULT CURRENT_TIMESTAMP NULL COMMENT 'Record modification date',
            created_by INT NULL COMMENT 'User who created the record',
            modified_by INT NULL COMMENT 'User who last modified the record',
            FOREIGN KEY (auction_id) REFERENCES auction(id) ON DELETE CASCADE,
            FOREIGN KEY (bidder_id) REFERENCES customer(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // `auction_bids` tablosu siliniyor
    await queryRunner.query(`
      DROP TABLE bid;
    `);

    await queryRunner.query(`
      DROP TABLE auction;
    `);

    // `product` tablosundan açık artırma ile ilgili sütunlar kaldırılıyor
    await queryRunner.query(`
      ALTER TABLE product
      DROP COLUMN is_auction
    `);
  }
}
