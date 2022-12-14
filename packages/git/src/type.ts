import { BumpupData, BumpupOptions } from "../../common/mod.ts";
import {
  ConventionalChangelogCommit,
  fs,
  git,
  log,
  match,
  parser,
  toConventionalChangelogFormat,
} from "../deps.ts";
import { createTag ,getGitSubmodulesDir} from "./helpers.ts";
import { CommitObject } from "./types.ts";

export default (options: BumpupOptions) => async (data: BumpupData) => {
  const commits = await getCommits(
    createTag(options.tagPrefix as string, data.version),
  );
  return { ...data, type: determineType(commits) };
};

export const determineType = (
  commits: Pick<CommitObject, "message">[],
): CommitType => {
  const messages = commits.map((c) => c.message).map(parseCommitMessage);
  log.debug(`messages: ${JSON.stringify(messages)}`);
  const commitTypes = messages.map(getCommitType);
  log.debug(`commitTypes: ${commitTypes}`);
  const type = determineHighestCommitType(commitTypes);
  log.info(`type is ${type}`);
  return type;
};

export const getCommits = async (until: string): Promise<CommitObject[]> => {
    const gitdir = await getGitSubmodulesDir('.git')
    const dir = Deno.cwd()
  //@ts-ignore: remove
  const tagOid = await git.resolveRef({ fs, dir, gitdir, ref: until });
  //@ts-ignore: remove
  const tagCommit = await git.readCommit({ fs, dir, gitdir, oid: tagOid });
  //@ts-ignore: remove
  const commits = await git.log({ fs, dir, gitdir });
  //@ts-ignore: remove
  const position = commits.map((c) => c.oid).indexOf(tagCommit.oid);
  //@ts-ignore: remove
  return commits.slice(0, position).map((c) => c.commit);
};

export const parseCommitMessage = (
  message: string,
): Pick<ConventionalChangelogCommit, "notes" | "type"> => {
  try {
    const ast = parser(message);
    return toConventionalChangelogFormat(ast);
  } catch (_) {
    return {
      type: "",
      notes: [],
    };
  }
};

export type CommitType = "major" | "minor" | "patch" | "none";

export const getCommitType = (
  message: Pick<ConventionalChangelogCommit, "notes" | "type">,
): CommitType =>
  match([
    [
      message.notes.map((note) => note.title).includes("BREAKING CHANGE"),
      "major",
    ],
    [message.type === "fix", "patch"],
    [message.type === "feat", "minor"],
    [true, "none"],
  ]);

export const determineHighestCommitType = (types: CommitType[]): CommitType =>
  types.reduce((acc, cur) =>
    match([
      [acc === "none", cur],
      [acc === "patch" && cur !== "none", cur],
      [acc === "minor" && cur === "major", cur],
      [acc === "major", acc],
      [true, acc],
    ]), "none");
