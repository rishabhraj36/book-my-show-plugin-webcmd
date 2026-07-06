// bookmyshow search — search movies across BookMyShow.
//
// Uses the same SSR movie listing data as the movies command, then filters by
// title. This avoids BookMyShow's suggest endpoint drift while keeping the
// command focused on movie search.
import { cli, Strategy } from '@agentrhq/webcmd/registry';
import { EmptyResultError } from '@agentrhq/webcmd/errors';
import {
    BMS_BASE, bmsDiscoverPage, buildProvenance,
    extractMovieCards, filterMovieCards,
    requireBoundedInt, requireString, validateCity,
} from './utils.mjs';

cli({
    site: 'bookmyshow',
    name: 'search',
    access: 'read',
    description: 'Search currently showing BookMyShow movies in a city',
    domain: 'in.bookmyshow.com',
    strategy: Strategy.COOKIE,
    browser: true,
    args: [
        { name: 'query', positional: true, type: 'string', required: true, help: 'Movie title search term' },
        { name: 'city', type: 'string', default: 'mumbai', help: 'City slug for regional results (e.g. mumbai, delhi-ncr)' },
        { name: 'language', type: 'string', default: '', help: 'Optional language filter (e.g. hindi, english, tamil)' },
        { name: 'limit', type: 'int', default: 20, help: 'Max rows to return (1-50)' },
    ],
    columns: [
        'rank', 'eventCode', 'title', 'language', 'genre',
        'certification', 'sourceUrl', 'fetchedAt', 'url',
    ],
    func: async (page, args) => {
        const query = requireString(args.query, 'query');
        const city = validateCity(args.city);
        const language = String(args.language ?? '').trim();
        const limit = requireBoundedInt(args.limit, 20, 1, 50, 'limit');

        const pageUrl = `${BMS_BASE}/explore/movies-${city}`;
        const data = await bmsDiscoverPage(page, pageUrl, `bookmyshow search "${query}" ${city}`);
        const results = filterMovieCards(extractMovieCards(data), { query, language });

        if (results.length === 0) {
            throw new EmptyResultError(
                'bookmyshow search',
                `No movies found for "${query}" in ${city}${language ? ` and language "${language}"` : ''}.`,
            );
        }

        const provenance = buildProvenance(pageUrl);
        return results.slice(0, limit).map((item, i) => {
            return {
                rank: i + 1,
                eventCode: item.eventCode,
                title: item.title,
                language: item.language,
                genre: item.genre,
                certification: item.certification,
                ...provenance,
                url: item.url || `${BMS_BASE}/${city}/movies`,
            };
        });
    },
});
