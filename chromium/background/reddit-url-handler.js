
chrome.storage.sync.set({ state: 'on' });

chrome.storage.onChanged.addListener(({ state }) => {
  const { newValue } = state;
  newValue === 'on' ? activateExtension() : deactivateExtension();
});

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
      await chrome.tabs.update(tabId, { url: createUrlWithDepthQueryString(url, 1) });
    } catch (err) {
      console.error(err);
    };
  };
};

const activateExtension = () => {
  console.log('ACTIVE');
  chrome.tabs.onUpdated.addListener(
    handleRedditThreadUrlChange,
  );
};

const deactivateExtension = () => {
  chrome.tabs.onUpdated.removeListener(
    handleRedditThreadUrlChange,
  );
};
