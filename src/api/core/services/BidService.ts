import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { BidRepository } from "../repositories/BidRepository";
import { Bid } from "../models/BidModel";
import { Logger, LoggerInterface } from "../../../decorators/Logger";
import { UpdateResult } from "typeorm";

@Service()
export class BidService {
  constructor(
    @OrmRepository() private bidRepository: BidRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // Belirli bir açık artırma için tüm teklifleri getir
  async getBidsByAuctionId(auctionId: number): Promise<{
    auctionId: number,
    bids: Partial<Bid>[]; // Bid'in sadece bazı alanlarını döneceğiz
    totalCount: number;
    currentMinBid: number; // current_min_bid bilgisi
  }> {
    this.log.info("getBidsByAuctionId ");
    return this.bidRepository.findByAuctionId(auctionId);
  }

  async getHighestInitialBid(auctionId: number): Promise<Bid | undefined> {
    this.log.info("getHighestInitialBid ");
    return this.bidRepository.findHighestInitialBid(auctionId);
  }

  async getHighestCurrentBid(auctionId: number): Promise<Bid | undefined> {
    this.log.info("getHighestCurrentBid ");
    return this.bidRepository.findHighestCurrentBid(auctionId);
  }

  async getHighestMaxBid(auctionId: number): Promise<Bid | undefined> {
    this.log.info("getHighestMaxBid ");
    return this.bidRepository.findHighestMaxBid(auctionId);
  }

  async placeBid(
    auctionId: number,
    bidderId: number,
    initialBidAmount: number,
    currentBidAmount: number | null,
    maxBidAmount: number | null
  ): Promise<Bid> {
    this.log.info("placeBid ");
    return this.bidRepository.placeBid(
      auctionId,
      bidderId,
      initialBidAmount,
      currentBidAmount,
      maxBidAmount
    );
  }

  async updateCurrentAmountForBid(
    biddingId: number,
    currentBidAmount: number | null
  ): Promise<UpdateResult> {
    this.log.info("updateCurrentAmountForBid ");
    return this.bidRepository.updateCurrentAmountForBid(
      biddingId,
      currentBidAmount
    );
  }
}
