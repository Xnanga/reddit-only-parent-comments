"use: strict";

const REDDIT_HOST_PATTERN = '*://*.reddit.com/*';

const createUrlWithDepthQueryString = (url, depthNum) => `${url}?depth=${depthNum}`;

const validateRedditUrl = (url) => {
  if (!url) return false;

  const isReddit = url.includes('.reddit.com/');
  const isSubreddit = url.includes('/r/');
  const isThread = url.includes('/comments/');
  const isNotSingleComment = !url.includes('/comment/');
  const doesNotHaveDepthQuery = !url.includes('?depth=');

  return isReddit && isSubreddit && isThread && doesNotHaveDepthQuery && isNotSingleComment;
};

const handleRedditThreadUrlChange = async (tabId, { url }) => {
  if (!url) return;

  const isValidRedditThreadUrl = validateRedditUrl(url);

  if (isValidRedditThreadUrl) {
    try {
      await browser.tabs.update(tabId, { url: createUrlWithDepthQueryString(url, 1), loadReplace: true });
    } catch (err) {
      console.error(err);
    }
  };
};

const determineStartupState = async () => {
  try {
    const { state } = await browser.storage.sync.get('state');
    if (state === 'off' || !state) deactivateExtension();
    else activateExtension();
  } catch (err) {
    console.error(err);
  }
};

const activateExtension = () => {
  browser.tabs.onUpdated.addListener(
    handleRedditThreadUrlChange,
    { urls: [REDDIT_HOST_PATTERN], properties: ['url'] },
  );
};

const deactivateExtension = () => {
  browser.tabs.onUpdated.removeListener(
    handleRedditThreadUrlChange,
  );
};

determineStartupState();

browser.storage.onChanged.addListener(({ state }) => {
  const { newValue } = state;
  newValue === 'on' ? activateExtension() : deactivateExtension();
});
