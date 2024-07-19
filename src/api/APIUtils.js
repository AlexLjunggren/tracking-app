const getDomain =() => {
    const properties = require('../properties/tracking-app.json');
    return properties.apiDomain;
};

export const get = async (path) => {
    const response = await fetch(getDomain() + path, {
        method: 'GET'
    });
    return await process(response);
};

export const postFormData = async (path, data) => {
    const response = await fetch(getDomain() + path, {
        method: 'POST',
        body: data
    });
    return await process(response);
};

export const postJSON = async (path, data) => {
    const response = await fetch(getDomain() + path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: data
    });
    return await process(response);
};

const process = async response => {
    return await new Promise(resolve => {
        const status = response.status;
        if (status === 204) {
            resolve({
                status: status
            });
            return;
        }
        response.json().then(json => resolve({
            status: status,
            json: json
        }));
    });
};

