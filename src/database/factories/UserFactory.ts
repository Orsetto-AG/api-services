/*
 * orsettocommerce API
 * version 2.0.0
 * http://api.orsettocommerce.com
 *
 * Copyright (c) 2020 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../../api/core/models/User';
define(User, (faker: typeof Faker, settings: { role: string []}) => {
    const user = new User();
    return user;
});
