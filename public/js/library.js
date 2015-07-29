angular.module('omnibooks.library', ['ngFx','ngAnimate'])
.controller('LibraryController', ['$state', '$scope', '$stateParams', 'fireBase', 'auth', 'libServices',
    function($state, $scope, $stateParams, fireBase, auth, libServices) {
    var currentOrg = auth.getOrg();
    console.log(currentOrg);
    var currentUser = auth.getUser();

    if(currentOrg==='Purdue'){
      console.log('am I real?');
      $scope.marketimg = '../images/purdue.jpg';
      console.log($scope.marketimg);
    }else if(currentOrg==='Wellesley'){
      $scope.marketimg = '../images/wellesley.jpg';
    }else if(currentOrg==='Berkeley'){
      $scope.marketimg = '../images/berkeley.jpg';
    }else{
      $scope.marketimg = '../images/stanford.jpg';
    }

      $scope.findDetail = function(book) {
        $stateParams.itemId = book.$id;
        $state.go("checkout", {
          itemId: book.$id
        });
      };
      currentOrg = auth.getOrg();
      $scope.books = libServices.libGetOrgBook(currentOrg); //DB FOLDER MIGHT NOT EVEN EXIST AND IF IT DO IT EMPTY AS FUUUCK
      // $scope.books = fireBase.getOrgBook(currentOrg); //this is the market db of books, just for testing
    }
  ]);
