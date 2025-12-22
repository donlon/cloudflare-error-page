# Cloudflare Error Page Generator (Node.js/TypeScript)

Carbon copy of the original Python version.

## Installation

```bash
npm install cloudflare-error-page
```

Or install from GitHub:

```bash
npm install git+https://github.com/donlon/cloudflare-error-page.git#javascriptnodejs
```

## Quick Start

```typescript
import { render } from 'cloudflare-error-page';
import * as fs from 'fs';

const errorPage = render({
  browser_status: { status: 'ok' },
  cloudflare_status: { status: 'error', status_text: 'Error' },
  host_status: { status: 'ok', location: 'example.com' },
  error_source: 'cloudflare',
  what_happened: '<p>There is an internal server error on Cloudflare\'s network.</p>',
  what_can_i_do: '<p>Please try again in a few minutes.</p>',
});

fs.writeFileSync('error.html', errorPage);
```

## API Reference

### `render(params: ErrorPageParams, allowHtml?: boolean, moreArgs?: { [name: string]: any; }): string`

Generates an HTML error page based on the provided parameters.

#### Parameters

- `params`: An object containing error page configuration
- `allowHtml` (optional): Whether to allow HTML in `what_happened` and `what_can_i_do` fields. Default: `true`
- `moreArgs` (optional): More arguments passed to the ejs template

#### ErrorPageParams Interface

```typescript
interface ErrorPageParams {
  // Basic information
  error_code?: number;              // Default: 500
  title?: string;                   // Default: 'Internal server error'
  html_title?: string;              // Default: '{error_code}: {title}'
  time?: string;                    // Auto-generated if not provided
  ray_id?: string;                  // Auto-generated if not provided
  client_ip?: string;               // Default: '1.1.1.1'
  
  // Status for each component
  browser_status?: StatusItem;
  cloudflare_status?: StatusItem;
  host_status?: StatusItem;
  
  // Error source indicator
  error_source?: 'browser' | 'cloudflare' | 'host';
  
  // Content sections
  what_happened?: string;           // HTML content
  what_can_i_do?: string;           // HTML content
  
  // Optional customization
  more_information?: MoreInformation;
  perf_sec_by?: PerfSecBy;
  creator_info?: CreatorInfo;
}

interface StatusItem {
  status?: 'ok' | 'error';
  status_text?: string;             // Default: 'Working' or 'Error'
  status_text_color?: string;       // CSS color
  location?: string;
  name?: string;
}
```

## Examples

### Basic Error Page

```typescript
import { render } from 'cloudflare-error-page';

const html = render({
  cloudflare_status: { status: 'error' },
  error_source: 'cloudflare',
  what_happened: '<p>Something went wrong.</p>',
  what_can_i_do: '<p>Try again later.</p>',
});
```

### Express.js Integration

```typescript
import express from 'express';
import { render } from 'cloudflare-error-page';

const app = express();

app.use((err, req, res, next) => {
  const errorPage = render({
    error_code: err.status || 500,
    title: err.message || 'Internal server error',
    cloudflare_status: { status: 'ok' },
    host_status: { 
      status: 'error',
      location: req.hostname 
    },
    error_source: 'host',
    what_happened: `<p>${err.message}</p>`,
    what_can_i_do: '<p>Please try again or contact support.</p>',
  });
  
  res.status(err.status || 500).send(errorPage);
});
```

## TypeScript Support

This package includes full TypeScript type definitions. Import types as needed:

```typescript
import { render, ErrorPageParams, StatusItem } from 'cloudflare-error-page';
```

## License

MIT

## Related

- [Python version](https://github.com/donlon/cloudflare-error-page)
- [Online Editor](https://virt.moe/cloudflare-error-page/editor/)
