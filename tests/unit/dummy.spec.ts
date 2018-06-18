import { GitHelper } from './../../src/git-helper';
import { GitTestHelper } from "../helpers/git-test-helper";


describe("dummy spec", () =>
{
    it("should do what I want", async () =>
    {
        await GitTestHelper.createRepo();
        const expected = await GitTestHelper.commit("First", "Second");

        const actual = await GitHelper.getCommits();

        expect(actual).toEqual(expected);

    });
});