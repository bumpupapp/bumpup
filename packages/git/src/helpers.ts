import * as path from "https://deno.land/x/std@0.158.0/path/mod.ts";

export const createTag = (tagPrefix?: string, tag?: string) =>
  `${tagPrefix ? `${tagPrefix}-` : ``}${tag}`;

export const getGitSubmodulesDir = async (gitdir: string)=>{
    const stat =await Deno.stat(gitdir)
    if (stat.isFile) {
        const dotgit = await Deno.readTextFile(gitdir)
        gitdir = path.join(Deno.cwd(), dotgit.replace('gitdir: ','').replace('\r','').replace('\n',''))
    }
    return gitdir
}
