import { semver } from "../../../package_deps.ts";
import { BumpupFunction } from "../../common/mod.ts";
import {Logger} from "../../../Logger.ts";

export const determineIncrement: BumpupFunction = (options) => (data) => {
    const logger = new Logger(options.log)
    if (!("version" in data)) {
      logger.log('info',`version doesn't exist in data`);
      return data;
    }
    const newVersion = semver.increment(data.version, 'prerelease','beta') as string
    return {newVersion}
  };


