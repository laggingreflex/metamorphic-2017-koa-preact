import { merge } from 'lodash';

export const apiHost = process.env.API_HOST;

export default ({
  apiHost = process.env.API_HOST,
  defaults = {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
  },
  fetch = self.fetch,
} = {}) => async(path, body, opts = {}) => {
  path = '//' + apiHost + path;
  let response, responseError;
  if (body) {
    try {
      body = JSON.stringify(body);
    } catch (error) {
      console.warn(error);
    }
  }
  try {
    response = await fetch(path, merge({
      body
    }, defaults, {
      method: body ? 'post' : 'get',
    }, opts));
  } catch (error) {
    responseError = `Couldn't fetch response from URL <${path}> Error: ${error.message}`;
  }

  let text, textError;
  try {
    text = await response.text();
  } catch (error) {
    textError = `Couldn't extract text response. Error: ${error.message}`;
  }

  let json, jsonError;
  try {
    json = JSON.parse(text);
  } catch (error) {
    // jsonError = `Couldn't parse text response as JSON. Error: ${error.message}. Text: ${text}`; // not too helpful this
    jsonError = `${response && response.status} ${text}`;
  }

  const finalError = responseError || textError || jsonError || `${response && response.status} ${text}`;
  if (response && response.ok) {
    if (json) {
      return json;
    } else {
      return { error: finalError, body: text };
    }
  } else if (json) {
    if (json.error) {
      return json;
    } else {
      return { error: finalError, body: json };
    }
  } else {
    return { error: finalError, body: text };
  }
};
