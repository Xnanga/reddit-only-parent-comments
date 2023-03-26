"use: strict";

// const REDDIT_HOST_PATTERN = '*://*.reddit.com/*';

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
      await browser.tabs.update(tabId, { url: createUrlWithDepthQueryString(url, 1) });
    } catch (err) {
      console.error(err);
    };
  };
};

const activateExtension = () => {
  browser.tabs.onUpdated.addListener(
    handleRedditThreadUrlChange,
  
    // Filters not yet supported in Chrome as of 26/03/23
    // { urls: [REDDIT_HOST_PATTERN], properties: ['url'] },
  );
};

const deactivateExtension = () => {
  browser.tabs.onUpdated.removeListener(
    handleRedditThreadUrlChange,
  );
};

browser.storage.sync.set({ state: 'on' });

browser.storage.onChanged.addListener(({ state }) => {
  const { newValue } = state;
  newValue === 'on' ? activateExtension() : deactivateExtension();
});
