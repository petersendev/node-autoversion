export interface IOptions
{
    test?: string;
}

export interface IVersionInfo
{
    major: number;
    minor: number;
    patch: number;
    semver: string;
    informational?: string;
}