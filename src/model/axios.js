import axios from 'axios';

export async function post(url, params) {
  try {
    const result = await axios({
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: params
    });
    return result.data;
  } catch (err) {
    if (err.response && err.response.status && err.response.status === 403) {
      window.location.href = '/';
    }
    throw err;
  }
}

export async function gpost(url, params) {
  try {
    const result = await axios({
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/graphql'
      },
      data: params
    });
    
    return result.data.data;
  } catch (err) {
    if (err.response && err.response.status && err.response.status === 403) {
      window.location.href = '/';
    }
    throw err;
  }
}

export async function get(url) {
  try {
    const result = await axios({
      method: 'GET',
      url
    });
    return result.data;
  } catch (err) {
    if (err.response && err.response.status && err.response.status === 403) {
      window.location.href = '/';
    }
    throw err;
  }
}
