import { IconConfig } from './types';

function faviconGetter(url: string, size: number = 32) {
    return `https://favicon.ahaigege.com/?url${url}=&sz=${size}`;
}

const iconsUri = {
    defaultIconUri: new URL('https://example.com/favicon.ico'),
    // genShinIconUri: new URL('https://genshin.hoyoverse.com/favicon.ico'),
    chinaLlmIconUri: new URL('https://img2.imgtp.com/2024/05/26/ydZZuCuw.png'),
    chatGptIconUri: new URL('https://img2.imgtp.com/2024/05/26/GNaF36io.png'),
}

const iconsSvg = {
    messageBoardIconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 20 20">
		<circle cx="10" cy="10" r="10" fill="white"/>
		<path fill="black" d="M17 2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7.414A2 2 0 0 0 6 12.586l-2 2V3a1 1 0 0 1 1-1zM5 1a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 7.414 13H17a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z"/>
		<path fill="black" d="M6 4.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M6 7a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 6 7m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
	</svg>`,
    nextChatIconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="currentColor" class="bi bi-bullseye" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8" fill="white"/>
        <path fill="black" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path fill="black" d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10m0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
        <path fill="black" d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8"/>
        <path fill="black" d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
    </svg>`,
}

// use prefix * to match all subdomains, use suffix * to match all paths
// always put more specific rules before more general rules
const iconConfig: IconConfig = {
    'v.ahaigege.com/favicon.ico': { sourceType: 'fetch', source: iconsUri.chatGptIconUri },
    'v.ahaigege.com/*': { sourceType: 'fetch', source: iconsUri.chatGptIconUri },
    'gpt.dofor.fun/favicon.ico': { sourceType: 'fetch', source: iconsUri.chinaLlmIconUri },
    'gpt.dofor.fun/*': { sourceType: 'fetch', source: iconsUri.chinaLlmIconUri },
    'next.dofor.fun/favicon.ico': { sourceType: 'svg', source: iconsSvg.nextChatIconSvg },
    'next.dofor.fun/*': { sourceType: 'svg', source: iconsSvg.nextChatIconSvg },
};

export { iconConfig, faviconGetter };