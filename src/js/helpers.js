import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = seconds => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(`Request took too long. Timeout after ${seconds} seconds`);
    }, seconds * 1000);
  });
};

export const requestHelper = async (
  url,
  method = 'GET',
  jsonData = undefined
) => {
  try {
    const apiCall =
      method === 'POST'
        ? fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
          })
        : fetch(url);
    const res = await Promise.race([apiCall, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};
