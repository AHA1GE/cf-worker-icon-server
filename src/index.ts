/**
 * This is a cloudflare worker. It should return favicon depending on the requested url.
 */

import { iconConfig, faviconGetter } from './config';
import { IconSetup } from './types';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const userVisitingUrl = new URL(request.url);
		const iconSetup = match(userVisitingUrl);
		if (!iconSetup) {
			// if not matched, leave the user request intact and proceed
			return fetch(request) as unknown as Response;
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
	// Get the hostname and pathname
	const hostname = url.hostname;
	const pathname = url.pathname;
	console.log('matching "' + hostname + pathname + '"');

	// If the URL has query, hash, or search params, it seems not for favicon, return undefined
	if (url.search || url.hash || url.searchParams.size) {
		console.log('URL has query, hash, or search params, it seems not for favicon, leave it intact');
		return undefined;
	} else {
		console.log('URL has no query, hash, or search params, continue');
	}

	// If the URL does not end with *icon.ico/*icon.png/*icon.svg , it seems not for favicon, return undefined
	if (!/\bicon\.(ico|png|svg)$/.test(pathname)) {
		console.log('URL does not end with ***icon.***, it seems not for favicon, leave it intact');
		return undefined;
	} else {
		console.log('URL ends with ***icon.***, continue');
	}

	// iconConfig uses prefix * to match all subdomains, use suffix * to match all paths
	// For example: *.example.com/* will match all subdomains and all paths of example.com
	// Match the URL with the iconConfig
	const matched = Object.entries(iconConfig).find(([pattern]) => {
		// Replace * with .*, and escape other special characters
		const regexPattern = `^${pattern.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`;
		const regex = new RegExp(regexPattern);
		console.log('matching "' + hostname + pathname + '" with pattern "' + regexPattern + '"')
		// Test if the hostname and pathname match the pattern
		return regex.test(hostname + pathname);
	});

	// Return the matched icon setup
	return matched ? matched[1] : undefined;
}