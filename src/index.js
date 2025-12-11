/*
  Editor logic
  - initialConfig: provided default config (from your JSON)
  - render(): placeholder that generates HTML and writes to iframe.srcdoc
  - inputs call render() on change
  - "Open in new tab" opens the rendered HTML in a new window using a blob URL
*/
import ejs from 'ejs'
import templateContent from './template.ejs?raw'


let template = ejs.compile(templateContent);

// can be changed if specified by '?from=<name>'
let initialConfig = {
  title: 'Internal server error',
  error_code: '500',
  more_information: {
    hidden: false,
    text: 'cloudflare.com',
    for: 'more information',
  },
  browser_status: {
    status: 'ok',
    location: 'You',
    name: 'Browser',
    status_text: 'Working',
  },
  cloudflare_status: {
    status: 'error',
    location: 'San Francisco',
    name: 'Cloudflare',
    status_text: 'Error',
  },
  host_status: {
    status: 'ok',
    location: 'Website',
    name: 'Host',
    status_text: 'Working',
  },
  error_source: 'cloudflare',
  what_happened: "There is an internal server error on Cloudflare's network.",
  what_can_i_do: 'Please try again in a few minutes.',
};

// Demo presets (content brief — replace or expand as needed)
const PRESETS = {
  default: structuredClone(initialConfig),
  empty: {
    error_code: '500',
  },
  catastrophic: {
    title: 'Catastrophic infrastructure failure',
    error_code: '500',
    more_information: {
      for: 'no information',
    },
    browser_status: {
      status: 'error',
      status_text: 'Out of Memory',
    },
    cloudflare_status: {
      status: 'error',
      location: 'Everywhere',
      status_text: 'Error',
    },
    host_status: {
      status: 'error',
      location: 'example.com',
      status_text: 'On Fire',
    },
    error_source: 'cloudflare',
    what_happened: 'There is a catastrophic failure.',
    what_can_i_do: 'Please try again in a few years.',
  },
  working: {
    title: 'Web server is working',
    error_code: '200',
    more_information: {
      hidden: true,
    },
    browser_status: {
      status: 'ok',
      status_text: 'Seems Working',
    },
    cloudflare_status: {
      status: 'ok',
      status_text: 'Often Working',
    },
    host_status: {
      status: 'ok',
      location: 'example.com',
      status_text: 'Almost Working',
    },
    error_source: 'host',
    what_happened: 'This site is still working. And it looks great.',
    what_can_i_do: 'Visit the site before it crashes someday.',
  },
  consensual: {
    title: 'The Myth Of "Consensual" Internet',
    error_code: 'lmao',
    more_information: {
      hidden: false,
      text: 'r/ProgrammerHumor',
      link: 'https://redd.it/1p2yola',
    },
    browser_status: {
      status: 'ok',
      location: 'You',
      name: 'Browser',
      status_text: 'I Consent',
    },
    cloudflare_status: {
      status: 'error',
      location: 'F***ing Everywhere',
      name: 'Cloudflare',
      status_text: "I Don't!",
    },
    host_status: {
      status: 'ok',
      location: 'Remote',
      name: 'Host',
      status_text: 'I Consent',
    },
    error_source: 'cloudflare',
    what_happened: "Isn't There Someone You Forgot To Ask?",
    what_can_i_do: 'Kill Yourself',
  },
};

function extractUrlParam(str, key) {
  const urlParams = new URLSearchParams(str);
  return urlParams.get(key);
}
function getDefaultPresetName() {
  const key = 'from';
  let name = extractUrlParam(window.location.search, key);
  if (!name) {
    name = extractUrlParam(window.location.hash.substr(1), key);
  }
  return name;
}
const defaultPresetName = getDefaultPresetName();
if (defaultPresetName && defaultPresetName.indexOf('/') < 0) {
  fetch(`../s/${defaultPresetName}`, {
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('failed to get preset');
      }
      return response.json();
    })
    .then((result) => {
      if (result.status != 'ok') {
        return;
      }
      console.log(result.parameters);
      initialConfig = result.parameters;
      loadConfig(initialConfig);
      render();
    });
}

/* Utilities */
function $(id) {
  return document.getElementById(id);
}

/* Fill form from config */
function loadConfig(cfg) {
  $('title').value = cfg.title ?? '';
  $('error_code').value = cfg.error_code ?? '';

  $('more_hidden').checked = !!(cfg.more_information && cfg.more_information.hidden);
  $('more_text').value = cfg.more_information?.text ?? '';
  $('more_link').value = cfg.more_information?.link ?? '';
  $('more_for').value = cfg.more_information?.for ?? '';

  $('browser_status').value = cfg.browser_status?.status ?? 'ok';
  $('browser_location').value = cfg.browser_status?.location ?? '';
  $('browser_name').value = cfg.browser_status?.name ?? '';
  $('browser_status_text').value = cfg.browser_status?.status_text ?? '';

  $('cloudflare_status').value = cfg.cloudflare_status?.status ?? 'ok';
  $('cloudflare_location').value = cfg.cloudflare_status?.location ?? '';
  $('cloudflare_name').value = cfg.cloudflare_status?.name ?? '';
  $('cloudflare_status_text').value = cfg.cloudflare_status?.status_text ?? '';

  $('host_status').value = cfg.host_status?.status ?? 'ok';
  $('host_location').value = cfg.host_status?.location ?? '';
  $('host_name').value = cfg.host_status?.name ?? '';
  $('host_status_text').value = cfg.host_status?.status_text ?? '';

  if (cfg.error_source === 'browser') $('err_browser').checked = true;
  else if (cfg.error_source === 'cloudflare') $('err_cloudflare').checked = true;
  else $('err_host').checked = true;

  $('what_happened').value = cfg.what_happened ?? '';
  $('what_can_i_do').value = cfg.what_can_i_do ?? '';

  $('perf_text').value = cfg.perf_sec_by?.text ?? '';
  $('perf_link').value = cfg.perf_sec_by?.link ?? '';
}

/* Read config from form inputs */
function readConfig() {
  return {
    title: $('title').value,
    error_code: $('error_code').value,
    more_information: {
      hidden: !!$('more_hidden').checked,
      text: $('more_text').value,
      link: $('more_link').value,
      for: $('more_for').value,
    },
    browser_status: {
      status: $('browser_status').value,
      location: $('browser_location').value,
      name: $('browser_name').value,
      status_text: $('browser_status_text').value,
    },
    cloudflare_status: {
      status: $('cloudflare_status').value,
      location: $('cloudflare_location').value,
      name: $('cloudflare_name').value,
      status_text: $('cloudflare_status_text').value,
    },
    host_status: {
      status: $('host_status').value,
      location: $('host_location').value,
      name: $('host_name').value,
      status_text: $('host_status_text').value,
    },
    error_source: (
      document.querySelector('input[name="error_source"]:checked') || {
        value: 'host',
      }
    ).value,
    what_happened: $('what_happened').value,
    what_can_i_do: $('what_can_i_do').value,
    perf_sec_by: {
      text: $('perf_text').value,
      link: $('perf_link').value,
    },
  };
}
function formatUtcTimestamp() {
  const d = new Date();

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');

  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  const seconds = String(d.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
}

function renderEjs(params) {
  return template({
    params: params,
  });
}

/* Basic render: build HTML string from config and put into iframe.srcdoc */
function render() {
  const cfg = readConfig();
  window.lastCfg = cfg;

  cfg.time = formatUtcTimestamp();
  cfg.ray_id = '0123456789abcdef';
  if (!cfg.client_ip) {
    cfg.client_ip = '1.1.1.1';
  }

  // Auto-configure client IP if it is the default placeholder
  if (cfg.client_ip === '1.1.1.1' && !window.fetchedClientIp) {
    fetch('https://api-mininxd.vercel.app/ip')
      .then(res => res.json())
      .then(data => {
        if (data && data.ip) {
          window.fetchedClientIp = data.ip;
          render(); // Re-render with fetched IP
        }
      })
      .catch(err => console.error('Failed to fetch client IP:', err));
  } else if (window.fetchedClientIp && cfg.client_ip === '1.1.1.1') {
    cfg.client_ip = window.fetchedClientIp;
  }

  if (Number.isNaN(Number(cfg.error_code))) {
    cfg.html_title = cfg.title || 'Internal server error';
  }

  let pageHtml = renderEjs(cfg);
  // Write into iframe
  const iframe = $('previewFrame');
  let doc = iframe.contentDocument;
  doc.open();
  doc.write(pageHtml);
  doc.close();

  updateStatusBlockStyles();

  // store last rendered HTML for "open in new tab"
  lastRenderedHtml = pageHtml;
}

/* Open in new tab: create blob and open */
let lastRenderedHtml = '';
function openInNewTab() {
  if (!lastRenderedHtml) render();
  const blob = new Blob([lastRenderedHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener');
  // note that this url won't be revoked
}

function createShareableLink() {
  $('shareLink').value = '';
  fetch('../s/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parameters: window.lastCfg,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        alert('failed to create link');
      }
      return response.json();
    })
    .then((result) => {
      if (result.status != 'ok') {
        alert('failed to create link');
        return;
      }
      $('shareLink').value = result.url;
    });
}
function exportJSON() {
  let content = JSON.stringify(lastCfg, null, 4);
  const file = new File([content], 'cloudflare-error-page-params.json', {
    type: 'text/plain',
  });
  const url = URL.createObjectURL(file);

  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
function resizePreviewFrame() {
  const iframe = $('previewFrame');
  const height = iframe.contentWindow.document.body.scrollHeight + 2;
  iframe.style.setProperty('--expanded-height', height + 'px');
}

/* Update status block colors based on selected status and error_source */
function updateStatusBlockStyles() {
  const browserOk = $('browser_status').value === 'ok';
  const cfOk = $('cloudflare_status').value === 'ok';
  const hostOk = $('host_status').value === 'ok';

  setBlockClass('block_browser', browserOk ? 'status-ok' : 'status-error');
  setBlockClass('block_cloudflare', cfOk ? 'status-ok' : 'status-error');
  setBlockClass('block_host', hostOk ? 'status-ok' : 'status-error');
}

function setBlockClass(id, cls) {
  const el = $(id);
  if (!el) return;
  el.classList.remove('status-ok', 'status-error');
  el.classList.add(cls);
}

/* Simple debounce */
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* Wire up events */
// initialize form values from initialConfig
loadConfig(initialConfig);
render();

// On preset change, load preset and render
$('presetSelect').addEventListener('change', (e) => {
  const p = e.target.value;
  if (PRESETS[p]) loadConfig(PRESETS[p]);
  render();
});

// Render / Open button handlers
//   $('btnRender').addEventListener('click', e => { e.preventDefault(); render(); });
$('btnOpen').addEventListener('click', (e) => {
  e.preventDefault();
  openInNewTab();
});
$('btnShare').addEventListener('click', (e) => {
  e.preventDefault();
  createShareableLink();
});
$('btnExport').addEventListener('click', (e) => {
  e.preventDefault();
  exportJSON();
});

$('btnCopyLink').addEventListener('click', () => {
  const field = $('shareLink');
  field.select();
  field.setSelectionRange(0, field.value.length);
  navigator.clipboard.writeText(field.value).then(() => {
    // No notification required unless you want one
  });
});

// Input change -> render
const inputs = document.querySelectorAll('#editorForm input, #editorForm textarea, #editorForm select');
inputs.forEach((inp) => {
  inp.addEventListener(
    'input',
    debounce(() => {
      // Update status block color classes for quick visual feedback in the editor
      render();
    }, 200)
  );
  // for radio change events (error_source)
  if (inp.type === 'radio')
    inp.addEventListener('change', () => {
      render();
    });
});

// Automatically update frame height
const observer = new ResizeObserver((entries) => resizePreviewFrame());
const iframe = $('previewFrame');
observer.observe(iframe.contentWindow.document.body);
// resizePreviewFrame()
setInterval(resizePreviewFrame, 1000); // TODO...
