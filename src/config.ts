import { IconConfig } from './types';

function faviconGetter(url: string, size: number = 32) {
    return `https://favicon.ahaigege.com/?url${url}=&sz=${size}`;
}

const iconsUri = {
    defaultIconUri: new URL('https://ysun.site/favicon.ico'),
    genShinIconUri: new URL('https://genshin.hoyoverse.com/favicon.ico'),
    ChinaLlmIconUri: new URL('https://www.gov.cn/favicon.ico'),
}

const iconsSvg = {
    messageBoardIconSvg: ``,
    lobeChatIconSvg: ``,
    nextChatIconSvg: ``,
}

// use prefix * to match all subdomains, use suffix * to match all paths
// always put more specific rules before more general rules
const iconConfig: IconConfig = {
    'ahaigege.com': { sourceType: 'fetch', source: iconsUri.defaultIconUri },
    'wwww.ahaigege.com': { sourceType: 'fetch', source: iconsUri.defaultIconUri },
    'v.ahaigege.com': { sourceType: 'svg', source: iconsSvg.lobeChatIconSvg },
    'aha1.top': { sourceType: 'fetch', source: iconsUri.defaultIconUri },
    'www.aha1.top': { sourceType: 'fetch', source: iconsUri.defaultIconUri },
    'gi.aha1.top': { sourceType: 'fetch', source: iconsUri.genShinIconUri },
    'mb.aha1.top': { sourceType: 'svg', source: iconsSvg.messageBoardIconSvg },
    'gayshit.aha1.top': { sourceType: 'fetch', source: iconsUri.genShinIconUri },
    'dofor.fun': { sourceType: 'fetch', source: iconsUri.defaultIconUri },
    'www.dofor.fun': { sourceType: 'fetch', source: iconsUri.defaultIconUri },
    'gpt.dofor.fun': { sourceType: 'fetch', source: iconsUri.ChinaLlmIconUri },
    'next.dofor.fun': { sourceType: 'svg', source: iconsSvg.nextChatIconSvg },
};

export { iconConfig, faviconGetter };