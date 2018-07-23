import { AutoVersion } from "./auto-version";
import { IVersionInfo, IOptions } from "./interfaces";
export * from "./interfaces";

export async function autoversion(opts: IOptions): Promise<IVersionInfo>
{
    const autoVersion = new AutoVersion();

    return {
        major: 1,
        minor: 0,
        patch: 0,
        semver: "1.0.0"
    };
}