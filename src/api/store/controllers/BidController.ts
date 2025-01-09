import {
  JsonController,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from "routing-controllers";
import { BidService } from "../../core/services/BidService";
import { Bid } from "../../core/models/BidModel";
import { CreateBidRequest } from "./request/CreateBidRequest";
import { AuctionService } from "../../core/services/AuctionService";

@JsonController("/bids")
export class BidController {
  constructor(
    private readonly bidService: BidService,
    private readonly auctionService: AuctionService
  ) {}

  /**
   * @api {get} /api/bids/auction/:auctionId Get Bids for a Specific Auction
   * @apiName GetBidsByAuctionId
   * @apiGroup Bids
   *
   * @apiParam {Number} auctionId Unique ID of the auction.
   *
   * @apiSuccess {Object[]} bids List of bids for the specified auction.
   * @apiSuccess {Number} bids.id Unique ID of the bid.
   * @apiSuccess {Number} bids.auctionId ID of the auction the bid belongs to.
   * @apiSuccess {Number} bids.bidderId ID of the user who placed the bid.
   * @apiSuccess {Number} bids.bidAmount The amount of the bid.
   */
  @Get("/auction/:auctionId")
  async getBidsByAuctionId(@Param("auctionId") auctionId: number): Promise<{
    auctionId: number;
    bids: Partial<Bid>[]; // Bid'in sadece bazı alanlarını döneceğiz
    totalCount: number;
    currentMinBid: number; // current_min_bid bilgisi
  }> {
    return this.bidService.getBidsByAuctionId(auctionId);
  }

  /**
   * @api {post} /api/bids/place Place a New Bid
   * @apiName PlaceBid
   * @apiGroup Bids
   *
   * @apiParam {Number} auctionId ID of the auction for which the bid is placed.
   * @apiParam {Number} bidderId ID of the bidder placing the bid.
   * @apiParam {Number} bidAmount Amount of the bid.
   *
   * @apiSuccess {Object} bid The bid placed successfully.
   * @apiSuccess {Number} bid.id Unique ID of the bid.
   * @apiSuccess {Number} bid.auctionId ID of the auction the bid belongs to.
   * @apiSuccess {Number} bid.bidderId ID of the user who placed the bid.
   * @apiSuccess {Number} bid.bidAmount The amount of the bid.
   */
  @Post("/place")
  @HttpCode(201)
  async placeBid(
    @Body({ validate: true }) bidData: CreateBidRequest
  ): Promise<Bid> {
    let { auctionId, bidderId, bidAmount } = bidData;
    bidAmount = parseFloat(bidAmount + "");
    bidderId = parseFloat(bidderId + "");

    const highestMaxBid = await this.bidService.getHighestMaxBid(auctionId);
    const highestInitialBid = await this.bidService.getHighestInitialBid(
      auctionId
    );

    const highestCurrentBid = await this.bidService.getHighestCurrentBid(
      auctionId
    );

    const auction = await this.auctionService.getAuctionById(auctionId);

    if (!auction) {
      throw new NotFoundError(`Auciton not found by id.`);
    }

    if (!highestInitialBid) {
      // ilk teklif
      const expectedBid = auction.basePrice + auction.minIncrement;

      if (expectedBid > bidAmount) {
        throw new BadRequestError(
          `The initial bid value cannot be less than the sum of the base price and the minimum increase amount.`
        );
      } else if (expectedBid === bidAmount) {
        return this.bidService.placeBid(
          auctionId,
          bidderId,
          bidAmount,
          null,
          null
        );
      } else {
        // ilk teklif gizli teklif gelmiş expectedBid < bidAmount
        return this.bidService.placeBid(
          auctionId,
          bidderId,
          expectedBid,
          null,
          bidAmount
        );
      }
    } else {
      if (!highestMaxBid) {
        // sadece normal teklif gelmiş
        const expectedBidForInitial =
          highestInitialBid.initialBidAmount + auction.minIncrement;

        if (expectedBidForInitial > bidAmount) {
          throw new BadRequestError(
            `You cannot make a bid smaller than the minimum bid amount.`
          );
        } else if (highestInitialBid.bidderId === bidderId) {
          throw new BadRequestError(
            `You already have the highest bid, so you don't need to make an offer.`
          );
        } else if (expectedBidForInitial === bidAmount) {
          return this.bidService.placeBid(
            auctionId,
            bidderId,
            bidAmount,
            null,
            null
          );
        } else {
          return this.bidService.placeBid(
            auctionId,
            bidderId,
            expectedBidForInitial,
            null,
            bidAmount
          );
        }
      } else {
        // gizli bid var
        const expectedBidForInitial =
          highestInitialBid.initialBidAmount + auction.minIncrement;

        const expectedBidForCurrent = highestCurrentBid
          ? highestCurrentBid.currentBidAmount + auction.minIncrement
          : null;

        const expectedBidForMax = highestMaxBid
          ? highestMaxBid.maxBidAmount + auction.minIncrement
          : null;

        const bids = [
          {
            name: "initial",
            value: expectedBidForInitial,
            bidderId: highestInitialBid.bidderId,
          },
          {
            name: "current",
            value: expectedBidForCurrent,
            bidderId: highestCurrentBid ? highestCurrentBid.bidderId : null,
          },
          {
            name: "max",
            value: expectedBidForMax,
            bidderId: highestMaxBid ? highestMaxBid.bidderId : null,
          },
        ];

        const largestBid = bids.reduce(
          (max, bid) => {
            if (bid.value !== null) {
              if (bid.value > max.value) {
                return bid;
              } else if (bid.value === max.value) {
                return max.name === "max"
                  ? max
                  : bid.name === "max"
                  ? bid
                  : max;
              }
            }
            return max;
          },
          { name: null, value: -Infinity, bidderId: null }
        );

        if (largestBid?.bidderId === bidderId) {
          throw new BadRequestError(
            `You already have the highest bid, so you don't need to make an offer.`
          );
        }
        if (
          (largestBid.name === "initial" && largestBid.value > bidAmount) ||
          (largestBid.name === "current" && largestBid.value > bidAmount)
        ) {
          throw new BadRequestError(
            `You cannot make a bid smaller than the minimum bid amount.`
          );
        }

        if (largestBid.value <= bidAmount) {
          if (largestBid.value === bidAmount) {
            return this.bidService.placeBid(
              auctionId,
              bidderId,
              bidAmount,
              null,
              null
            );
          } else {
            return this.bidService.placeBid(
              auctionId,
              bidderId,
              largestBid.value,
              null,
              bidAmount
            );
          }
        }

        if (
          (highestMaxBid.maxBidAmount > bidAmount &&
            expectedBidForCurrent &&
            expectedBidForCurrent <= bidAmount) ||
          (highestMaxBid.maxBidAmount > bidAmount &&
            expectedBidForCurrent &&
            expectedBidForCurrent <= bidAmount) ||
          highestMaxBid.maxBidAmount === bidAmount ||
          (highestMaxBid.maxBidAmount > bidAmount &&
            !expectedBidForCurrent &&
            expectedBidForInitial <= bidAmount)
        ) {
          if (
            (highestInitialBid.initialBidAmount >
              highestCurrentBid.currentBidAmount ||
              !highestCurrentBid.currentBidAmount) &&
            highestInitialBid.initialBidAmount + auction.minIncrement >
              bidAmount
          ) {
            throw new BadRequestError(
              `You cannot make a bid smaller than the minimum bid amount.`
            );
          } else {
            // current et güncelle
            await this.bidService.updateCurrentAmountForBid(
              highestMaxBid.id,
              bidAmount
            );
            throw new BadRequestError(
              `It was placed before your bid amount. Please check the latest price.`
            );
          }
        }

        if (
          highestMaxBid.maxBidAmount < bidAmount &&
          expectedBidForCurrent &&
          expectedBidForCurrent <= bidAmount
        ) {
          if (expectedBidForMax < bidAmount) {
            return this.bidService.placeBid(
              auctionId,
              bidderId,
              expectedBidForMax,
              null,
              bidAmount
            );
          } else {
            return this.bidService.placeBid(
              auctionId,
              bidderId,
              bidAmount,
              null,
              null
            );
          }
        }

        if (
          highestCurrentBid &&
          highestCurrentBid.currentBidAmount >
            highestInitialBid.initialBidAmount &&
          expectedBidForCurrent > bidAmount
        ) {
          throw new BadRequestError(
            `You cannot make a bid smaller than the minimum bid amount.`
          );
        }
      }
    }

    throw new InternalServerError(
      `A situation occurred that could not be caught. Please contact support.`
    );
  }
}
