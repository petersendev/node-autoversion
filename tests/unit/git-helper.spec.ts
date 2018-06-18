import { GitHelper } from "./../../src/git-helper";
import { GitTestHelper } from "../../tests/helpers/git-test-helper";
import * as del from "del";
const cwd = process.cwd();

describe("the git helper", () =>
{
    let dir = null;

    afterEach(() =>
    {
        process.chdir(cwd);
        if (dir)
        {
            del(dir);
        }
    });

    it("should retrieve the expected commits", async () =>
    {
        dir = await GitTestHelper.createRepo();

        const expected = await GitTestHelper.doCommits("First", "Second");
        const actual = await GitHelper.getCommits();

        expect(actual).toEqual(expected);
    });
});