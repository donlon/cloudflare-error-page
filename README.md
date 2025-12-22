# Cloudflare Error Page Generator

📢 **Update (2025/12/09)**: All icons used in the error page have been fully redrawn as vector assets. These icons along with the stylesheet are also inlined into a single file of the error page, eliminating any need of hosting additional resources, and ensuring better experience for you and your end users.

## What does this project do?

This project creates customized error pages that mimics the well-known Cloudflare error page. You can also embed it into your website.

## Online Editor

Here's an online editor to create customized error pages. Try it out [here](https://virt.moe/cferr/editor/).

![Editor](https://github.com/donlon/cloudflare-error-page/blob/images/editor.png?raw=true)

## Quickstart for Programmers

### Python

Install `cloudflare-error-page` with pip.

``` Bash
# Install from PyPI
pip install cloudflare-error-page

# Or, install the latest version from this repo
pip install git+https://github.com/donlon/cloudflare-error-page.git
```

Then you can generate an error page using the `render` function. ([example.py](examples/example.py))

``` Python
import webbrowser
from cloudflare_error_page import render as render_cf_error_page

# This function renders an error page based on the input parameters
error_page = render_cf_error_page({
    # Browser status is ok
    'browser_status': {
        "status": 'ok',
    },
    # Cloudflare status is error
    'cloudflare_status': {
        "status": 'error',
        "status_text": 'Error',
    },
    # Host status is also ok
    'host_status': {
        "status": 'ok',
        "location": 'example.com',
    },
    # can be 'browser', 'cloudflare', or 'host'
    'error_source': 'cloudflare',

    # Texts shown in the bottom of the page
    'what_happened': '<p>There is an internal server error on Cloudflare\'s network.</p>',
    'what_can_i_do': '<p>Please try again in a few minutes.</p>',
})

with open('error.html', 'w') as f:
    f.write(error_page)

webbrowser.open('error.html')
```

You can also see live demo [here](https://virt.moe/cferr/examples/default).

A demo server using Flask is also available in [flask_demo.py](examples/flask_demo.py).

### JavaScript/NodeJS

Install the `cloudflare-error-page` package using npm:

``` Bash
npm install cloudflare-error-page
```

The following example demonstrates how to create a simple Express server and return the error page to visitors.

``` JavaScript
import express from 'express';
import { render as render_cf_error_page } from 'cloudflare-error-page';

const app = express();
const port = 3000;

// Define a route for GET requests to the root URL
app.get('/', (req, res) => {
  res.status(500).send(render_cf_error_page({
    title: "Internal server error",
    // Browser status is ok
    browser_status: {
        status: 'ok',
    },
    // Cloudflare status is error
    cloudflare_status: {
        status: 'error',
        status_text: 'Error',
    },
    // Host status is also ok
    host_status: {
        status: 'ok',
        location: 'example.com',
    },
    error_source: "cloudflare",
  }));
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

(Thanks [@junduck](https://github.com/junduck) for creating the original NodeJS version.)

### PHP

``` PHP
/* Coming soon! */
```

## More Examples

### Catastrophic infrastructure failure

``` Python
params = {
    "title": "Catastrophic infrastructure failure",
    "more_information": {
        "for": "no information",
    },
    "browser_status": {
        "status": "error",
        "status_text": "Out of Memory",
    },
    "cloudflare_status": {
        "status": "error",
        "location": "Everywhere",
        "status_text": "Error",
    },
    "host_status": {
        "status": "error",
        "location": "example.com",
        "status_text": "On Fire",
    },
    "error_source": "cloudflare",
    "what_happened": "<p>There is a catastrophic failure.</p>",
    "what_can_i_do": "<p>Please try again in a few years.</p>",
}
```

![Catastrophic infrastructure failure](https://github.com/donlon/cloudflare-error-page/blob/images/example.png?raw=true)

[Demo](https://virt.moe/cferr/examples/catastrophic)

### Web server is working

``` Python
params = {
    "title": "Web server is working",
    "error_code": "200",
    "more_information": {
        "hidden": True,
    },
    "browser_status": {
        "status": "ok",
        "status_text": "Seems Working",
    },
    "cloudflare_status": {
        "status": "ok",
        "status_text": "Often Working",
    },
    "host_status": {
        "status": "ok",
        "location": "example.com",
        "status_text": "Almost Working",
    },
    "error_source": "host",
    "what_happened": "<p>This site is still working. And it looks great.</p>",
    "what_can_i_do": "<p>Visit the site before it crashes someday.</p>",
}
```

![Web server is working](https://github.com/donlon/cloudflare-error-page/blob/images/example2.png?raw=true)

[Demo](https://virt.moe/cferr/examples/working)

## FAQ

### How to show real user IP / Cloudflare Ray ID / data center location in the error page so that it looks more realistic?

Ray ID and user IP field in the error page can be set by `ray_id` and `client_ip` properties in the `params` argument passed to the render function. The real Cloudflare Ray ID and the data center location of current request can be extracted from the `Cf-Ray` request header (e.g. `Cf-Ray: 230b030023ae2822-SJC`). Detailed description of this header can be found at [Cloudflare documentation](https://developers.cloudflare.com/fundamentals/reference/http-headers/#cf-ray).

To lookup the city name of the data center corresponding to the three letter code in the header, you can use a location list from [here](https://github.com/Netrvin/cloudflare-colo-list/blob/main/DC-Colos.json)

The demo server runs in our website did handle these. Take a look at [this file](https://github.com/donlon/cloudflare-error-page/blob/94c3c4ddbe521dee0c9a880ef33fa7a9f0720cbe/editor/server/utils.py#L34) for reference.

## See also

- [cloudflare-error-page-3th.pages.dev](https://cloudflare-error-page-3th.pages.dev/)

    Error page of every HTTP status code (reload to show random page).

- [oftx/cloudflare-error-page](https://github.com/oftx/cloudflare-error-page)

    React reimplementation of the original page, and can be deployed directly to Cloudflare Pages.


## Full Parameter Reference
``` JavaScript
{
    "html_title": "cloudflare.com | 500: Internal server error",
    "title": "Internal server error",
    "error_code": "500",
    "time": "2025-11-18 12:34:56 UTC",  // Current UTC time will be shown if empty

    // Configuration of "Visit ... for more information" line
    "more_information": {
        "hidden": false,
        "text": "cloudflare.com", 
        "link": "https://www.cloudflare.com/",
        "for": "more information",
    },

    // Configuration of the Browser/Cloudflare/Host status
    "browser_status": {
        "status": "ok", // "ok" or "error"
        "location": "You",
        "name": "Browser",
        "status_text": "Working",
        "status_text_color": "#9bca3e",
    },
    "cloudflare_status": {
        "status": "error",
        "location": "Cloud",
        "name": "Cloudflare",
        "status_text": "Error",
        "status_text_color": "#bd2426",
    },
    "host_status": {
        "status": "ok",
        "location": "Website",
        "name": "Host",
        "status_text": "Working",
        "status_text_color": "#9bca3e",
    },
    // Position of the error indicator, can be "browser", "cloudflare", or "host"
    "error_source": "host",

    "what_happened": "<p>There is an internal server error on Cloudflare's network.</p>",
    "what_can_i_do": "<p>Please try again in a few minutes.</p>",

    "ray_id": '0123456789abcdef',  // Random hex string will be shown if empty
    "client_ip": '1.1.1.1',

    // Configuration of 'Performance & security by ...' in the footer
    "perf_sec_by": {
        "text": "Cloudflare",
        "link": "https://www.cloudflare.com/",
    },
}
```
