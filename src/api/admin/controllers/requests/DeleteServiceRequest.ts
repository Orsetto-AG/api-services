/*
 * orsettocommerce API
 * version 0.0.1
 * http://api.orsettocommerce.com
 *
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class DeleteService {

    @IsNotEmpty()
    public serviceId: [];
}
