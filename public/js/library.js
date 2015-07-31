angular.module('omnibooks.library', ['ngFx','ngAnimate'])
.controller('LibraryController', ['$state', '$scope', '$stateParams', 'fireBase', 'auth', 'libServices',
    function($state, $scope, $stateParams, fireBase, auth, libServices) {
    var currentOrg = auth.getOrg();
    var currentUser = auth.getUser();
    var libraryRatio = libServices.libGetUserLibraryRatio(currentOrg, currentUser.$id)

    $scope.allUsers = [];

    fireBase.getUsersList(currentOrg, function(user, index, users) {
      $scope.allUsers.push({id: user.$id, ratio: user.libraryRatio.checkout});
    });

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
        if (libraryRatio.$value < -1) {
          alert("You need to give more books before you can check any out");
        } else {
          $stateParams.itemId = book.$id;
          $state.go("checkout", {
            itemId: book.$id
          });
        }
      };
      currentOrg = auth.getOrg();
      $scope.books = libServices.libGetOrgBook(currentOrg); //This folder exists, and is empty, as we have no feature to add books to the library yet.
    }
  ]);
