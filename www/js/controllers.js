angular.module('starter.controllers', [])
.controller('SignInCtrl', function ($rootScope, $scope, API, $window){
	if($rootScope.isSessionActive()){
		$window.location.href=('#/post/list');
	}

	$scope.user={
		name :'',
		password:''
	};

	$scope.login=function(){
		var name = this.user.name;
		var password = this.user.password;

		if(!name || !password){
			$rootScope.notify('请输入用户和密码');
			return false;
		}

		$rootScope.show('Please wait.. Authentivating');

		API.login($scope.user).success(function (data, status, headers, config){
			if(data.ErrMessage){
				$rootScope.notify('登录错误'+data.ErrMessage);
			} else{
				$rootScope.setToken(data._id);
				$rootScope.hide();
				$scope.user={};
				$window.location.href=('#/post/main');
			}
			
		}).error(function (data, status, headers, config){
			$rootScope.hide();
			$rootScope.notify('用户名或密码无效，请重新输入！');
		});
	}
})
.controller('SignUpCtrl', function ($rootScope, $scope, API, $window){
	$scope.user = {
		name : '',
		email : '',
		password :'',
		passwordrepeat:''
	};

	$scope.register = function(){
		var email = this.user.email;
		var password = this.user.password;
		var passwordrepeat = this.user.passwordrepeat;
		var name = this.user.name;

		if(!email || !password || !name || !passwordrepeat){
			$rootScope.notify('请输入有效信息！');
			return false;
		}

		if(password !== passwordrepeat){
			$rootScope.notify('两次输入的密码不一致，请重新输入！');
			return false;
		}

		$rootScope.show('Please wait.. Registering');

		API.register($scope.user).success(function (data, status, headers, config){
			if(data.ErrMessage){
				$rootScope.notify('注册错误'+data.ErrMessage);
			} else {
				$rootScope.hide();
				$window.location.href=('#/post/list');
			}
		}).error(function (data, status, headers, config){
			$rootScope.hide();
			if(data){
				$rootScope.notify('A user with this email already exists');
			} else {
				$rootScope.notify('Oops something went wrong, Please try angin!');
			}
		});
	}
})
.controller('MainCtrl', function ($rootScope, $scope, API, $window){
	
})
.controller('UserManagerCtrl', function ($rootScope, $scope, API, $ionicModal, $window, $ionicPopup){
	var userid = $rootScope.getToken();
	$rootScope.$on('fetchOne', function(){
		API.getUser(userid).success(function (data, status, headers, config){
			if(data.ErrMessage){
				$rootScope.showAlert('数据加载错误',data.ErrMessage);
			} else {
				$scope.user = data;

				$ionicModal.fromTemplateUrl('templates/manager-info.html', function (modal){
					$scope.newTemplate = modal;
				});

				$scope.updateInfo = function(){
					$scope.newTemplate.show();
				};

				$rootScope.hide();
			}
		}).error(function (data, status, headers, config){
			$rootScope.hide();
			$rootScope.notify('Oops something went wrong! Please try again later');
		});
	});

	$rootScope.$broadcast('fetchOne');

	$scope.logoutBlog = function(){
		var confirmPopup = $ionicPopup.confirm({
			title : "退出确认",
			template : "你确认要退出U9博客？",
			//buttons:[
			//	{text:'取消'},
			//	{
			//		text:'确定',
			//		type: 'button-positive',
			//    }
			//]
		});
		confirmPopup.then(function (res){
			if(res){
				$rootScope.logout();
			}
		});
	};
})
.controller('UserinfoCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window){
	var userid = $rootScope.getToken();
	API.getUser(userid).success(function (data, status, headers, config){
			$scope.user = data;
	});
	$scope.updateUserInfo = function(){
		$rootScope.show("Please wait... update the userinfo");
		API.updateUserInfo($scope.user, userid).success(function (data, status, headers, config){
			if(data.ErrMessage){
				$rootScope.showAlert('更新错误',data.ErrMessage);
			} else {
				$rootScope.hide();
				$rootScope.doRefresh(0);
				$scope.modal.hide();
			}
		}).error(function (data, status, headers, config){
			$rootScope.hide();
			$rootScope.notify('Oops something went wrong! Please try again later');
		});
	};

	$scope.close = function(){
		$scope.modal.hide();
	}
})
.controller('UserPasswordCtrl', function ($rootScope, $scope, API, $timeout, $window){
	$scope.user={
		password :'',
		newpassword :'',
		checknewpassword :''
	};
	var userid = $rootScope.getToken();

	$scope.updatePassword =function(){
		$rootScope.show("Please wait... update the password");
		if(!$scope.user.password || !$scope.user.newpassword || !$scope.user.checknewpassword){
			$rootScope.hide();
			return;
		}

		if($scope.newpassword != $scope.checknewpassword){
			$rootScope.showAlert('更新错误','两次输入的密码不一致，请重新输入！');
		}
		API.updateUserPsd($scope.user, userid).success(function (data, status, headers, config){
			if(data.ErrMessage){
				$rootScope.showAlert('更新错误',data.ErrMessage);
			} else {
				$rootScope.hide();
				$window.location.href=('#/post/manager');
			}
		}).error(function (data, status, headers, config){
			$rootScope.hide();
			$rootScope.notify('Oops something went wrong! Please try again later');
		});	
	};
})
.controller('PostListCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window){
	$rootScope.$on('fetchAll', function(){
		$rootScope.show("Loading...");
		API.getPosts().success(function (data, status, headers, config){
			if(data.ErrMessage){
				$rootScope.showAlert('数据加载错误',data.ErrMessage);
			} else {
				for(var i = 0; i<data.length; i++){
					data[i].createTime=data[i].createTime.slice(0, 10);
				}
				$scope.posts = data;

				$ionicModal.fromTemplateUrl('templates/newpost.html', function (modal){
					$scope.newTemplate = modal;
				});
				$scope.newTask = function(){
					$scope.newTemplate.show();
				};

				$rootScope.hide();
			}
		}).error(function (data, status, header, config){
			$rootScope.hide();
			$rootScope.notify('Oops something went wrong! Please try again later');
		});
	});
	$rootScope.$broadcast('fetchAll');
})
.controller('PostDetailCtrl', function ($rootScope, $scope, API, $window, $ionicModal, $stateParams, $ionicPopup){
	$rootScope.$on('fetchAll', function(){
		API.getPost($stateParams.postid).success(function (data, status, headers, config){
			if(data.ErrMessage){
				$rootScope.showAlert('数据加载错误',data.ErrMessage);
			} else {
				data.createTime = data.createTime.slice(0, 10);
				$scope.post =data;
				if($scope.post.user == $rootScope.getToken()){
					$scope.isOwner = true;
				} else {
					$scope.isOwner = false;
				}

				$ionicModal.fromTemplateUrl('templates/post-edit.html', function (modal){
					$scope.newTemplate = modal;
				});
				$scope.update = function(){
					$scope.newTemplate.show();
				};
				$rootScope.hide();
			}
		});
	});
	$rootScope.$broadcast('fetchAll');

	$scope.delete = function(){
		var confirmPopup = $ionicPopup.confirm({
			title : "删除确认",
			template : "你确定要删除该文章？",
		});
		confirmPopup.then(function (res){
			if(res){
				$rootScope.show("Please wait... Deleting from List");
				API.deletePost($stateParams.postid).success(function (data, status, header, config){
					if(data.ErrMessage){
						$rootScope.showAlert('删除数据错误',data.ErrMessage);
					} else {
						$rootScope.hide();
						$window.location.href=('#/post/list');
					}
				}).error(function (data, status, header, config){
					$rootScope.hide();
					$rootScope.notify('Oops something went wrong! Please try again later');
				});
			}
		});
	};	
 	
	$scope.creatComment = function(){
		$scope.isComment = true;
		$scope.newcomment.comment='';
	};
	$scope.newcomment={
		comment:'',
		user :  $rootScope.getToken(),
	};
	$scope.checkcomment = function(){
		$rootScope.show("Please wait... create comment");
		//$scope.comment.user = $rootScope.getToken();
		if(!$scope.newcomment.comment){
			return false;
		}
		API.commentPost($stateParams.postid, $scope.newcomment).success(function (data, status, header, config){
			if(data.ErrMessage){
				$rootScope.showAlert('评论错误',data.ErrMessage);
			} else {
				$rootScope.hide();
				$rootScope.doRefresh(1);
				$scope.isComment = false;
			}
		}).error(function (data, status, header, config){
			$rootScope.hide();
			$rootScope.notify('Oops something went wrong! Please try again later');
		});
	};
})
.controller('newPostCtrl', function ($rootScope, $scope, API, $window){
	$scope.post={
		name:'',
		head:'',
		tags:'',
		content:'',
		user :''
	};

	$scope.createNew=function(){
		$rootScope.show("Please wait... create new post");
		$scope.post.user = $rootScope.getToken();
		API.createPost($scope.post).success(function (data, status, headers, config){
			if(data.ErrMessage){
				$rootScope.showAlert('新增错误',data.ErrMessage);
			} else {
				$rootScope.hide();
				$rootScope.doRefresh(1);
				$scope.modal.hide();
			}
		}).error(function (data, status, headers, config){
			$rootScope.hide();
			$rootScope.notify('Oops something went wrong! Please try again later');
		});
	};

	$scope.close = function(){
		$scope.modal.hide();
	};
})
.controller('editPostCtrl', function ($rootScope, $scope, API, $window, $stateParams){
	API.getPost($stateParams.postid).success(function (data){
		$scope.post =data;
	});

	$scope.updatePost = function(){
		$rootScope.show("Please wait... update the post");
		API.updatePost($scope.post, $stateParams.postid).success(function (data, status, header, config){
			if(data.ErrMessage){
				$rootScope.showAlert('更新错误',data.ErrMessage);
			} else {
				$rootScope.hide();
				$rootScope.doRefresh(1);
				$scope.modal.hide();
			}
		}).error(function (data, status, header, config){
			$rootScope.hide();
			$rootScope.notify('操作错误，请稍后继续！');
		});
	};
	$scope.close = function(){
		$scope.modal.hide();
	};
})
.controller('SuggestCtrl', function ($rootScope, $scope, API, $window, $stateParams){
	var userid = $rootScope.getToken();
	$scope.suggest ={
		user : userid,
		message :''
	};
	$scope.suggesstSave = function(){
		$rootScope.show("Please wait... create the suggest");
		API.createSuggest($scope.suggest).success(function (data, status, headers, config){
			$rootScope.hide();
			$window.location.href=('#/post/manager');
		}).error(function (data, status, headers, config){
			$rootScope.hide();
			$rootScope.notify('操作错误，请稍后继续！');
		});
	}
});
