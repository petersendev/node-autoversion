import * as getStream from "get-stream";
import * as gitLogParser from "git-log-parser";

export class GitHelper
{
    static async getCommits(gitHead?: string, branch: string = "master")
    {
        Object.assign(gitLogParser.fields, { hash: "H", message: "B", gitTags: "d", committerDate: { key: "ci", type: Date } });
        const commits = (await getStream.array(gitLogParser.parse({ _: `${gitHead ? gitHead + ".." : ""}HEAD` }))).map(
            (commit: any) =>
            {
                commit.message = commit.message.trim();
                commit.gitTags = commit.gitTags.trim();
                return commit;
            }
        );
        return commits;
    }
}