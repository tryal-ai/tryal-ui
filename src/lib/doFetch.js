/**
 * This internal global fetch function is designed to act
 * as a fetch wrapper that catches global errors such as invalid/expired login
 * tokens and triggers events accordingly
 * @param {*} endpoint The target endpoint of the API to contact
 * @param {*} request The headers and body of the request
 */
async function globalFetch(endpoint, request) {
    const res = await fetch(endpoint, request);
    if (res.status != 200) {
        const err = await res.json();
        throw err;
    }
    return res;
}

/**
 * Acts as a fetch wrapper to fetch JSON from the specified endpoint
 * most endpoints return JSON on the server side (with the notable exceptions)
 * of the default endpoint (which returns the app) and the retrieve endpoints
 * which return copies of tryals
 * @param {*} endpoint The target endpoint for the request
 * @param {*} request The header and body of the request
 * @throws {*} Throws any JSON returned from the endpoint where the
 * status code is not 200
 */
export async function fetchJson(endpoint, request) {
    try {
        const res = await globalFetch(endpoint, request);
        const json = await res.json();
        // If the endpoint despatches a
        // new JSON token, plug it into the session
        if (json && json.sessionToken) {
            const newToken = json.sessionToken;
            localStorage.setItem('sessionToken', newToken);
            await sessionToken.set(newToken);
        }
        return json;
    } catch (err) {
        throw err;
    }
}

/**
 * The fetchBlob method is used almost exclusively for fetching the binary
 * data of the PDFs that are being delivered for the user to download
 * @param {*} endpoint The target endpoint of the request
 * @param {*} request The header and body of the request
 * @throws {*} Throws any JSON returned from the endpoint where the
 * status code is not 200
 */
export async function fetchBlob(endpoint, request) {
    try {
        const res = await globalFetch(endpoint, request);
        return await res.blob();
    } catch (err) {
        throw err;
    }
}
