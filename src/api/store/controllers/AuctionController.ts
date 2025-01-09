import {
  JsonController,
  Get,
  Param,
  Post,
  QueryParam,
  HttpCode,
} from "routing-controllers";
import { AuctionService } from "../../core/services/AuctionService";
import { Auction } from "../../core/models/AuctionModel";

@JsonController("/auctions")
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  /**
   * @api {get} /api/auctions/active Request Active Auctions
   * @apiName GetActiveAuctions
   * @apiGroup Auctions
   *
   * @apiParam {Number} limit Number of auctions to retrieve.
   * @apiParam {Number} offset Number of auctions to skip.
   *
   * @apiSuccess {Object[]} auctions List of active auctions.
   * @apiSuccess {Number} auctions.id Unique ID of the auction.
   * @apiSuccess {String} auctions.title Title of the auction.
   * @apiSuccess {String} auctions.status Current status of the auction (e.g., "active").
   * @apiSuccess {Date} auctions.startDate Start date of the auction.
   * @apiSuccess {Date} auctions.endDate End date of the auction.
   */
  @Get("/active")
  async getActiveAuctions(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number
  ): Promise<{ auctions: Auction[]; totalCount: number }> {
    return this.auctionService.getActiveAuctions(limit, offset);
  }

  /**
   * @api {get} /api/auctions/product/:productId Request Auction by Product ID
   * @apiName GetAuctionByProductId
   * @apiGroup Auctions
   *
   * @apiParam {Number} productId Unique ID of the product associated with the auction.
   *
   * @apiSuccess {Object} auction Auction details for the specified product ID.
   * @apiSuccess {Number} auction.id Unique ID of the auction.
   * @apiSuccess {String} auction.title Title of the auction.
   * @apiSuccess {String} auction.status Current status of the auction.
   * @apiSuccess {Date} auction.startDate Start date of the auction.
   * @apiSuccess {Date} auction.endDate End date of the auction.
   * @apiSuccess {Number} auction.productId ID of the product in the auction.
   */
  @Get("/product/:productId")
  async getAuctionByProductId(
    @Param("productId") productId: number
  ): Promise<Auction | undefined> {
    return this.auctionService.getAuctionByProductId(productId);
  }

  /**
   * @api {post} /api/auctions/end/:auctionId End an Auction
   * @apiName EndAuction
   * @apiGroup Auctions
   *
   * @apiParam {Number} auctionId Unique ID of the auction to be ended.
   *
   * @apiSuccess {String} message Success message indicating auction has been ended.
   * @apiSuccess {Number} auctionId ID of the auction that was ended.
   */
  @Post("/end/:auctionId")
  @HttpCode(200)
  async endAuction(@Param("auctionId") auctionId: number): Promise<void> {
    await this.auctionService.endAuction(auctionId);
  }

  /**
   * @api {get} /api/auctions/ending-soon Request Auctions Ending Soon
   * @apiName GetEndingSoonAuctions
   * @apiGroup Auctions
   *
   * @apiParam {Number} limit Number of auctions to retrieve.
   * @apiParam {Number} offset Number of auctions to skip.
   *
   * @apiSuccess {Object[]} auctions List of auctions ending soon.
   * @apiSuccess {Number} auctions.id Unique ID of the auction.
   * @apiSuccess {String} auctions.title Title of the auction.
   * @apiSuccess {String} auctions.status Current status of the auction.
   * @apiSuccess {Date} auctions.startDate Start date of the auction.
   * @apiSuccess {Date} auctions.endDate End date of the auction.
   */
  @Get("/ending-soon")
  async getEndingSoonAuctions(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number
  ): Promise<{ auctions: Auction[]; totalCount: number }> {
    return this.auctionService.getEndingSoonAuctions(limit, offset);
  }

  /**
   * @api {get} /api/auctions/upcoming Request Upcoming Auctions
   * @apiName GetUpcomingAuctions
   * @apiGroup Auctions
   *
   * @apiParam {Number} limit Number of auctions to retrieve.
   * @apiParam {Number} offset Number of auctions to skip.
   *
   * @apiSuccess {Object[]} auctions List of upcoming auctions.
   * @apiSuccess {Number} auctions.id Unique ID of the auction.
   * @apiSuccess {String} auctions.title Title of the auction.
   * @apiSuccess {String} auctions.status Current status of the auction.
   * @apiSuccess {Date} auctions.startDate Start date of the auction.
   * @apiSuccess {Date} auctions.endDate End date of the auction.
   */
  @Get("/upcoming")
  async getUpcomingAuctions(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number
  ): Promise<{ auctions: Auction[]; totalCount: number }> {
    return this.auctionService.getUpcomingAuctions(limit, offset);
  }
}
