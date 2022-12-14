import { assertEquals, describe, it } from "../../../dev_deps.ts";
import {
  CommitType,
  determineHighestCommitType,
  determineType,
  getCommitType,
  parseCommitMessage,
} from "./type.ts";

describe("getCommitType", () => {
  it("for a message with BREAKING CHANGE returns major", () => {
    const actual = getCommitType({
      type: "feat",
      notes: [{ title: "BREAKING CHANGE", text: "" }],
    });
    const expected = "major";

    assertEquals(actual, expected);
  });
  it("for a message with feat returns minor", () => {
    const actual = getCommitType({ type: "feat", notes: [] });
    const expected = "minor";

    assertEquals(actual, expected);
  });
  it("for a message with fix returns patch", () => {
    const actual = getCommitType({ type: "fix", notes: [] });
    const expected = "patch";

    assertEquals(actual, expected);
  });
  it("for a message without type returns none", () => {
    const actual = getCommitType({ type: "", notes: [] });
    const expected = "none";

    assertEquals(actual, expected);
  });
});

describe("parseCommitMessage", () => {
  it("parses fix messages", () => {
    const message = `
                fix(read write): Add name to read and write
                Signed-off-by: Daniel Richter <danielrichter@posteo.de>`;

    assertEquals(parseCommitMessage(message).type, "fix");
  });

  it("parses feat messages", () => {
    const message = `
                feat(write): Rename write.js to writer.js
                Signed-off-by: Daniel Richter <danielrichter@posteo.de>`;
    assertEquals(parseCommitMessage(message).type, "feat");
  });

  it("parses a non parsable messages", () => {
    const message = `Merge branch 'main' of github.com:danielr1996/bumpup`;
    assertEquals(parseCommitMessage(message).type, "");
  });
  it("parses BREAKING CHANGE messages", () => {
    const message = `feat(parser): add support for scopes

BREAKING CHANGE: test`;
    const result = parseCommitMessage(message);
    assertEquals(result.type, "feat");
    assertEquals(result.notes.map((note) => note.title), ["BREAKING CHANGE"]);
  });
});

describe("getCommitType", () => {
  it("recognizes patch changes", () => {
    const commitMessage = { type: "fix", notes: [] };
    assertEquals(getCommitType(commitMessage), "patch");
  });
  it("recognizes minor changes", () => {
    const commitMessage = { type: "feat", notes: [] };
    assertEquals(getCommitType(commitMessage), "minor");
  });
  it("recognizes breaking changes", () => {
    const commitMessage = {
      type: "fix",
      notes: [{ title: "BREAKING CHANGE", text: "" }],
    };
    assertEquals(getCommitType(commitMessage), "major");
  });
  it("recognizes no changes", () => {
    const commitMessage = { type: "", notes: [] };
    assertEquals(getCommitType(commitMessage), "none");
  });
});

describe("determineHighestCommitType", () => {
  it("determines patch", () => {
    const types: CommitType[] = ["none", "none", "patch"];
    assertEquals(determineHighestCommitType(types), "patch");
  });
  it("determines minor", () => {
    const types: CommitType[] = ["none", "minor", "patch"];
    assertEquals(determineHighestCommitType(types), "minor");
  });
  it("determines major", () => {
    const types: CommitType[] = ["major", "minor", "patch"];
    assertEquals(determineHighestCommitType(types), "major");
  });
  it("tests all branches", () => {
    const types: CommitType[] = ["patch", "minor"];
    assertEquals(determineHighestCommitType(types), "minor");
  });
});

describe("determineType", () => {
  it("", () => {
    const commits = [
      { message: `fix: recompile with new dependencies` },
      { message: `ci(gh-actions): display test results in pull requests` },
      { message: `doc: add pull request template` },
      { message: `doc: add pull request template` },
      { message: `doc: add contribution guidelines` },
      { message: `doc: add code of conduct` },
      { message: `chore(github): add issues templates` },
      { message: `chore(release): release version 1.0.1` },
    ];
    assertEquals(determineType(commits), "patch");
  });
});
