export class GitTestHelper
{
    static async createRepo()
    {
        console.log("create repo");
    }

    static async commit(...commits: string[])
    {
        console.log(commits);
    }
}