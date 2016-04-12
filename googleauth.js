'use strict';

/**
 * @ngdoc service
 * @name angularApp.googleAuth
 * @description
 * # googleAuth
 * Factory in the angularApp.
 */
angular.module('angularApp')
  .factory('googleAuth', function ($http) {

    /* ---------------------------------------------------------------------------------------------------------------------------- *\
     * GOOGLE DATAS
    \* ---------------------------------------------------------------------------------------------------------------------------- */
      let clientId  = 'YOUR_CLIENT_ID';
      let apiKey    = 'YOUR_API_KEY';
      let scopes    = [
        'https://www.googleapis.com/auth/plus.me', 
        'https://www.googleapis.com/auth/gmail.readonly'
      ];
    /* ---------------------------------------------------------------------------------------------------------------------------- */


    /* ---------------------------------------------------------------------------------------------------------------------------- *\
     * EVENTS
    \* ---------------------------------------------------------------------------------------------------------------------------- */
      // Define events
      let googlePlusEvent = new Event('googlePlusReady');
      let gmailEvent      = new Event('gmailReady');
      let userDatasEvent  = new Event('userDatasReady');

      // Events listenners
      window.addEventListener('googlePlusReady', function (e) {
        console.log('Google+ event fired !');
        googlePlusEventFired = true;

        if( gmailEventFired ) {
          // Dispatch the event.
          window.dispatchEvent(userDatasEvent);
        }
      }, false);

      window.addEventListener('gmailReady', function (e) {
        console.log('Gmail event fired !');
        gmailEventFired = true;

        if( googlePlusEventFired ) {
          // Dispatch the event.
          window.dispatchEvent(userDatasEvent);
        }
      }, false);        

      // Flags
      let googlePlusEventFired  = false;
      let gmailEventFired       = false;    
    /* ---------------------------------------------------------------------------------------------------------------------------- */ 


    let googleFuntions = {
      /* ---------------------------------------------------------------------------------------------------------------------------- *\
       * GOOGLE USER DATAS
      \* ---------------------------------------------------------------------------------------------------------------------------- */
        familyName: null,
        givenName:  null,
        email:      null,
        googleId:   null,
        avatar:     null,
        token:      null,
      /* ---------------------------------------------------------------------------------------------------------------------------- */

      /**
       * Set API key.
       * @return {void} Return nothing and call checkAuth function in callback
       */
      handleClientLoad: function() {
        gapi.client.setApiKey(apiKey);
        window.setTimeout(googleFuntions.checkAuth,1);
      },

      /**
       * Trying to authentificate the user
       * @return {void} Return nothing. Call handleAuthResult function in callback.
       */
      checkAuth: function() {       
        gapi.auth.authorize( {client_id: clientId, scope: scopes, immediate: true}, googleFuntions.handleAuthResult );
      },

      /**
       * Get the results of authentification
       * @param  {object} authResult Authentification results object
       * @return {void}              Return nothing. Call makeApiCall function or himself.
       */
      handleAuthResult: function(authResult) {
        console.log("Authentification results:",authResult);

        // If user was already auth
        if (authResult && !authResult.error) {
          googleFuntions.token = authResult.access_token;

          googleFuntions.makeApiCall();
        } 
        else {
          // User not already connect, ask him to connect his Google Account
          gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, googleFuntions.handleAuthResult);
          return false;
        }        
      },

      /**
       * Call APIs
       * @return {void} Populate datas of googleFuntions object.
       */
      makeApiCall: function() {
        gapi.client.load('plus', 'v1').then(function() {

          let request = gapi.client.plus.people.get({
            'userId': 'me'
          });

          request.then(function(resp) {
            console.log("API response:",resp);            

            googleFuntions.googleId = resp.result.id;
            googleFuntions.familyName = resp.result.name.familyName;
            googleFuntions.givenName = resp.result.name.givenName;
            googleFuntions.avatar   = resp.result.image.url;

            window.dispatchEvent(googlePlusEvent);
          }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
          });
        });

        gapi.client.load('gmail', 'v1').then(
          function(){
            let request = gapi.client.gmail.users.getProfile({
              'userId': 'me'
            });

            request.then(function(resp) {              
              console.log("Gmail response:",resp);              

              googleFuntions.email = resp.result.emailAddress;

              window.dispatchEvent(gmailEvent);
            }, function(reason) {
              console.log('Error: ' + reason.result.error.message);
            });
          }
        );
      },

      /**
       * Check if the token is valid
       * @param  {string} token The token.
       * @return {bool}         Return true if token is valid, return false if not.
       */
      checkToken: function(token) {
        if ( typeof token !== 'string' ) {
          window.alert('Error: Token must be a string !');
        }
        else {
          $http.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+string).then(
            // Success
            function( results ) {
              console.log('Succes !',results);
            },
            // Error
            function( results ) {
              console.log('Error !',results);
            }
          );
        }
      }
    };

    return googleFuntions;
  });
