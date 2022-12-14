import {createTag, getGitSubmodulesDir} from "./helpers.ts";
import { BumpupData, BumpupOptions } from "../../common/mod.ts";
import { fs, git, log } from "../deps.ts";
export default (options: BumpupOptions) => async (data: BumpupData) => {
  if (options.dry) {
    log.info(`not bumping because --dry was specified`);
  } else {
    if (data.newVersion === data.version) {
      log.warning(`not bumping because newVersion === version`);
      return data;
    }
    //@ts-ignore: remove
    const tag = createTag(options.tagPrefix, data.newVersion);
    log.debug(`tag: ${tag}`);
    const gitdir = await getGitSubmodulesDir('.git')
    //@ts-ignore: remove
    await git.annotatedTag({
      fs,
      //@ts-ignore: remove
      tagger: options.author,
      dir: Deno.cwd(),
      gitdir,
      ref: tag,
    });
  }

  return data;
};
