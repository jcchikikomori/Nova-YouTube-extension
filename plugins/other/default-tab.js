_plugins.push({
   name: 'The default tab on the channel page',
   id: 'set-default-channel-tab',
   section: 'channel',
   depends_page: 'channel',
   _runtime: user_settings => {

      // channel/user home page
      if (/\/channel\/UC([a-z0-9-_]{22})$/i.test(location.pathname)
         || /\/user\/([a-z0-9-_]+)$/i.test(location.pathname)
         || /\/c\/([a-z0-9-_]+)$/i.test(location.pathname)) {

         // HOME yab selected
         YDOM.HTMLElement.wait('#tabsContent>[role="tab"]:nth-child(2)[aria-selected="true"]')
            .then(() => {
               let tab_nth;
               switch (user_settings.default_channel_tab) {
                  case 'videos':
                     tab_nth = 4;
                     break;
                  case 'playlists':
                     tab_nth = 6;
                     break;
                  case 'about':
                     tab_nth = 12;
                     break;
               }
               const tab = document.querySelector(`#tabsContent>[role="tab"]:nth-child(${tab_nth})[aria-selected="false"`);

               if (tab) tab.click();
            });
      }

   },
   opt_export: {
      'default_channel_tab': {
         _elementType: 'select',
         label: 'Set default tab',
         options: [
            { label: 'videos', value: 'videos', selected: true },
            { label: 'playlists', value: 'playlists' },
            { label: 'about', value: 'about' },
         ]
      },
   },
});
