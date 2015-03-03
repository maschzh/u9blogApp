angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('API', function ($http, $rootScope, $ionicLoading, $window, $ionicPopup){
   //var url ="localhost:8002"
   //var url ="https://cooksapp.herokuapp.com";
   var url ="https://u9blog.herokuapp.com";
   $rootScope.show = function(text){
      $rootScope.loading = $ionicLoading.show({
        template : '<i class="ion-loading-d"></i>'+(text ? text : 'Loading'),
        animation :'fade-in',
        showBackdrop: true,
        maxWidth:200,
        showDelay:0
      });
   };

   $rootScope.hide = function(){
    $ionicLoading.hide();
   };

   $rootScope.logout = function(){
      $rootScope.setToken('');
      $window.location.href='#/user/signin';
   };

   $rootScope.notify = function(text){
    $rootScope.show(text);
    $window.setTimeout(function(){
      $rootScope.hide();
    }, 1900);
   };

   $rootScope.doRefresh = function(tab){
      if(tab ==0){
        $rootScope.$broadcast('fetchOne');
      } else if(tab == 1){
        $rootScope.$broadcast('fetchAll');
      } else {
        $rootScope.$broadcast('fetchCompleted');
      }

      $rootScope.$broadcast('scroll.refreshComplete');
   };

   $rootScope.showAlert = function(title, message) {
     var alertPopup = $ionicPopup.alert({
       title: title,
       template: message
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };

   $rootScope.setToken = function(token){
      return $window.localStorage.token = token;
   };
   $rootScope.getToken = function(){
        return $window.localStorage.token;
   };

   $rootScope.isSessionActive = function(){
      return $window.localStorage.token ? true : false;
   };

   return {
      login : function(user){
        //return $http.post(url + '/app/login', user);
        return $http.post(url + '/u9blog/user-login', user);
      },
      register : function(user){
        //return $http.post(url + '/app/register', user);
        return $http.post(url + '/u9blog/user-register', user);
      },
      getall : function(){
        return $http.get(url + '/u9blog/users');
      },
      getUser: function(userid){
        return $http.get(url + '/u9blog/user/'+ userid);
      },
      updateUserInfo: function(user, userid){
        return $http.put(url + '/u9blog/user-info/'+userid, user);
      },
      updateUserPsd : function(user, userid){
        return $http.put(url + '/u9blog/user-password/'+ userid, user);
      },
      getPosts: function(){
          return $http.get(url + '/u9blog/posts');
      },
      getPost: function(postid){
          return $http.get(url + '/u9blog/post/'+ postid);
      },
      createPost: function(post){
          return $http.post(url + '/u9blog/post', post);
      },
      updatePost: function(post, postid){
          return $http.put(url + '/u9blog/post/'+ postid, post);
      },
      commentPost: function(postid, comment){
          return $http.put(url + '/u9blog/post/comment/'+ postid, comment);
      },
      deletePost: function(postid){
          return $http.delete(url + '/u9blog/post/'+postid);
      },
      createSuggest: function(suggest){
         return $http.post(url +'/u9blog/feedback', suggest);
      },
   }
});

