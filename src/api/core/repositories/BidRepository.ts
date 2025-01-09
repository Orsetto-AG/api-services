import { EntityRepository, Repository, UpdateResult } from "typeorm";
import { Bid } from "../models/BidModel";
import moment from "moment";

@EntityRepository(Bid)
export class BidRepository extends Repository<Bid> {
  // Belirli bir açık artırma için tüm teklifleri getir
  async findByAuctionId(
    auctionId: number
  ): Promise<{
    auctionId: number,
    bids: Partial<Bid>[]; // Bid'in sadece bazı alanlarını döneceğiz
    totalCount: number;
    currentMinBid: number; // current_min_bid bilgisi
  }> {
    // Query ile bid'leri ve toplam sayıyı alıyoruz
    const [bids, totalCount] = await this.createQueryBuilder("bid")
      .where("bid.auction_id = :auctionId", { auctionId })
      .leftJoinAndSelect("bid.auction", "auction") // auction tablosunu join ediyoruz
      .leftJoinAndSelect("bid.customer", "customer") // customer tablosunu join ediyoruz
      .orderBy("bid.created_date", "DESC")
      .getManyAndCount();
  
    // En büyük current_bid_amount'u bul
    const maxCurrentBidAmount = bids.reduce(
      (max, bid) => (bid.currentBidAmount && bid.currentBidAmount > max ? bid.currentBidAmount : max),
      0
    );
  
    // current_min_bid'i hesapla
    const currentMinBid = maxCurrentBidAmount + (bids[0]?.auction?.minIncrement || 0);
  
    // Bids'i dönüştür
    const transformedBids: Partial<any>[] = bids.map((bid) => ({
      initialBidAmount: bid.initialBidAmount,
      currentBidAmount: bid.currentBidAmount,
      init_bid_date: moment(bid.createdDate).format('YYYY-MM-DD HH:mm:ss'),
      current_bid_date: moment(bid.modifiedDate).format('YYYY-MM-DD HH:mm:ss'),
      customer: bid.customer?.firstName?.slice(0, 2) + "*****" || "N/A", // İlk 2 harf + *****
    }));
  
    return {
      auctionId, 
      bids: transformedBids,
      totalCount,
      currentMinBid,
    };
  }

  // En yüksek initial teklifi getir
  async findHighestInitialBid(auctionId: number): Promise<Bid | undefined> {
    return this.createQueryBuilder("bid")
      .where("bid.auction_id = :auctionId", { auctionId })
      .orderBy("bid.initial_bid_amount", "DESC")
      .getOne();
  }


  async findHighestCurrentBid(auctionId: number): Promise<Bid | undefined> {
    return this.createQueryBuilder("bid")
      .where("bid.auction_id = :auctionId", { auctionId })
      .orderBy("bid.current_bid_amount", "DESC")
      .getOne();
  }

  // En yüksek teklifi getir
  async findHighestMaxBid(auctionId: number): Promise<Bid | undefined> {
    return this.createQueryBuilder("bid")
      .where("bid.auction_id = :auctionId", { auctionId })
      .andWhere("bid.max_bid_amount IS NOT NULL")
      .orderBy("bid.max_bid_amount", "DESC")
      .getOne();
  }

  async placeBid(
    auctionId: number,
    bidderId: number,
    initialBidAmount: number,
    currentBidAmount: number | null,
    maxBidAmount: number | null
  ): Promise<Bid> {
    const bid = this.create({
      auctionId,
      bidderId,
      initialBidAmount,
      currentBidAmount,
      maxBidAmount,
    });
    await this.save(bid);
    return bid;
  }

  async updateCurrentAmountForBid(
    biddingId: number,
    currentBidAmount: number | null,
  ): Promise<UpdateResult> {
    return await this.update(
      { id : biddingId },
      {
        currentBidAmount,
      }
    );
  }
}
