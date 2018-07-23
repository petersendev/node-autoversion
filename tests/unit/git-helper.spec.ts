import { GitHelper } from "./../../src/git-helper";
import { GitTestHelper } from "../../tests/helpers/git-test-helper";
import * as del from "del";
const cwd = process.cwd();

describe("the git helper", () =>
{
    let dir = null;

    afterEach(async () =>
    {
        process.chdir(cwd);
        if (dir)
        {
            try
            {
                await del(dir, { force: true });
            }
            finally
            {
                dir = null;
            }
        }
    });

    it("should get all commits if no HEAD", async () =>
    {
        dir = await GitTestHelper.createRepo();

        const expected = await GitTestHelper.commit("First", "Second");
        const actual = await GitHelper.getCommits();

        expect(actual).toEqual(expected);
    });

    it("should get all commits since HEAD", async () =>
    {

        dir = await GitTestHelper.createRepo();
        const expected = await GitTestHelper.commit("First", "Second", "Third");
        const actual = await GitHelper.getCommits(expected[expected.length - 1].hash);

        expect(actual).toHaveLength(2);
    });

    it("should get empty array if HEAD is last commit", async () =>
    {

        dir = await GitTestHelper.createRepo();
        const expected = await GitTestHelper.commit("First", "Second", "Third");
        const actual = await GitHelper.getCommits(expected[0].hash);

        expect(actual).toEqual([]);
    });

    it("should get empty array if there are no commits", async () =>
    {
        dir = await GitTestHelper.createRepo();
        const actual = await GitHelper.getCommits(undefined);

        expect(actual).toEqual([]);
    });

    it("should retrieve all tags", async () =>
    {
        dir = await GitTestHelper.createRepo();
        await GitTestHelper.commit("First", "Second");
        await GitTestHelper.tag("1.0.0");
        await GitTestHelper.commit("Third");
        await GitTestHelper.tag("1.1.0");
        await GitTestHelper.commit("Fourth", "Fifth");
        await GitTestHelper.tag("2.0.0");

        const tags = await GitHelper.getTags();
        expect(tags).toEqual(["1.0.0", "1.1.0", "2.0.0"]);
    });

    it("should show current branch", async () =>
    {
        dir = await GitTestHelper.createRepo();
        await GitTestHelper.commit("first");

        expect(await GitHelper.getBranch()).toBe("master");

        await GitTestHelper.checkout("feature/myFeat");
        expect(await GitHelper.getBranch()).toBe("feature/myFeat");

        await GitTestHelper.checkout("master", false);
        expect(await GitHelper.getBranch()).toBe("master");
    });
});