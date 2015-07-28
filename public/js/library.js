angular.module('omnibooks.library', ['ngFx','ngAnimate']) //was omnibooks.market
.controller('LibraryController', ['$state', '$scope', '$stateParams', 'fireBase', 'auth', //was MarketController
    function($state, $scope, $stateParams, fireBase, auth) {
    var currentOrg = auth.getOrg();
    var currentUser = auth.getUser();

    if(currentOrg==='Purdue'){
      $scope.marketimg = '../images/purdue.jpg';
    }else if(currentOrg==='Wellesley'){
      $scope.marketimg = '../images/wellesley.jpg';
    }else if(currentOrg==='Berkeley'){
      $scope.marketimg = '../images/berkeley.jpg';
    }else{
      $scope.marketimg = '../images/stanford.jpg';
    }

      $scope.findDetail = function(book) {
        $stateParams.itemId = book.$id;
        $state.go("books", {
          itemId: book.$id
        });
      };
      currentOrg = auth.getOrg();
      $scope.books = fireBase.getOrgBook(currentOrg); //need to adjust to library books
    }
  ]);
