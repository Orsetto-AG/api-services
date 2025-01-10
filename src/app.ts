import "reflect-metadata";
import * as moment from "moment-timezone";
import { bootstrapMicroframework } from "microframework-w3tec";
import { banner } from "./lib/banner";
import { Logger } from "./lib/logger";
import { eventDispatchLoader } from "./loaders/eventDispatchLoader";
import { expressLoader } from "./loaders/expressLoader";
import { homeLoader } from "./loaders/homeLoader";
import { iocLoader } from "./loaders/iocLoader";
import { monitorLoader } from "./loaders/monitorLoader";
import { publicLoader } from "./loaders/publicLoader";
import { typeormLoader } from "./loaders/typeormLoader";
import { winstonLoader } from "./loaders/winstonLoader";
import { swaggerLoader } from "./loaders/swaggerLoader";
import { pluginLoader } from "./loaders/pluginLoader";
moment.tz.setDefault("Etc/UTC");
process.env.TZ = "UTC";

const log = new Logger(__filename);

bootstrapMicroframework({
  loaders: [
    winstonLoader,
    iocLoader,
    eventDispatchLoader,
    typeormLoader,
    pluginLoader,
    expressLoader,
    swaggerLoader,
    monitorLoader,
    homeLoader,
    publicLoader,
    // orsettoConnectLoader,
  ],
})
  .then(() => banner(log))
  .catch((error) => log.error("Application is crashed: " + error));
