process.env.DISABLE_NOTIFIER = true;
var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    
    mix.scriptsIn('resources/angular/tenant', 'public/tenant/app/all.js');
    mix.copy('resources/angular/tenant', 'public/tenant');
    
    mix.scriptsIn('resources/plugins/v2', 'public/plugins/v2/all.js');
    mix.copy('resources/plugins/v2', 'public/plugins/v2');

});
