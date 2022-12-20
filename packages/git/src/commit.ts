import { BumpupData } from "../../common/mod.ts";
import { fs, git } from "../deps.ts";
import {getGitSubmodulesDir} from "./helpers.ts";

export default (options: {author: {email: string, name: string}}) => async (data: BumpupData) => {
  if (data.newVersion !== data.version) {
    const gitdir = await getGitSubmodulesDir('.git')
    await git.add({ fs,dir: Deno.cwd(), filepath: '.' });
    //@ts-ignore: broken typings
    await git.commit({
      fs,
      author: options.author,
      dir: Deno.cwd(),
      message: `chore: release version ${data.newVersion}`,
      gitdir,
    });
  }
  return data;
};

