(() => {
  const REMOTE_FETCH_MESSAGE_TYPE = 'wonderfut_remote_fetch';

  function isValidFetchPayload(payload) {
    return payload && typeof payload.url === 'string' && payload.url.length > 0;
  }

  function handleRemoteFetchMessage(message, sendResponse) {
    if (!isValidFetchPayload(message?.payload)) {
      sendResponse({
        ok: false,
        error: 'Invalid remote fetch payload',
      });
      return false;
    }

    const { url, options } = message.payload;
    fetch(url, options || {})
      .then(async (response) => {
        const bodyText = await response.text();
        sendResponse({
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          body: bodyText,
        });
      })
      .catch((error) => {
        sendResponse({
          ok: false,
          error: error?.message || String(error),
        });
      });
    return true;
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || message.type !== REMOTE_FETCH_MESSAGE_TYPE) {
      return false;
    }
    return handleRemoteFetchMessage(message, sendResponse);
  });
})();
