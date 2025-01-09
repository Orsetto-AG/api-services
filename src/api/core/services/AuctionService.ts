import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { AuctionRepository } from "../repositories/AuctionRepository";
import { Auction } from "../models/AuctionModel";
import { Logger, LoggerInterface } from "../../../decorators/Logger";

@Service()
export class AuctionService {
  constructor(
    @OrmRepository() private auctionRepository: AuctionRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // Aktif açık artırmaları getir
  async getActiveAuctions(
    limit: number,
    offset: number
  ): Promise<{ auctions: Auction[]; totalCount: number }> {
    this.log.info("getActiveAuctions ");
    return this.auctionRepository.findActiveAuctions(limit, offset);
  }

  async getAuctionById(auctionId: number): Promise<Auction | undefined> {
    this.log.info("getAuctionById ");
    return this.auctionRepository.findOne({
      where: {
        id: auctionId,
      },
    });
  }

  // Belirli bir ürün için açık artırma bul
  async getAuctionByProductId(productId: number): Promise<Auction | undefined> {
    this.log.info("getAuctionByProductId ");
    return this.auctionRepository.findByProductId(productId);
  }

  // Açık artırmayı sonlandır
  async endAuction(auctionId: number): Promise<void> {
    this.log.info("endAuction ");
    await this.auctionRepository.endAuction(auctionId);
  }

  // Son dakikaları kalan açık artırmaları getir
  async getEndingSoonAuctions(
    limit: number,
    offset: number
  ): Promise<{ auctions: Auction[]; totalCount: number }> {
    this.log.info("getEndingSoonAuctions ");
    return this.auctionRepository.findEndingSoonAuctions(limit, offset);
  }

  // Henüz başlamamış açık artırmaları getir
  async getUpcomingAuctions(
    limit: number,
    offset: number
  ): Promise<{ auctions: Auction[]; totalCount: number }> {
    this.log.info("getUpcomingAuctions ");
    return this.auctionRepository.findUpcomingAuctions(limit, offset);
  }
}
