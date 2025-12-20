import html
import secrets
import sys
from datetime import datetime, timezone
from typing import Any, TypedDict, Literal

if sys.version_info >= (3, 11):
    from typing import NotRequired
else:
    from typing import _SpecialForm
    NotRequired: _SpecialForm


from jinja2 import Environment, PackageLoader, Template, select_autoescape

env = Environment(
    loader=PackageLoader(__name__),
    autoescape=select_autoescape(),
    trim_blocks=True,
    lstrip_blocks=True,
)

base_template: Template = env.get_template("error.html")


class ErrorPageParams(TypedDict):
    class MoreInformation(TypedDict):
        hidden: NotRequired[bool]
        text: NotRequired[str]
        link: NotRequired[str]
        for_text: NotRequired[str]  # renamed to avoid Python keyword conflict

    class StatusItem(TypedDict):
        status: NotRequired[Literal["ok", "error"]]
        location: NotRequired[str]
        name: NotRequired[str]
        status_text: NotRequired[str]
        status_text_color: NotRequired[str]

    class PerfSecBy(TypedDict):
        text: NotRequired[str]
        link: NotRequired[str]
    
    class CreatorInfo(TypedDict):
        hidden: NotRequired[bool]
        link: NotRequired[str]
        text: NotRequired[str]

    html_title: NotRequired[str]
    title: NotRequired[str]
    error_code: NotRequired[str]
    time: NotRequired[str]

    more_information: NotRequired[MoreInformation]

    browser_status: NotRequired[StatusItem]
    cloudflare_status: NotRequired[StatusItem]
    host_status: NotRequired[StatusItem]

    error_source: NotRequired[Literal["browser", "cloudflare", "host"]]

    what_happened: NotRequired[str]
    what_can_i_do: NotRequired[str]

    ray_id: NotRequired[str]
    client_ip: NotRequired[str]
    show_clock: NotRequired[bool]
    clock_format: NotRequired[str]
    timezone: NotRequired[str]

    perf_sec_by: NotRequired[PerfSecBy]
    creator_info: NotRequired[CreatorInfo]


def render(params: ErrorPageParams,
           allow_html: bool = True,
           template: Template | None = None,
           *args: Any,
           **kwargs: Any) -> str:
    '''Render a customized Cloudflare error page.

    :param params: Parameters passed to the template. Refer to the project homepage for more information.
    :param allow_html: Allow output raw HTML content from parameters. Set to False if you don't trust the source of the params.
    :param template: Jinja template used to render the error page. Default template will be used if ``template`` is None.
        Override this to extend or customize the base template.
    :param args: Additional positional arguments passed to ``Template.render`` function.
    :param kwargs: Additional keyword arguments passed to ``Template.render`` function.
    :return: The rendered error page as a string.
    '''
    if not template:
        template = base_template

    params = {**params}

    more_information = params.get('more_information')
    if more_information:
        for_text = more_information.get('for_text')
        if for_text is not None:
            more_information['for'] = for_text

    if not params.get('time'):
        utc_now = datetime.now(timezone.utc)
        params['time'] = utc_now.strftime("%Y-%m-%d %H:%M:%S UTC")
    if not params.get('ray_id'):
        params['ray_id'] = secrets.token_hex(8)
    if not allow_html:
        params['what_happened'] = html.escape(params.get('what_happened', ''))
        params['what_can_i_do'] = html.escape(params.get('what_can_i_do', ''))

    return template.render(params=params, *args, **kwargs)

__version__ = "0.1.0"
__all__ = ['base_template', 'render']
