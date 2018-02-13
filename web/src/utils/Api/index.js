
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

export function request(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(body)
  })
    .then(checkStatus)
    .then(parseJSON)
    .then( (data) =>  ( {data} ));
}

export function fetchResults() {
  return fetch('/api/blast/job/list', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(checkStatus)
    .then(parseJSON)
    .then( (data) =>  ( {data} ));
}

export function deleteResult(id) {
  return fetch('/api/blast/job/delete/' + encodeURIComponent(id), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(checkStatus)
    .then(parseJSON)
    .then( (data) =>  ( {data} ));
}

export function fetchReport(id) {
  // 15 is JSON format.
  return fetch('/api/blast/job/results/' + encodeURIComponent(id) + '?format=15', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(checkStatus)
    .then(parseJSON)
    .then( (data) =>  ( {data} ));
}
