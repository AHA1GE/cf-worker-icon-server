/**
 * This is a cloudflare worker. It should return favicon depending on the requested url.
 */

import { iconConfig, faviconGetter } from './config';
import { IconConfig, IconSetup } from './types';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const userRequest = new URL(request.url);
		const iconSetup = match(userRequest);
		if (!iconSetup) {
			return new Response('No icon setup found', { status: 404 });
		} else if (iconSetup.sourceType === 'svg') {
			return returnSvgIcon(iconSetup.source as string);
		} else if (iconSetup.sourceType === 'fetch') {
			return returnFetchIcon(iconSetup.source as URL);
		}
		return new Response('placeholder');
	},
};

async function returnSvgIcon(svg: string) {
	// new headers, set content type to image/svg+xml, and cache control to static 1 year
	const headers = new Headers();
	headers.set('Content-Type', 'image/svg+xml');
	headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	// return response with svg content
	return new Response(svg, { headers });
}

async function returnFetchIcon(url: URL) {
	// fetch the icon from the url
	const iconResponse = await fetch(url.toString());
	try {
		// check if the response is ok first
		if (!iconResponse.ok) {
			throw new Error('Failed to fetch icon');
		}
		// check if the response is an image then
		const contentType = iconResponse.headers.get('Content-Type');
		if (!contentType || !contentType.startsWith('image/')) {
			throw new Error('Invalid icon type');
		}
		// clone headers, set cache control to static 1 year
		const headers = new Headers(iconResponse.headers);
		headers.set('Cache-Control', 'public, max-age=31536000, immutable');
		// convert the response body to a Uint8Array
		const body = await iconResponse.arrayBuffer();
		// return response with the icon content
		return new Response(body, { headers });
	} catch (error) {
		// if any error occurs, return 307 to faviconGetter
		return Response.redirect(faviconGetter(url.toString()), 307);
	}
}

/**
 * Match the url with the iconConfig, return the matched icon setup
 */
function match(url: URL): IconSetup | undefined {
	const { hostname } = url;
	const keys = Object.keys(iconConfig);
	// find the first matched key
	const matchedKey = keys.find(key => {
		if (key.startsWith('*') && key.endsWith('*')) {
			return hostname.includes(key.slice(1, -1));
		} else if (key.startsWith('*')) {
			return hostname.endsWith(key.slice(1));
		} else if (key.endsWith('*')) {
			return hostname.startsWith(key.slice(0, -1));
		} else {
			return hostname === key;
		}
	});
	// return the matched icon setup
	return matchedKey ? iconConfig[matchedKey] : undefined;

}