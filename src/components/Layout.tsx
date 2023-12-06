import { html } from "hono/html";

export const Layout = (props: { title: string; children?: any }) => {
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>${props.title}</title>

        <meta name="description" content="" />
        <meta name="author" content="zeeshan" />

        <link href="/static/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/static/css/style.css" rel="stylesheet" />
      </head>
      <body>
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-2"></div>
            <div class="col-md-8">
              <nav class="navbar navbar-dark bg-dark" style="background-color: #e3f2fd;">
                <a class="navbar-brand" href="/">Streamer</a>
              </nav>

              ${props.children}
            </div>
            <div class="col-md-2"></div>
          </div>
        </div>

        <script src="/static/js/jquery.min.js"></script>
        <script src="/static/js/bootstrap.min.js"></script>
        <script src="/static/js/popper.min.js"></script>
        <script src="/static/js/scripts.js"></script>
      </body>
    </html>`;
};
