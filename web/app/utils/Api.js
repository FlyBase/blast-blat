
import Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

function parseJSON(response) {
  return response.json();
}

export default function request(url, body) {
    console.debug("BLAST API called.");
    console.debug(url);
    console.debug(body);
    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(checkStatus)
    .then(parseJSON)
    .then( (data) =>  ( {data} ))
    .catch( (err) => ( {err} ));
}
