
import browser from 'webextension-polyfill';

const statusMsg = document.getElementById('status-msg');
const statusSpan = document.getElementById('status-span');
const toggleBtn = document.getElementById('toggle-btn');

toggleBtn.addEventListener('click', async () => {
  const extensionName = 'Reddit Only Parent Comments extension';
  try {
    const data = await storage.sync.get('state');
    if (data.state === 'on') {
      console.log(`${extensionName} deactivated`);
      setBrowserStorageSync('off');
    }
    if (data.state === 'off') {
      console.log(`${extensionName} activated`);
      setBrowserStorageSync('on');
    }
  } catch(err) {
    console.error(err);
  }
});

browser.storage.onChanged.addListener(({ state }) => {
  const { newValue } = state;
  updateToggleBtnState(newValue);
});

window.onload = () => updateToggleBtnState();


const changeToggleBtnCheck = (checked) => {
  if (checked) {
    toggleBtn.setAttribute('checked', true);
    statusMsg.textContent = 'On';
    statusSpan.textContent = 'Hiding child comments';
    statusSpan.className = 'green-lit';
  } else {
    toggleBtn.removeAttribute('checked');
    statusMsg.textContent = 'Off';
    statusSpan.textContent = 'Not hiding child comments';
    statusSpan.className = 'greyed-out';
  }
}

const updateToggleBtnState = async (state) => {
  const handleToggle = (state) => {
    switch(state) {
      case 'on':
        changeToggleBtnCheck(true);
        break;
      case 'off':
        changeToggleBtnCheck(false);
        break;
      default:
        return null;
    } 
  }

  if (handleToggle(state)) return;

  try {
    const data = await browser.storage.sync.get('state');
    handleToggle(data.state);
  } catch(err) {
    console.error(err);
  }
};

const setBrowserStorageSync = async (data) => {
  try {
    await browser.storage.sync.set({ state: data })
  } catch(err) {
    console.error(err);
  };
};
