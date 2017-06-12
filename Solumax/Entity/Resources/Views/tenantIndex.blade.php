<!DOCTYPE html>
<html ng-app="Solumax.Entities">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <meta http-equiv="Content-Security-Policy" content="connect-src * blob: *; default-src *; style-src * 'unsafe-inline'; script-src * 'unsafe-inline' 'unsafe-eval'; img-src * data: blob:;">
    <meta name="mobile-web-app-capable" content="yes"></meta>
    <title ng-bind="pageTitle">Data Person / Organisasi</title>
    <link rel="stylesheet" type="text/css" href="/standard/bootstrap-3.3.6-dist/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="/custom/bootstrap/bootstrap-superhero.min.css">
    <link rel="stylesheet" type="text/css" href="/standard/jquery-ui-1.11.4/jquery-ui.min.css">
    <link rel="stylesheet" type="text/css" href="/standard/jquery-ui-1.11.4/jquery-ui.structure.min.css">
    <link rel="stylesheet" type="text/css" href="/standard/jquery-ui-1.11.4/jquery-ui.theme.min.css">
    <link rel="stylesheet" type="text/css" href="/standard/font-awesome-4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="/standard/web-fonts/fonts.css">
    <link rel="stylesheet" type="text/css" href="/standard/barcode-fonts/barcode-3of9.css">
    <!-- Custom -->
    <link rel="stylesheet" type="text/css" href="/standard/custom/css/form.css">
    <link rel="stylesheet" type="text/css" href="/standard/custom/css/pastel-colors.css">
    <script type="text/javascript" src="/standard/jquery/jquery-2.2.0.min.js"></script>
    <script type="text/javascript" src="/standard/jquery-ui-1.11.4/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/standard/angular/angular.min.js"></script>
    <script type="text/javascript" src="/standard/bootstrap-3.3.6-dist/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="/standard/lodash-4.13.1/lodash.min.js"></script>
    <script type="text/javascript" src="/standard/localforage/localforage.min.js"></script>
    <script type="text/javascript" src="/standard/async-1.5.2/async.min.js"></script>
    <script type="text/javascript" src="/solumax/file-manager/v2/file-manager.js"></script>
    <script type="text/javascript" src="/custom/js/URI.js"></script>
    @if (env('APP_ENV') == 'dev')
    <script type="text/javascript" src="('http:' . explode(':', Request::root())[1] . ':10000/')/plugins/1.0/all.js"></script>
    @else 
    <script type="text/javascript" src="https://accounts.xolura.com/plugins/1.0/all.js"></script>
    @endif
    <script type="text/javascript" src="/solumax/logger/logger.js"></script>
    <script type="text/javascript" src="/plugins/v2/all.js"></script>
    <script src="app/all.js"></script>
</head>

<body>
    <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button button-primary" class="navbar-toggle" data-toggle="collapse" data-target="#mainNavbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <tenant-select class="navbar-brand"></tenant-select>
            </div>
            <div id="mainNavbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li><a ui-sref='index' data-toggle="collapse" data-target="#mainNavbar">Home</a></li>
                    <li sol-auth></li>
                </ul>
            </div>
        </div>
    </nav>
    <style type="text/css">
    body {
        padding-top: 60px;
    }
    </style>
    <div class="container">
        <section ui-view></section>
    </div>
</body>

</html>
