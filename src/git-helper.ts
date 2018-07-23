import * as getStream from "get-stream";
import * as gitLogParser from "git-log-parser";
import * as execa from "execa";

export class GitHelper
{
    static async getCommits(gitHead?: string)
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
    
    static async getCommitsInBranch(branch?: string)
    {

    }

    static async getTags()
    {
        const res = await execa.stdout("git", ["tag"]);
        return (res)
            .split("\n")
            .map(tag => tag.trim())
            .filter(tag => Boolean(tag));
    }

    static async getBranch()
    {
        return await execa.stdout("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    }

    static async getHead()
    {
        return await execa.stdout("git", ["rev-parse", "HEAD"]);
    }
}