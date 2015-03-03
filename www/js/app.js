// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('user',{
      url:'/user',
      abstract: true,
      templateUrl:'templates/user.html'
    })
    .state('user.signin',{
      url:'/signin',
      views:{
        'user-signin':{
          templateUrl:'templates/user-signin.html',
          controller:'SignInCtrl'
        }
      }
    })
    .state('user.signup',{
      url:'/signup',
      views: {
        'user-signup':{
          templateUrl:'templates/user-signup.html',
          controller:'SignUpCtrl'
        }
      }
    })
    .state('post',{
      url:'/post',
      abstract:true,
      templateUrl:'templates/post.html',
    })
    .state('post.main',{
      url:'/main',
      views:{
        'post-main':{
          templateUrl:'templates/post-main.html',
          controller:'MainCtrl'
        }
      }
    })
    .state('post.list',{
      url:'/list',
      views:{
        'post-list':{
          templateUrl:'templates/post-list.html',
          controller:'PostListCtrl'
        }
      }
    })
    .state('post.post-detail',{
      url:'/post/:postid',
      views:{
        'post-list':{
          templateUrl:'templates/post-detail.html',
          controller:'PostDetailCtrl'
        }
      }
    })
    .state('post.manager',{
      url:'/manager',
      views:{
        'post-manager':{
          templateUrl:'templates/manager.html',
          controller:'UserManagerCtrl'
        }
      }
    })
    .state('post.manager-account',{
      url:'/manager/account',
      views : {
        'post-manager':{
          templateUrl : 'templates/manager-account.html',
          controller: 'UserManagerCtrl'
        }
      }
    })
    .state('post.manager-password',{
      url : '/manager/password',
      views : {
        'post-manager':{
          templateUrl: 'templates/manager-password.html',
          controller:'UserPasswordCtrl'
        }
      }
    })
    .state('post.manager-feedback',{
      url : '/manager/feedback',
      views:{
        'post-manager':{
          templateUrl:'templates/manager-feedback.html',
          controller:'SuggestCtrl'
        }
      }
    })
    .state('post.manager-about',{
      url : '/manager/about',
      views:{
        'post-manager':{
          templateUrl:'templates/manager-about.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/user/signin');

});

