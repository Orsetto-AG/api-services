import "reflect-metadata";
import {
  Post,
  Body,
  JsonController,
  Res,
  Req,
  Authorized,
  Get,
  QueryParam,
  Put,
  BodyParam,
  BadRequestError,
  InternalServerError,
} from "routing-controllers";
import { instanceToPlain } from "class-transformer";
import { MAILService } from "../../../auth/mail.services";
import { RegisterRequest } from "./requests/RegisterRequest";
import { Customer } from "../../core/models/Customer";
import { LoginLog } from "../../core/models/LoginLog";
import { CustomerService } from "../../core/services/CustomerService";
import { VendorService } from "../../core/services/VendorService";
import { LoginLogService } from "../../core/services/LoginLogService";
import { EmailTemplateService } from "../../core/services/EmailTemplateService";
import { CustomerLoginRequest } from "./requests/CustomerLoginRequest";
import jwt from "jsonwebtoken";
import { env } from "../../../env";
import { SettingService } from "../../core/services/SettingService";
import { CurrencyService } from "../../core/services/CurrencyService";
import { AccessToken } from "../../core/models/AccessTokenModel";
import { AccessTokenService } from "../../core/services/AccessTokenService";
import moment from "moment";
import { getVendorProfile } from "@orsettocommerce/marketplace";
import { getConnection } from "typeorm";
import { Vendor } from "../../core/models/Vendor";
import { MailChangeRequest } from "./requests/MailChangeRequest";
import { CheckDisplayNameRequest } from "./requests/CheckDisplayNameRequest";
import { RegistrationOtp } from "../../../common/entities-index";
import { VendorMediaService } from "../../core/services/VendorMediaService";
import { RegistrationOtpService } from "../../core/services/RegistrationOtpService";
import { UserService } from "../../core/services/UserService";
import { OtpValidationRequest } from "./requests/OtpValidationRequest";
import { ResetPasswordRequest } from "./requests/ResetPasswordRequest";

@JsonController("/customer")
export class StoreCustomerController {
  constructor(
    private customerService: CustomerService,
    private vendorService: VendorService,
    private emailTemplateService: EmailTemplateService,
    private loginLogService: LoginLogService,
    private settingService: SettingService,
    private currencyService: CurrencyService,
    private accessTokenService: AccessTokenService,
    private vendorMediaService: VendorMediaService,
    private registrationOtpService: RegistrationOtpService,
    private userService: UserService
  ) {}

  private async sendOtp(emailId: string, isCompany: boolean): Promise<number> {
    const userType = isCompany ? 2 : 1;
    const customer = await this.customerService.findOne({
      where: { email: emailId, deleteFlag: 0, isActive: 1 },
    });
    if (customer) {
      const vendor = await this.vendorService.findOne({
        where: { customerId: customer.id, isDelete: 0, isActive: 1 },
      });
      if (vendor) {
        throw new BadRequestError("Account already exist.Please login.");
      }
    }
    const otp = await this.registrationOtpService.findOne({
      where: { emailId, userType: userType },
    });
    if (otp) {
      await this.registrationOtpService.delete(otp.id);
    }

    const random: number = Math.floor(Math.random() * 900000) + 100000;

    const newUserOtp = new RegistrationOtp();
    newUserOtp.emailId = emailId;
    newUserOtp.userType = userType;
    newUserOtp.otp = random;
    newUserOtp.createdDate = moment()
      .add(24, "h")
      .format("YYYY-MM-DD HH:mm:ss");
    const createUserOTP = await this.registrationOtpService.create(newUserOtp);
    // send mail
    const logo = await this.settingService.findOne();
    const findEmailTemplate: any = await this.emailTemplateService.findOne({
      where: { title: "otp", isActive: 1 },
    });
    const templateDate = findEmailTemplate.content
      .replace("{3}", createUserOTP.otp)
      .replace("{appName}", logo.siteName)
      .replace("{type}", isCompany ? "Company" : "Customer")
      .replace("{type}", isCompany ? "Company" : "Customer")
      .replace("{siteName}", logo.siteName)
      .replace("{duration}", 24);
    const mailContent: any = {};
    // split base url
    mailContent.loginOTP = random;
    mailContent.logo = logo;
    mailContent.productInfo = [];
    mailContent.baseUrl = env.baseUrl;
    mailContent.emailContent = templateDate;
    mailContent.productDetailData = undefined;
    mailContent.redirectUrl = env.vendorRedirectUrl;
    mailContent.templateName = "emailTemplates.ejs";
    const mailSubject = findEmailTemplate.subject.replace(
      "{siteName}",
      logo.siteName
    );
    MAILService.sendMail(mailContent, emailId, mailSubject, false, false, "");

    if (createUserOTP) {
      return random;
    } else {
      throw new InternalServerError("Failed to send the OTP please try again.");
    }
  }

  // Customer Register API
  /**
   * @api {Post} /api/customer/register Register API
   * @apiGroup Customer
   * @apiParam (Request body) {String{8..128}} password Customer Password
   * @apiParam (Request body) {String{..96}} emailId Vendor Email Id
   * @apiParam (Request body) {Boolean} isCompany Customer or Company
   *
   *
   * @apiSampleRequest /api/customer/register
   * @apiErrorExample {json} Customer Register error
   * HTTP/1.1 500 Internal Server Error
   */
  // Customer Register Function
  @Post("/register")
  public async register(
    @Body({ validate: true }) registerParam: RegisterRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    // Email Validation
    const resultUser = await this.customerService.findOne({
      where: {
        email: registerParam.emailId,
        deleteFlag: 0,
      },
    });

    const logo = await this.settingService.findOne();
    if (resultUser) {
      // user exist in system
      if (!resultUser?.isActive) {
        // user not active otp process

        const otp = await this.registrationOtpService.findOne({
          where: {
            emailId: registerParam.emailId,
            userType: registerParam.isCompany ? 2 : 1,
          },
        });
        if (otp) {
          if (moment().isAfter(moment(otp.createdDate))) {
            //expired
            const failedResponse: any = {
              status: 1,
              message:
                "Your OTP verification period has expired. We have sent you a new e-mail, please verify the OTP.",
            };
            await this.registrationOtpService.delete(otp.id);
            await this.sendOtp(
              registerParam.emailId,
              registerParam.isCompany ?? false
            );
            return response.status(400).send(failedResponse);
          } else {
            const failedResponse: any = {
              status: 0,
              message:
                "Your OTP has not expired yet. Please enter the code sent to your e-mail in the specified field.",
            };
            return response.status(400).send(failedResponse);
          }
        }
      }
      const failedResponse: any = {
        status: 0,
        message: "You have already registered please login",
      };
      return response.status(400).send(failedResponse);
    } else {
      //create a customer
      const setting = await this.settingService.findOne();
      const newCustomer = new Customer();
      newCustomer.firstName = "";
      newCustomer.lastName = "";
      newCustomer.username = registerParam.emailId;
      newCustomer.email = registerParam.emailId;
      newCustomer.isActive = 0;
      newCustomer.isCompleted = false;
      newCustomer.isCompany = registerParam.isCompany;
      newCustomer.deleteFlag = 0;
      newCustomer.siteId = setting.settingsId;
      const customerPassword = await Customer.hashPassword(
        registerParam.password
      );
      newCustomer.password = customerPassword;
      const saveCustomer = await this.customerService.create(newCustomer);

      //sign up message for customer or company
      const notMandateEmail = await this.emailTemplateService.findOne(56);
      const notMadateContent = notMandateEmail.content
        .replace("{email}", registerParam.emailId)
        .replace("{siteName}", logo.siteName)
        .replace(
          "{userType}",
          registerParam.isCompany ? "Company" : "Customer"
        );
      const notMandateVenMailContents: any = {};
      notMandateVenMailContents.logo = logo;
      const redirectUrl1 = env.vendorRedirectUrl;
      notMandateVenMailContents.emailContent = notMadateContent;
      notMandateVenMailContents.redirectUrl = redirectUrl1;
      notMandateVenMailContents.productDetailData = undefined;
      MAILService.sendMail(
        notMandateVenMailContents,
        registerParam.emailId,
        notMandateEmail.subject
          .replace("{siteName}", logo.siteName)
          .replace(
            "{userType}",
            registerParam.isCompany ? "Company" : "Customer"
          ),
        false,
        false,
        ""
      );

      //new register process message for admins
      const emailContentAdmins = await this.emailTemplateService.findOne(12);
      const adminIds: any = [];
      const adminUsers = await this.userService.findAll({
        select: ["username"],
        where: { userGroupId: 1, deleteFlag: 0 },
      });
      for (const user of adminUsers) {
        const val = user.username;
        adminIds.push(val);
      }
      let userTypeMsg: string | undefined;
      if (registerParam.isCompany) {
        userTypeMsg = "A company registration has been made.";
      } else {
        userTypeMsg = "A customer registration has been made.";
      }
      const admincusMessages = emailContentAdmins.content
        .replace("{userType}", userTypeMsg)
        .replace("{name}", "Admin")
        .replace("{email}", registerParam.emailId)
        .replace("{siteName}", logo.siteName)
        .replace("{siteName}", logo.siteName);
      const adminRedirectUrls = env.adminRedirectUrl;
      const mailContentss: any = {};
      mailContentss.logo = logo;
      mailContentss.emailContent = admincusMessages;
      mailContentss.redirectUrl = adminRedirectUrls;
      mailContentss.productDetailData = undefined;
      MAILService.sendMail(
        mailContentss,
        adminIds,
        emailContentAdmins.subject.replace("{email}", registerParam.emailId),
        false,
        false,
        ""
      );

      //send otp message for customer mail
      await this.sendOtp(
        registerParam.emailId,
        registerParam.isCompany ?? false
      );

      return response.status(200).send({
        status: saveCustomer.status ?? 1,
        message: `Thank you for showing your interest and registering with ${logo.storeName} to both sell and purchase products.`,
        data: {
          ...saveCustomer,
          password: "",
        },
      });
    }
  }

  // Customer OTP Validation API
  /**
   * @api {Post} /api/customer/otp-validation  OTP Validation API
   * @apiGroup Customer
   * @apiParam (Request body) {String{..96}} emailId Vendor Email Id
   * @apiParam (Request body) {Number} otp otp
   *
   * @apiSampleRequest /api/customer/otp-validation
   * @apiErrorExample {json} Customer OTP Validation error
   * HTTP/1.1 500 Internal Server Error
   */
  // Customer OTP Validation Function
  @Post("/otp-validation")
  public async otpValidation(
    @Body({ validate: true }) otpValidationParam: OtpValidationRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    // Email Validation
    const resultUser = await this.customerService.findOne({
      where: {
        email: otpValidationParam.emailId,
        deleteFlag: 0,
      },
    });

    const otpInfo = await this.registrationOtpService.findOne({
      where: {
        emailId: otpValidationParam.emailId,
      },
    });

    if (resultUser) {
      // user exist in system
      if (!resultUser?.isActive) {
        // user not active otp process

        if (otpInfo) {
          if (moment().isAfter(moment(otpInfo.createdDate))) {
            //expired
            const failedResponse: any = {
              status: 0,
              message:
                "Your OTP verification period has expired. We have sent you a new e-mail, please verify the OTP.",
            };
            await this.registrationOtpService.delete(otpInfo.id);
            await this.sendOtp(
              otpValidationParam.emailId,
              resultUser.isCompany ?? false
            );
            return response.status(400).send(failedResponse);
          } else {
            // exist

            if (otpInfo.otp === otpValidationParam.otp) {
              // success
              await this.registrationOtpService.delete(otpInfo.id);

              resultUser.isActive = 1;
              const updateUserData = await this.customerService.update(
                resultUser.id,
                resultUser
              );

              if (updateUserData) {
                const successResponse: any = {
                  status: 1,
                  message:
                    "Your account has been successfully activated, please log in.",
                };
                return response.status(200).send(successResponse);
              } else {
                await this.sendOtp(
                  otpValidationParam.emailId,
                  resultUser.isCompany ?? false
                );
                throw new InternalServerError(
                  "A technical error occurred, please try again."
                );
              }
            } else {
              const failedResponse: any = {
                status: 0,
                message: "Your OTP numbers do not match. Try again.",
              };
              return response.status(400).send(failedResponse);
            }
          }
        }
      } else {
        const successResponse: any = {
          status: 1,
          message: "You have already registered please login",
        };
        return response.status(400).send(successResponse);
      }
    } else {
      return response.status(404).send({
        status: 0,
        message: `Customer or Company not found.`,
      });
    }
  }

  // Login API
  /**
   * @api {Post} /api/customer/login Login API
   * @apiGroup Customer
   * @apiParam (Request body) {String} emailId User Email Id
   * @apiParam (Request body) {String} password User Password
   * @apiParamExample {json} Input
   * {
   *      "emailId" : "",
   *      "password" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *        "data": "{
   *         "token":'',
   *         "user": {
   *          "id": 1,
   *          "firstName": "",
   *          "email": "",
   *          "mobileNumber": "",
   *          "avatar": "",
   *          "avatarPath": "",
   *          "vendorId": 1,
   *          "vendorPrefixId": 1,
   *          "currencyCode": "",
   *          "currencySymbolLeft": "",
   *          "currencySymbolRight": "",
   *          "lastName": "",
   *          "username": ""
   *             }
   *                }
   *                 }
   *              }",
   *        "message": "Successfully loggedIn",
   *        "status": "1"
   *         }
   * @apiSampleRequest /api/customer/login
   * @apiErrorExample {json} Login error
   * HTTP/1.1 500 Internal Server Error
   */
  // Login Function
  @Post("/login")
  public async login(
    @Body({ validate: true }) loginParam: CustomerLoginRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const resultData = await this.customerService.findOne({
      select: [
        "id",
        "firstName",
        "email",
        "mobileNumber",
        "password",
        "avatar",
        "avatarPath",
        "isActive",
        "isCompany",
      ],
      where: { email: loginParam.emailId },
    });
    if (!resultData?.isActive) {
      const errorUserNameResponse: any = {
        status: 0,
        message: "Please completed OTP step.",
      };
      return response.status(400).send(errorUserNameResponse);
    }
    if (resultData === undefined) {
      const notFountResponse: any = {
        status: 0,
        message: "Invalid Username",
        data: 1,
      };
      return response.status(400).send(notFountResponse);
    }

    const setting = await this.settingService.findOne();
    if (setting) {
      const currencyVal = await this.currencyService.findOne(
        setting.storeCurrencyId
      );
      if (currencyVal) {
        resultData.currencyCode = currencyVal.code;
        resultData.currencySymbolLeft = currencyVal.symbolLeft;
        resultData.currencySymbolRight = currencyVal.symbolRight;
      }
    }

    if (await Customer.comparePassword(resultData, loginParam.password)) {
      // create a token
      const token = jwt.sign(
        { id: resultData.id, role: "customer" },
        env.jwtSecret,
        {
          expiresIn: env.jwtExpiryTime.toString(),
        }
      );
      const loginLog = new LoginLog();
      loginLog.customerId = resultData.id;
      loginLog.emailId = resultData.email;
      loginLog.firstName = resultData.firstName;
      loginLog.ipAddress = (
        request.headers["x-forwarded-for"] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress
      ).split(",")[0];
      const savedloginLog = await this.loginLogService.create(loginLog);
      const customer = await this.customerService.findOne({
        where: { email: loginParam.emailId, deleteFlag: 0 },
      });
      customer.lastLogin = savedloginLog.createdDate;
      await this.customerService.create(customer);
      const Crypto = require("crypto-js");
      const ciphertextToken = Crypto.AES.encrypt(
        token,
        env.cryptoSecret
      ).toString();
      if (token) {
        const newToken = new AccessToken();
        newToken.userId = resultData.id;
        newToken.token = token;
        newToken.userType = "customer";
        await this.accessTokenService.create(newToken);
      }
      resultData.email = "";
      resultData.firstName = "";
      resultData.lastName = "";
      resultData.mobileNumber = "";
      resultData.username = "";
      const successResponse: any = {
        status: 1,
        message: "Logged In successfully",
        data: {
          token: ciphertextToken,
          user: instanceToPlain(resultData),
        },
      };
      return response.status(200).send(successResponse);
    }
    const errorResponse: any = {
      status: 0,
      message: "Wrong Password",
      data: 2,
    };
    return response.status(400).send(errorResponse);
  }

  // Get vendor profile API
  /**
   * @api {Get} /api/customer/vendor-profile Vendor Get Profile  API
   * @apiGroup  Vendor
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "status": "1"
   *  "message": "successfully got Vendor profile.",
   *  "data": {
   *   "createdBy": 1,
   *   "createdDate": "",
   *   "modifiedBy": 1,
   *   "modifiedDate": "",
   *   "vendorId": 1,
   *   "vendorPrefixId": 1,
   *   "customerId": 1,
   *   "vendorGroupId": 1,
   *   "commission": "",
   *   "industryId": 1,
   *   "contactPersonName": "",
   *   "vendorSlugName": "",
   *   "designation": "",
   *   "companyName": "",
   *   "companyLocation": "",
   *   "companyAddress1": "",
   *   "companyAddress2": "",
   *   "companyCity": "",
   *   "companyState": "",
   *   "zoneId": 1,
   *   "companyCountryId": 1,
   *   "pincode": "",
   *   "companyDescription": "",
   *   "companyMobileNumber": "",
   *   "companyEmailId": 1,
   *   "companyWebsite": "",
   *   "companyTaxNumber": "",
   *   "companyPanNumber": "",
   *   "companyLogo": "",
   *   "companyLogoPath": "",
   *   "paymentInformation": "",
   *   "verification": {
   *       "email": "",
   *       "policy": "",
   *       "category": "",
   *       "decision": "",
   *       "document": "",
   *       "storeFront": "",
   *       "bankAccount": "",
   *       "paymentInfo": "",
   *       "companyDetail": "",
   *       "deliveryMethod": "",
   *       "subscriptionPlan": "",
   *       "distributionPoint": ""
   *    },
   *    "verificationComment": [],
   *    "verificationDetailComment": [],
   *    "bankAccount": {
   *       "bic": "",
   *       "ifsc": "",
   *       "branch": "",
   *       "bankName": "",
   *       "accountNumber": "",
   *       "accountCreatedOn": ""
   *     },
   *    "approvalFlag": "",
   *    "approvedBy": "",
   *    "approvalDate": "",
   *    "companyCoverImage": "",
   *    "companyCoverImagePath": "",
   *    "displayNameUrl": "",
   *    "instagram": "",
   *    "twitter": "",
   *    "youtube": "",
   *    "facebook": "",
   *    "whatsapp": "",
   *    "bankName": "",
   *    "bankAccountNumber": "",
   *    "accountHolderName": "",
   *    "ifscCode": "",
   *    "businessSegment": "",
   *    "businessType": "",
   *    "mailOtp": "",
   *    "loginOtpExpireTime": "",
   *    "businessNumber": "",
   *    "preferredShippingMethod": "",
   *    "capabilities": [
   *       {
   *           "data": "",
   *           "status": 1
   *       }
   *       ],
   *    "vendorDescription": "",
   *    "isEmailVerify": "",
   *    "customerDetail": {
   *       "firstName": "",
   *       "lastName": "",
   *       "email": "",
   *       "mobileNumber": "",
   *       "avatar": "",
   *       "avatarPath": "",
   *       "isActive": 1,
   *       "dob": "",
   *       "gender": ""
   *    },
   *    "countryName": "",
   *    "vendorCategories": [],
   *    "vendorMedia": [
   *       {
   *           "createdBy": 1,
   *           "createdDate": "",
   *           "modifiedBy": 1,
   *           "modifiedDate": "",
   *           "id": 1,
   *           "vendorId": 1,
   *           "fileName": "",
   *           "filePath": "",
   *           "mediaType": "",
   *           "defaultImage": "",
   *           "videoType": "",
   *           "sortOrder": "",
   *           "showHomePage": "",
   *           "url": "",
   *           "title": "",
   *           "isActive": 1,
   *           "isDelete": 1
   *         },
   * }
   * @apiSampleRequest /api/customer/vendor-profile
   * @apiErrorExample {json} vendor error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/vendor-profile")
  @Authorized("vendor-unapproved")
  public async vendorDetails(
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const vendorDetail = await getVendorProfile(getConnection(), {
      vendorId: request.user.vendorId,
    });
    const customerInfo = await this.customerService.findOne({
      where: { id: vendorDetail.data.customerId },
    });
    vendorDetail.data.customerDetail.dob = customerInfo?.dob ?? "";
    vendorDetail.data.customerDetail.gender = customerInfo?.gender ?? "";
    const vendorMedia = await this.vendorMediaService.findAll({
      where: { vendorId: request.user.vendorId },
    });
    vendorDetail.data.vendorMedia = vendorMedia;
    const successResponse: any = {
      status: 1,
      message: "successfully got seller profile",
      data: vendorDetail.data,
    };
    return response.status(200).send(successResponse);
  }

  // Change Password API
  /**
   * @api {Put} /api/customer/change-password Change Password API
   * @apiGroup Customer
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} oldPassword User oldPassword
   * @apiParam (Request body) {String} newPassword User newPassword
   * @apiParamExample {json} Input
   * {
   *      "newPassword" : "",
   *      "oldPassword" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Your password changed successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/customer/change-password
   * @apiErrorExample {json} changePassword error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/change-password")
  @Authorized("customer")
  public async changePassword(
    @BodyParam("newPassword") newPassword: string,
    @BodyParam("oldPassword") oldPassword: string,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const resultData = await this.customerService.findOne({
      where: { id: request.user.id },
    });
    if (!resultData) {
      const errResponse: any = {
        status: 0,
        message: "Customer or Company not found.",
      };
      return response.status(404).send(errResponse);
    }
    if (await Customer.comparePassword(resultData, oldPassword)) {
      const val = await Customer.comparePassword(resultData, newPassword);
      if (val) {
        const errResponse: any = {
          status: 0,
          message: "Existing password and New password should not match",
        };
        return response.status(400).send(errResponse);
      }
      const pattern =
        /^(?=.*?[A-Z])(?=.*?[a-z])((?=.*?[0-9])|(?=.*?[#?!@$%^&*-])).{8,128}$/;
      if (!newPassword.match(pattern)) {
        const passwordValidatingMessage = [];
        passwordValidatingMessage.push(
          "Password must contain at least one number or one symbol and one uppercase and lowercase letter, and at least 8 and at most 128 characters"
        );
        const errResponse: any = {
          status: 0,
          message:
            "You have an error in your request's body. Check 'errors' field for more details",
          data: { message: passwordValidatingMessage },
        };
        return response.status(422).send(errResponse);
      }
      resultData.password = await Customer.hashPassword(newPassword);
      const updateUserData = await this.customerService.update(
        resultData.id,
        resultData
      );
      if (updateUserData) {
        const successResponse: any = {
          status: 1,
          message: "Your password changed successfully",
        };
        return response.status(200).send(successResponse);
      }
    }
    const errorResponse: any = {
      status: 0,
      message: "Your old password is wrong",
    };
    return response.status(400).send(errorResponse);
  }

  public base64MimeType(encoded: string): string {
    let result = undefined;

    if (typeof encoded !== "string") {
      return result;
    }

    const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

    if (mime && mime.length) {
      result = mime[1];
    }

    return result;
  }
  // forget password link
  /**
   * @api {put} /api/customer/forgot-password-link Forgot Password Link API
   * @apiGroup Customer
   * @apiParam (Request body) {String} email User email
   * @apiParamExample {json} Input
   * {
   *      "emailId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully",
   *      "status": "1",
   *      "data": ""
   * }
   * @apiSampleRequest /api/customer/forgot-password-link
   * @apiErrorExample {json} store b2b error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/forgot-password-link")
  public async forgetPasswordLink(
    @BodyParam("emailId") emailId: string,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const customer = await this.customerService.findOne({
      where: { email: emailId, deleteFlag: 0 },
    });
    if (!customer) {
      const errResponse: any = {
        status: 0,
        message:
          "Invalid Email! The email you have entered is not registered with us",
      };
      return response.status(400).send(errResponse);
    }
    const Crypto = require("crypto-js");
    const val = Crypto.AES.encrypt(customer.email, env.cryptoSecret).toString();
    const encryptedKey = Buffer.from(val).toString("base64");
    customer.forgetPasswordKey = encryptedKey;
    customer.linkExpires = moment()
      .add(60, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");
    await this.customerService.update(customer.id, customer);
    const emailContent = await this.emailTemplateService.findOne(23);
    const logo = await this.settingService.findOne();
    const redirectUrl = env.vendorForgetPasswordLink + "?token=" + encryptedKey;

    const message = emailContent.content
      .replace("{name}", customer.firstName || customer.email)
      .replace("{link}", redirectUrl);
    const mailContents: any = {};
    mailContents.logo = logo;
    mailContents.emailContent = message;
    mailContents.redirectUrl = env.vendorRedirectUrl;
    mailContents.productDetailData = "";

    MAILService.sendMail(
      mailContents,
      customer.email,
      emailContent.subject,
      false,
      false,
      ""
    );

    const successResponse: any = {
      status: 1,
      message: "Reset Password link has been sent to your email inbox.",
    };

    return response.status(200).send(successResponse);
  }
  // forget password key check
  /**
   * @api {Get} /api/customer/forgot-password-key-check Forgot Password Key check API
   * @apiGroup Customer
   * @apiParam (Request body) {String} encryptedKey key
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Valid key",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/customer/forgot-password-key-check/:key
   * @apiErrorExample {json} keyCheck error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/forgot-password-key-check")
  public async keyCheck(
    @QueryParam("key") encryptedKey: string,
    @Res() response: any
  ): Promise<any> {
    const Crypto = require("crypto-js");
    const bytes = Crypto.AES.decrypt(
      Buffer.from(encryptedKey, "base64").toString("ascii"),
      env.cryptoSecret
    );
    const decodedTokenKey = bytes.toString(Crypto.enc.Utf8);
    const customer = await this.customerService.findOne({
      where: {
        email: decodedTokenKey,
        deleteFlag: 0,
        forgetPasswordKey: encryptedKey,
      },
    });
    if (!customer) {
      const errResponse: any = {
        status: 3,
        message: "Invalid key. please try again",
      };
      return response.status(200).send(errResponse);
    }
    if (
      moment(customer.linkExpires).format("YYYY-MM-DD HH:mm:ss") <
      moment().format("YYYY-MM-DD HH:mm:ss")
    ) {
      const expirationError: any = {
        status: 2,
        message: "Your forgot password link got expired, try again",
      };
      return response.status(200).send(expirationError);
    }
    if (customer.forgetPasswordKey !== "") {
      const successResponse: any = {
        status: 1,
        message: "Valid key",
      };
      return response.status(200).send(successResponse);
    } else {
      const successResponse: any = {
        status: 3,
        message: "This link has been used already. please try a different one",
      };
      return response.status(200).send(successResponse);
    }
  }
  // reset password
  /**
   * @api {Put} /api/customer/reset-password  Reset Password API
   * @apiGroup Customer
   * @apiParam (Request body) {String} newPassword  newPassword
   * @apiParam (Request body) {String} key  key
   * @apiParamExample {json} Input
   * {
   *      "key": "",
   *      "newPassword" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Your has been password changed successfully",
   *      "status": "1",
   *      "data": ""
   * }
   * @apiSampleRequest /api/customer/reset-password
   * @apiErrorExample {json} resetPassword error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/reset-password")
  public async resetPassword(
    @Body({ validate: true }) resetPasswordParam: ResetPasswordRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    if (!resetPasswordParam?.key) {
      const keyError: any = {
        status: 0,
        message: "Key is missing",
      };
      return response.status(400).send(keyError);
    }
    const Crypto = require("crypto-js");
    const bytes = Crypto.AES.decrypt(
      Buffer.from(resetPasswordParam.key, "base64").toString("ascii"),
      env.cryptoSecret
    );
    const decodedTokenKey = bytes.toString(Crypto.enc.Utf8);
    console.log(decodedTokenKey + "decodedTokenKey");
    const resultData = await this.customerService.findOne({
      select: [
        "id",
        "firstName",
        "email",
        "mobileNumber",
        "password",
        "avatar",
        "avatarPath",
        "isActive",
        "forgetPasswordKey",
        "linkExpires",
      ],
      where: { email: decodedTokenKey, deleteFlag: 0 },
    });
    if (!resultData?.forgetPasswordKey) {
      const errorResponse: any = {
        status: 0,
        message: "Key is used",
      };
      return response.status(400).send(errorResponse);
    }
    resultData.password = await Customer.hashPassword(
      resetPasswordParam.newPassword
    );
    resultData.forgetPasswordKey = "";
    resultData.linkExpires = null;
    const updateUserData = await this.customerService.update(
      resultData.id,
      resultData
    );
    if (updateUserData) {
      const successResponse: any = {
        status: 1,
        message: "Your has been password changed successfully",
        data: resultData.email,
      };
      return response.status(200).send(successResponse);
    }
  }
  // Logout API
  /**
   * @api {Post} /api/customer/logout Log Out API
   * @apiGroup Customer
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully logout",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/customer/logout
   * @apiErrorExample {json} Logout error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/logout")
  @Authorized("vendor-unapproved")
  public async logout(@Req() request: any, @Res() response: any): Promise<any> {
    const token =
      request.headers.authorization.split(" ")[0] === "Bearer"
        ? request.headers.authorization.split(" ")[1]
        : "";
    if (!token) {
      const successResponseBeforeToken: any = {
        status: 1,
        message: "Successfully Logout",
      };
      return response.status(200).send(successResponseBeforeToken);
    }
    const Crypto = require("crypto-js");
    const bytes = Crypto.AES.decrypt(token, env.cryptoSecret);
    const originalEncryptedString = bytes.toString(Crypto.enc.Utf8);
    const user = await this.accessTokenService.findOne({
      where: {
        token: originalEncryptedString,
      },
    });
    if (!user) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid token",
      };
      return response.status(400).send(errorResponse);
    }
    const deleteToken = await this.accessTokenService.delete(user);
    if (!deleteToken) {
      const successResponse: any = {
        status: 1,
        message: "Successfully Logout",
      };
      return response.status(200).send(successResponse);
    }
  }

  // Change mail API
  /**
   * @api {Put} /api/customer/mail/link Change mail API
   * @apiGroup Customer
   * @apiHeader {String} Authorization
   * @apiParam (Request Body) {String} emailId emailId
   * @apiParam (Request Body) {String} password password
   * @apiSuccessExample {json} success
   * HTTP/1.1 200 Ok
   * {
   *      "status": "1",
   *      "message": "Email Send Successfuly.",
   * }
   * @apiSampleRequest /api/customer/mail/link
   * @apiErrorExample {json} ChangeMail Error
   * HTTP/1.1 500 Internal server error
   */

  // change mail
  @Put("/mail/link")
  @Authorized("vendor-unapproved")
  public async ChangeMail(
    @Body({ validate: true }) mailChangeParam: MailChangeRequest,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const customer = request.user.customer;
    const checkMail = await this.customerService.findOne({
      where: { email: mailChangeParam.emailId },
    });
    if (checkMail) {
      return response.status(400).send({
        status: 0,
        message: "Given Email Address Already Exist",
      });
    }
    const customerPassword = mailChangeParam.password;
    const decodedPassword = await Customer.comparePassword(
      customer,
      customerPassword
    );
    if (!decodedPassword) {
      return response.status(400).send({
        status: 0,
        message: "Invalid Password",
      });
    }
    const crypto = require("crypto");
    const createOtp = crypto.randomInt(100000, 900000);
    const updateCustomer = new Vendor();
    updateCustomer.mailOtp = createOtp;
    updateCustomer.loginOtpExpireTime = moment()
      .add(3, "h")
      .format("YYYY-MM-DD HH:mm:ss");
    const otpStore = await this.vendorService.update(
      request.user.vendorId,
      updateCustomer
    );
    if (!otpStore) {
      return response.status(400).send({
        status: 1,
        message: "Email Send Failed",
      });
    }
    const logo = await this.settingService.findOne();
    const findEmailTemplate: any = await this.emailTemplateService.findOne({
      where: { title: "change_mail", isActive: 1 },
    });
    const templateDate = findEmailTemplate.content
      .replace(
        "{name}",
        customer.firstName + " " + customer.lastName ? customer.lastName : ""
      )
      .replace("{otp}", createOtp)
      .replace("{companyName}", logo.businessName);
    const mailContent: any = {};
    mailContent.productInfo = [];
    mailContent.logo = logo;
    mailContent.baseUrl = env.baseUrl;
    mailContent.emailContent = templateDate;
    mailContent.productDetailData = undefined;
    mailContent.redirectUrl = env.vendorRedirectUrl;
    mailContent.templateName = "emailTemplates.ejs";
    const mailSubject = findEmailTemplate.subject;
    MAILService.sendMail(
      mailContent,
      mailChangeParam.emailId,
      mailSubject,
      false,
      false,
      ""
    );
    return response.status(200).send({
      status: 1,
      message: "Email Send Successfuly",
    });
  }

  // Check Vendor Display Name API
  /**
   * @api {Post} /api/customer/check-display-name-url Check Vendor Display Name API
   * @apiGroup Admin vendor
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {Number} vendorId
   * @apiParam (Request body) {String} displayNameURL  Display Name / URL
   * @apiParamExample {json} Input
   * {
   *      "vendorId": 1,
   *      "displayNameURL" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "status": "1"
   *      "message": "Display name is available",
   * }
   * @apiSampleRequest /api/customer/check-display-name-url
   * @apiErrorExample {json}checkDisplayNameURLadmin vendor error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/check-display-name-url")
  @Authorized("vendor-unapproved")
  public async checkDisplayNameURL(
    @Body({ validate: true }) checkname: CheckDisplayNameRequest,
    @Res() response: any
  ): Promise<any> {
    const name = checkname.displayNameURL
      .replace(/\s+/g, "-")
      .replace(/[&\/\\@#,+()$~%.'":*?<>{}]/g, "")
      .toLowerCase();
    if (checkname.vendorId) {
      const checkVendor = await this.vendorService.findOne({
        where: {
          vendorId: checkname.vendorId,
        },
      });
      if (!checkVendor) {
        const errorResponse: any = {
          status: 0,
          message: "Invalid seller",
        };
        return response.status(400).send(errorResponse);
      }
      const isExist = await this.vendorService.validateDisplayUrlName(
        name,
        1,
        checkname.vendorId
      );
      if (isExist) {
        return response.status(400).send({
          status: 0,
          message: "Display name already exists",
        });
      } else {
        return response.status(200).send({
          status: 1,
          message: "Display name available",
        });
      }
    } else {
      const isExist = await this.vendorService.validateDisplayUrlName(
        name,
        0,
        0
      );
      if (isExist) {
        const errorResponse: any = {
          status: 0,
          message: "Display name already exists",
        };
        return response.status(400).send(errorResponse);
      } else {
        const successResponse: any = {
          status: 1,
          message: "Display name available",
        };
        return response.status(200).send(successResponse);
      }
    }
  }
}
