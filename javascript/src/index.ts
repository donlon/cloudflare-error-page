import * as ejs from "ejs";

import templateString from "./templates/template.ejs";
import cssString from "./templates/main.css";

export interface StatusItem {
  status?: "ok" | "error";
  status_text?: string;
  status_text_color?: string;
  location?: string;
  name?: string;
}

export interface MoreInformation {
  hidden?: boolean;
  link?: string;
  text?: string;
  for?: string;
}

export interface PerfSecBy {
  link?: string;
  text?: string;
}

export interface CreatorInfo {
  hidden?: boolean;
  link?: string;
  text?: string;
}

export interface ErrorPageParams {
  error_code?: number;
  title?: string;
  html_title?: string;
  time?: string;
  ray_id?: string;
  client_ip?: string;

  browser_status?: StatusItem;
  cloudflare_status?: StatusItem;
  host_status?: StatusItem;

  error_source?: "browser" | "cloudflare" | "host";

  what_happened?: string;
  what_can_i_do?: string;

  more_information?: MoreInformation;
  perf_sec_by?: PerfSecBy;
  creator_info?: CreatorInfo;
}

// Load EJS template
export const baseTemplate: ejs.TemplateFunction = ejs.compile(templateString);

/**
 * Generate random hex string for ray-id
 */
function genHexString(digits: number): string {
  const hex = "0123456789ABCDEF";
  let output = "";
  for (let i = 0; i < digits; i++) {
    output += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return output;
}

/**
 * Render a customized Cloudflare error page
 * @param params - The parameters for the error page
 * @param allowHtml - Whether to allow HTML in what_happened and what_can_i_do fields (default: true)
 * @param moreArgs - More arguments passed to the ejs template
 * @returns The rendered HTML string
 */
export function render(
  params: ErrorPageParams,
  allowHtml: boolean = true,
  moreArgs: {
    [name: string]: any;
  } = {}
): string {
  params = { ...params };

  if (!params.time) {
    const now = new Date();
    params.time = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  }
  if (!params.ray_id) {
    params.ray_id = genHexString(16);
  }

  if (!allowHtml) {
    params.what_happened = ejs.escapeXML(params.what_happened ?? "");
    params.what_can_i_do = ejs.escapeXML(params.what_can_i_do ?? "");
  }

  return baseTemplate({ params, html_style: cssString, ...moreArgs });
}

export default render;
