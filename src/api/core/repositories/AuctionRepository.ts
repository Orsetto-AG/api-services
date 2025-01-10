

import { EntityRepository, Repository } from "typeorm";
import { Auction } from "../models/AuctionModel";

@EntityRepository(Auction)
export class AuctionRepository extends Repository<Auction> {
  // Açık artırmaya göre aktif açık artırmaları getir
  async findActiveAuctions(
    limit: number,
    offset: number
  ): Promise<{ auctions: Auction[]; totalCount: number }> {
    const [auctions, totalCount] = await this.createQueryBuilder("auction")
      .leftJoinAndSelect("auction.product", "product")
      .where("auction.is_active = :isActive", { isActive: 1 })
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      auctions,
      totalCount,
    };
  }

  // Belirli bir ürün için açık artırma bul
  async findByProductId(productId: number): Promise<Auction | undefined> {
    return this.createQueryBuilder("auction")
      .where("auction.product_id = :productId", { productId })
      .getOne();
  }

  // Açık artırmayı sonlandır
  async endAuction(auctionId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(Auction)
      .set({ isActive: 0 })
      .where("id = :auctionId", { auctionId })
      .execute();
  }

  // Son dakikaları kalan açık artırmaları bitiş tarihine göre sıralı getir (pagination destekli)
  async findEndingSoonAuctions(
    limit: number,
    offset: number
  ): Promise<{ auctions: Auction[]; totalCount: number }> {
    const [auctions, totalCount] = await this.createQueryBuilder("auction")
      .leftJoinAndSelect("auction.product", "product")
      .where("auction.start_time <= NOW()") // Başlamış açık artırmalar
      .andWhere("auction.end_time > NOW()") // Hala bitmemiş açık artırmalar
      .andWhere("auction.is_active = :isActive", { isActive: 1 }) // Aktif açık artırmalar
      .orderBy("auction.end_time", "ASC") // En yakında bitenler önce
      .offset(offset) // Sayfa offset
      .limit(limit) // Sayfa başına kayıt sayısı
      .getManyAndCount(); // Veriyi ve toplam sayıyı al

    return {
      auctions,
      totalCount,
    };
  }

  // Henüz başlamamış açık artırmaları başlangıç tarihine göre sıralı getir (pagination destekli)
  async findUpcomingAuctions(
    limit: number,
    offset: number
  ): Promise<{ auctions: Auction[]; totalCount: number }> {
    const [auctions, totalCount] = await this.createQueryBuilder("auction")
      .leftJoinAndSelect("auction.product", "product")
      .where("auction.start_time >= NOW()") // Başlamamış veya şu anki zamana eşit olan açık artırmalar
      .andWhere("auction.is_active = :isActive", { isActive: 1 }) // Aktif olan açık artırmalar
      .orderBy("auction.start_time", "ASC") // Başlangıç zamanına göre sıralama
      .offset(offset) // Sayfa offset
      .limit(limit) // Sayfa başına kayıt sayısı
      .getManyAndCount(); // Veriyi ve toplam sayıyı al

    return {
      auctions,
      totalCount,
    };
  }
}
