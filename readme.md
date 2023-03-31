# Reddit Only Child Comments

A small lightweight browser extension which automatically hides child comments in Reddit threads.

One of the best aspects of Reddit is discussion, however, sometimes you just want to see direct responses to the original poster. This extension makes use of Reddit's depth query parameter to make threads only display the first level of comments.

**Before**

![Reddit thread with the extension inactive showing child comments](/reddit-thread-extension-inactive.jpg)

**After**

![Reddit thread with the extension active showing only parent comments](/reddit-thread-extension-active.jpg)

## Notes

- This extension has seperate codebases for Firefox and Chromium browsers. The reason being that [Chrome is deprecating manifest v2 and migrating to manifest v3 in 2023](https://developer.chrome.com/docs/extensions/migrating/mv2-sunset/). While Firefox still has some incompatibility issues with manifest v3, the chromium version of this extension will be developed seperately (and is still a WIP).
- Reddit's `?depth=X` query parameter can be a little buggy at times so can't promise this extension will always give you the results you're looking for. [See this thread for example](https://www.reddit.com/r/help/comments/tzqtdx/depth1_doesnt_work_any_more/?depth=1).

## Download

- :white_check_mark: [Install it on Firefox](https://addons.mozilla.org/en-GB/firefox/addon/reddit-only-parent-comments/)
- :man_technologist: Chrome extension coming soon!