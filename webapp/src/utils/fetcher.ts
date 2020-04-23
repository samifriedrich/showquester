import fetch from 'isomorphic-unfetch'

function fetcher(...args: [RequestInfo, RequestInit | undefined]) {
  return fetch(...args).then((response: Response) => response.json());
}

export function POST(uri: RequestInfo, postData?: any) {
  if (postData.body) {
    postData.body = JSON.stringify(postData.body);
  }

  return fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...postData
  })
  .then((response: Response) => {
    if (!response.ok) { throw response; }
    return response.json();
  })
  .catch((error: Error) => {
    throw error;
  });
}

export default fetcher;
