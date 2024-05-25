type IconType = 'fetch' | 'svg';

type IconSource = URL | string;

type IconSetup = {
    sourceType: IconType,
    source: IconSource
}

type IconConfig = {
    [key: string]: IconSetup
}

export type { IconConfig, IconType, IconSource, IconSetup };