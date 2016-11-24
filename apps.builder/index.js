export default function(){

return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>

    <title>Kurbi Bots</title>

    <link href="/custom_pages/botbuilder/cms/styles/styles.api.min.css" rel="stylesheet" />
    
    <!-- this file makes the arrows work correctly -->
    <!--<link href="rappid/v1.6/rappid.min.css" rel="stylesheet" />-->
    <link href="/custom_pages/botbuilder/jointjs/joint.css" rel="stylesheet" />
    
    <link href="/custom_pages/botbuilder/css/header.css" rel="stylesheet"/>
    <!--<link href="/custom_pages/botbuilder/css/side-menu.css" rel="stylesheet" />-->
    <link href="/custom_pages/botbuilder/css/toolbar.css" rel="stylesheet"/>
    <link href="/custom_pages/botbuilder/css/statusbar.css" rel="stylesheet"/>
    <link href="/custom_pages/botbuilder/css/paper.css" rel="stylesheet"/>
    <link href="/custom_pages/botbuilder/css/preview.css" rel="stylesheet"/>
    <link href="/custom_pages/botbuilder/css/halo.css" rel="stylesheet"/>
    <link href="/custom_pages/botbuilder/css/tooltip.css" rel="stylesheet"/>
    <link href="/custom_pages/botbuilder/css/snippet.css" rel="stylesheet"/>
    <link href="/custom_pages/botbuilder/css/dialog.css" rel="stylesheet"/>
    <link href="/custom_pages/botbuilder/css/index.css" rel="stylesheet"/>

    <link rel="stylesheet" href="https://opensource.keycdn.com/fontawesome/4.6.3/font-awesome.min.css" integrity="sha384-Wrgq82RsEean5tP3NK3zWAemiNEXofJsTwTyHmNb/iL3dP/sZJ4+7sOld1uqYJtE" crossorigin="anonymous">

  </head>
<body>

<script>
  SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
  return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
  };
</script>

    <main class="content layout_sidebar">

      <section id="app">

        <div id="header">
            <h1>MENU</h1>
            <span id="top-nav">
              <button class="btn load-example">Reset Bot</button>
              <button class="btn preview-dialog disabled">Preview Bot</button>
            </span>
        </div>

        <div id="main">

          <div id="toolbar">
            <h4>BOTS</h4>
            <span id="toolbar-buttons-span">
              <button class="btn add-question">Question</button>
              <button class="btn add-answer">Message</button>
              <button class="btn add-icon">Avatars</button>
              <!--<button class="btn code-snippet">Code Snippet</button>-->
              <!--<button class="btn clear">Clear Canvas</button>-->
            </span>
          </div>

          <div id="paper"></div>

          <div id="statusbar">
            <span class="message"></span>
          </div>

          <div id="preview" class="preview">
          </div>

        </div><!-- END #main -->

      </section>

    </main>

    <!--<script src="/custom_pages/botbuilder/vendor/jquery/jquery.min.js"></script>-->
    <script src="/custom_pages/botbuilder/vendor/lodash/lodash.min.js"></script>
    <script src="/custom_pages/botbuilder/vendor/backbone/backbone-min.js"></script>
    <!--<script src="/custom_pages/botbuilder/rappid/v1.6/rappid.min.js"></script>-->
    <script src="/custom_pages/botbuilder/jointjs/joint.js"></script>

    <script src="/custom_pages/botbuilder/src/joint.shapes.qad.js"></script>
    <script src="/custom_pages/botbuilder/src/selection.js"></script>
    <script src="/custom_pages/botbuilder/src/factory.js"></script>
    <script src="/custom_pages/botbuilder/src/snippet.js"></script>
    <script src="/custom_pages/botbuilder/src/app.js"></script>
    <script src="/custom_pages/botbuilder/src/index.js"></script>
  </body>
</html>`;

}