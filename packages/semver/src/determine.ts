import { semver } from "../../../package_deps.ts";
import { BumpupFunction } from "../../common/mod.ts";
import {Logger} from "../../../Logger.ts";

const determine: BumpupFunction = (options) => (data) => {
    const logger = new Logger(options.log)
    if (!("version" in data)) {
      logger.log('info',`version doesn't exist in data`);
      return data;
    }
    if (!("type" in data)) {
        logger.log('info',`type doesn't exist in data`);
      return data;
    }
    if (data.type === "none") {
        logger.log('debug',"type was none, therefore newVersion = version");
      return {newVersion: data.version }
    }
    const releaseIdentifier = options.pre ? `pre${data.type}` : data.type;
    const newVersion = semver.increment(data.version, releaseIdentifier,options.preid) as string
    return {newVersion}
  };

export default determine;
