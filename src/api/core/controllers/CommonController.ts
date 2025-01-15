/*
* Orsettocommerce
* https://www.orsettocommerce.com
* Copyright (c) 2023  Orsettocommerce E-solutions Private Limited
* Author Orsettocommerce E-solutions Private Limited <support@orsettocommerce.com>
* Licensed under the MIT license.
*/

import 'reflect-metadata';
import { Get, JsonController, Res, QueryParam } from 'routing-controllers';
import { LanguageService } from '../../core/services/LanguageService';
import { Not } from 'typeorm';
import { IndustryService } from '../../core/services/IndustryService';
import { PluginService } from '../services/PluginService';
@JsonController('/list')
export class CommonController {
    constructor(
        private languageService: LanguageService,
        private pluginService: PluginService,
        private industryService: IndustryService
    ) {
        // --
    }

    // Language List API
    /**
     * @api {get} /api/list/language Language List API
     * @apiGroup Store List
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {Number} limit limit
     * @apiParam (Request body) {Number} offset offset
     * @apiParam (Request body) {String} keyword keyword
     * @apiParam (Request body) {Number} count count should be number or boolean
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "status": "1"
     *      "message": "Successfully got language list",
     *      "data":{
     *              "languageId": 1
     *              "name": ""
     *              "status": 1
     *              "code": ""
     *              "sortOrder": 1,
     *              "image": "",
     *              "imagePath": ""
     *      }
     * }
     * @apiSampleRequest /api/list/language
     * @apiErrorExample {json} Language error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/language')
    public async languageList(@QueryParam('limit') limit: number, @QueryParam('offset') offset: number, @QueryParam('keyword') keyword: string, @QueryParam('count') count: number | boolean, @QueryParam('defaultLanguage') defaultLanguage: number, @Res() response: any): Promise<any> {
        const select = ['languageId', 'name', 'code', 'image', 'imagePath', 'isActive', 'sortOrder', 'isActive', 'createdDate', 'modifiedDate'];
        const search = [
            {
                name: 'name',
                op: 'like',
                value: keyword,
            },
            {
                name: 'isActive',
                op: 'where',
                value: 1,
            },
        ];
        const WhereConditions = [];

        if (defaultLanguage) {
            WhereConditions.push(
                {
                    name: 'languageId',
                    value: Not(defaultLanguage),
                }
            );
        }

        const languageList = await this.languageService.list(limit, offset, select, search, WhereConditions, count);
        if (languageList) {
            const successResponse: any = {
                status: 1,
                message: 'successfully got the complete language list',
                data: languageList,
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'unable to show language list',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // Plugin list
    /**
     * @api /api/list/addons Plugin List
     * @apiGroup Store
     * @apiParam (Request Body) {number} limit limit
     * @apiParam (Request Body) {number} offset offset
     * @apiParam (Request Body) {number} count count
     * @apiSuccessExample {json} success
     * HTTP/1.1 200 Ok
     * {
     *      "status": "1",
     *      "message": "Successfully get the plugin list. ",
     *      "data": {
     *      "status": ,
     *      "additionalInfo": {
     *           "clientId": "",
     *           "clientSecret": "",
     *           "defaultRoute": "",
     *           "isTest": ""
     *       }
     *   }
     *  }
     * }
     * @apiSampleRequest /api/list/addons
     * @apiErrorExample {json} Error
     * HTTP/1.1 500 Internal server error
     */

    @Get('/addons')
    public async PluginList(@QueryParam('limit') limit: number, @QueryParam('offset') offset: number, @QueryParam('count') count: number | boolean, @Res() response: any): Promise<any> {
        const pluginList = await this.pluginService.pluginList(limit, offset, count);
        if (!pluginList) {
            const errorMessage = {
                status: 0,
                message: 'Unable to get the plugin list',
            };
            return response.status(400).send(errorMessage);
        }
        const values = {};
        for (const value of pluginList) {
            values[value.slugName] = {
                status: value.pluginStatus,
                additionalInfo: value.pluginAdditionalInfo ? JSON.parse(value.pluginAdditionalInfo) : {},
            };
        }
        return response.status(200).send({ status: 1, message: 'Successfully get the list', data: values });
    }

    // Industry list
    /**
     * @api /api/list/industry Industry List
     * @apiGroup Store
     * @apiSuccessExample {json} success
     * HTTP/1.1 200 Ok
     * {
     *      "status": "1",
     *      "message": "Successfully Got Industry List..!",
     *      "data": {
     *              "id": "",
     *              "name": "",
     *              "slug": """,
     *              "isActive": "",
     *              "isDelete": ""
     *              }
     * }
     * @apiSampleRequest /api/list/industry
     * @apiErrorExample {json} Error
     * HTTP/1.1 500 Internal server error
     */
    @Get('/industry')
    public async industryList(@Res() response: any): Promise<any> {
        const industryList = await this.industryService.findAll({
            order: {
                createdDate: 'DESC',
            },
        });
        return response.status(200).send({
            status: 1,
            message: `Successfully got industry list`,
            data: industryList,
        });
    }
}
