# Cloudflare Error Page Generator

## What does this project do?

This project creates customized error pages that mimics the well-known Cloudflare error page. You can also embed it into your website.

## Online Editor

Here's an editor for the error page. You can try this out [here](https://virt.moe/cloudflare-error-page/editor/).

![Editor](https://github.com/donlon/cloudflare-error-page/blob/images/editor.png?raw=true)

## Quickstart for Programmers

Install `cloudflare-error-page` with pip.

``` Bash
pip install git+https://github.com/donlon/cloudflare-error-page.git
```

Then you can generate an error page based on parameters you like. (See [example.py](examples/example.py))

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
        "status_text": 'Not Working',
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

![Default error page](doc/default.png)

You can also see this example [here](https://virt.moe/cloudflare-error-page/examples/default).

## More Examples

### Catastrophic infrastructure failure

``` JavaScript
params = {
    "title": "Catastrophic infrastructure failure",
    "more_information": {
        "text": "cloudflare.com",
        "link": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    },
    "browser_status": {
        "status": "error",
        "status_text": "Out of Memory",
    },
    "cloudflare_status": {
        "status": "error",
        "location": "Everywhere",
        "status_text": "Not Working",
    },
    "host_status": {
        "status": "error",
        "location": "example.com",
        "status_text": "On Fire",
    },
    "error_source": "cloudflare",
    "what_happened": "<p>There is a catastrophic failure.</p>",
    "what_can_i_do": "<p>Please try again in a few years.</p>",
    "perf_sec_by": {
        "text": "Cloudflare",
        "link": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    },
}
```

![Catastrophic infrastructure failure](https://github.com/donlon/cloudflare-error-page/blob/images/example.png?raw=true)

[link](https://virt.moe/cloudflare-error-page/examples/catastrophic).

### Web server is working

``` JavaScript
params = {
    "title": "Web server is working",
    "error_code": 200,
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

[link](https://virt.moe/cloudflare-error-page/examples/working).


### Using Flask server

See [flask_demo.py](examples/flask_demo.py) for embedding the error pages into the server


## Full Parameter Reference
``` JavaScript
{
    "html_title": "cloudflare.com | 500: Internal server error",
    "title": "Internal server error",
    "error_code": 500,
    "time": "2025-11-18 12:34:56 UTC",  // if not set, current UTC time is shown

    // Configuration for "Visit ... for more information" line
    "more_information": {
        "hidden": false,
        "text": "cloudflare.com", 
        "link": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    },

    // Configuration for the Browser/Cloudflare/Host status
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
        "status_text": "Not Working",
        "status_text_color": "#bd2426",
    },
    "host_status": {
        "status": "ok",
        "location": "The Site",
        "name": "Host",
        "status_text": "Working",
        "status_text_color": "#9bca3e",
    },
    "error_source": "host", // Position of the error indicator, can be "browser", "cloudflare", or "host"

    "what_happened": "<p>There is an internal server error on Cloudflare's network.</p>",
    "what_can_i_do": "<p>Please try again in a few minutes.</p>",

    "ray_id": '0123456789abcdef',  // if not set, random hex string is shown
    "client_ip": '1.1.1.1',

    // Configuration for 'Performance & security by ...' in the footer
    "perf_sec_by": {
        "text": "Cloudflare",
        "link": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    },
}
```