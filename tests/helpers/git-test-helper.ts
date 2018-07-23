import * as fileUrl from "file-url";
import * as tempy from "tempy";
import * as execa from "execa";
import * as getStream from "get-stream";
import * as gitLogParser from "git-log-parser";
import * as pReduce from "p-reduce";

export class GitTestHelper
{
    static async createRepo(branch: string = "master")
    {
        const dir = tempy.directory();

        process.chdir(dir);
        await execa("git", ["init"]);
        await execa("git", ["config", "user.email", "none@localhost"]);
        await execa("git", ["config", "user.name", "unit_test"]);
        await GitTestHelper.checkout(branch);

        return dir;
    }

    static async checkout(branch: string, create: boolean = true)
    {
        await execa('git', create ? ['checkout', '-b', branch] : ['checkout', branch]);
    }

    static async commit(...messages: string[])
    {
        await pReduce(
            messages,
            async (commits, msg) =>
            {
                const stdout = await execa.stdout('git', ['commit', '-m', msg, '--allow-empty', '--no-gpg-sign']);
                const [, hash] = /^\[(?:\w+)\(?.*?\)?(\w+)\] .+(?:\n|$)/.exec(stdout);
                commits.push(hash);
                return commits;
            },
            []
        );
        return (await GitTestHelper.getCommits()).slice(0, messages.length);
    }

    static async tag(tagName: string, sha?: string)
    {
        await execa('git', sha ? ['tag', '-f', tagName, sha] : ['tag', tagName]);
    }

    // redundant implementation to test against if the actual implementation changes
    static async getCommits(from?: string)
    {
        Object.assign(gitLogParser.fields, { hash: 'H', message: 'B', gitTags: 'd', committerDate: { key: 'ci', type: Date } });
        return (await getStream.array(gitLogParser.parse({ _: `${from ? from + '..' : ''}HEAD` }))).map((commit: any) =>
        {
            commit.message = commit.message.trim();
            commit.gitTags = commit.gitTags.trim();
            return commit;
        });
    }
}