import { fetchJson } from '../doFetch';
import { makePublicRequest } from '../requests';

export async function getPaper() {
    const result = await fetchJson('http://localhost:2000/generate', makePublicRequest('post', {
        email: 'blank',
        board: 'edexcel',
        level: 'foundation',
        web: true,
    }));
    return result;
}