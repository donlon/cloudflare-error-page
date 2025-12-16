function AboutCaptions() {
  return (
    <>
      <div className="mt-2 text-center">
        &gt;&gt; Star this project on{' '}
        <a href="https://github.com/donlon/cloudflare-error-page" target="_blank">
          GitHub
        </a>{' '}
        ⭐
      </div>

      <div className="mt-2" style={{ fontSize: '0.9em' }}>
        You can also embed this error page into your own website. See{' '}
        <a href="https://github.com/donlon/cloudflare-error-page#quickstart-for-programmers" target="_blank">
          Quickstart
        </a>{' '}
        in the homepage for steps.
      </div>
    </>
  );
}

export default AboutCaptions;
