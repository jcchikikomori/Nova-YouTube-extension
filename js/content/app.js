const App = {
   // DEBUG: true,

   // Register the event handlers.
   eventListener: (function () {

      // document.addEventListener('yt-preconnect-urls', function () {
      //    console.log('yt-preconnect-urls');
      // });
      // document.addEventListener('yt-action', function (a) {
      //    console.log('yt-action', JSON.stringify(a));
      // });

      // event.target.removeEventListener(event.type, arguments.callee);

      //window.dispatchEvent(new Event("resize"));
      //getEventListeners(window)
      //getEventListeners(document)

      document.addEventListener('yt-navigate-start', () => {
         // skip first run on page load
         App.is_new_url() && App.rerun();
      });
   }()),

   this_url: location.href,

   is_new_url: () => App.this_url === location.href ? false : App.this_url = location.href,

   // sessionSettings: null,
   storage: {
      set: options => {
         App.log('storage.set: %s', JSON.stringify(options));
         App.sessionSettings = options;
      },

      load: callback => {
         // load store settings
         Storage.getParams(callback || App.storage.set, 'sync');
      },
   },

   rerun: () => {
      console.info('page transition');
      Plugins.load(Plugins_list.runOnTransition);
      App.run();
   },

   init: () => {
      App.log('init');
      App.storage.load();

      Plugins.injectScript('_plugins = []');

      let pluginsExportedCount;
      // load all Plugins
      Plugins.load((() => {
         let pl = [];
         for (const i in Plugins_list) Plugins_list[i].forEach(p => pl.push(p));
         pluginsExportedCount = pl.length - 1; // with the exception of "lib"
         return pl;
      })());

      let settings_loaded = setInterval(() => {
         App.log('settings_loaded');
         // wait load setting
         if (App.sessionSettings && Object.keys(App.sessionSettings).length) {
            clearInterval(settings_loaded);
            App.run(pluginsExportedCount);
         }
      }, 50);
   },

   run: pluginsExportedCount => {
      App.log('run');
      let preparation_execute = function () {
         let _plugins_run = setInterval(() => {
            if (document.querySelectorAll("#progress[style*=transition-duration], yt-page-navigation-progress:not([hidden])").length) {
               console.log('waiting page load..');
               return;
            }
            
            console.log(`plugins loaded: ${_pluginsExportedCount}/${_plugins.length} | page type: ${_typePage}`);

            if (_pluginsExportedCount === undefined || _plugins.length === _pluginsExportedCount) {
               clearInterval(_plugins_run);
               _plugins_executor(_typePage, _sessionSettings);
            }

         }, 100);
      };

      let scriptText = 'let _plugins_executor = ' + Plugins.run + ';\n';
      scriptText += 'let _pluginsExportedCount = ' + pluginsExportedCount + ';\n';
      scriptText += 'let _typePage = "' + YDOM.getPageType() + '";\n';
      scriptText += 'let _sessionSettings = ' + JSON.stringify(App.sessionSettings) + ';\n';
      scriptText += '(' + preparation_execute.toString() + '())';

      Plugins.injectScript('(function () {' + scriptText + '})()');
   },

   log: function (msg) {
      if (this.DEBUG) {
         for (let i = 1; i < arguments.length; i++) {
            msg = msg.replace(/%s/, arguments[i].toString().trim());
         }
         console.log('App:', msg);
      }
   },
}

App.init();
