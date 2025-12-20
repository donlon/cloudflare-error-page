import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as ejs from "ejs";
import * as crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  show_clock?: boolean;
  clock_format?: string;
  timezone?: string;

  what_happened?: string;
  what_can_i_do?: string;

  more_information?: MoreInformation;
  perf_sec_by?: PerfSecBy;
  creator_info?: CreatorInfo;
}

/**
 * Fill default parameters if not provided
 */
function fillParams(params: ErrorPageParams): ErrorPageParams {
  const filledParams = { ...params };

  if (!filledParams.time) {
    const now = new Date();
    filledParams.time =
      now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  }

  if (!filledParams.ray_id) {
    filledParams.ray_id = crypto.randomBytes(8).toString("hex");
  }

  return filledParams;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Render a customized Cloudflare error page
 * @param params - The parameters for the error page
 * @param allowHtml - Whether to allow HTML in what_happened and what_can_i_do fields (default: true)
 * @returns The rendered HTML string
 */
export function render(
  params: ErrorPageParams,
  allowHtml: boolean = true
): string {
  let processedParams = fillParams(params);

  if (!allowHtml) {
    processedParams = { ...processedParams };
    if (processedParams.what_happened) {
      processedParams.what_happened = escapeHtml(processedParams.what_happened);
    }
    if (processedParams.what_can_i_do) {
      processedParams.what_can_i_do = escapeHtml(processedParams.what_can_i_do);
    }
  }

  // Load EJS template
  const templatePath = path.join(__dirname, "..", "templates", "error.ejs");

  const template = fs.readFileSync(templatePath, "utf-8");

  const rendered = ejs.render(template, { params: processedParams });

  return rendered;
}

export default render;
