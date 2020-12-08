/**
 * Used the generate a public header to send to the API
 * whilst the server will ignore unnecessary tokens, it seems
 * prudent not to dispatch tokens unless necessary
 * @param {*} method The method to use (e.g. POST/GET)
 * @param {Object} data The body of the request as a JSON
 * @return {Object} The correctly formatted and prepared header
 */
export const makePublicRequest = (method, data) => ({
    method,
    mode: 'cors',
    redirect: 'manual',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
});
