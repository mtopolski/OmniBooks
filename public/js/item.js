angular.module('omnibooks.item', [])
  .controller('ItemController', ['$scope', '$state', '$stateParams', '$modal', 'fireBase', 'libServices', 'bookAPI', 'auth',
    function($scope, $state, $stateParams, $modal, fireBase, libServices, bookAPI, auth) {
      var currentOrg = auth.getOrg();
      var currentUser = auth.getUser();

      var displayDetail = function(res) {    //I believe this function is purely for prices
        $scope.prices = res.data.data;       //why can't books be like free and stuff man
      };
      $scope.itemId = $stateParams.itemId;
      $scope.book = fireBase.getUserBook(currentOrg, currentUser.$id, $scope.itemId, function(data) {
        bookAPI.getDetail(data.isbn, displayDetail);
      });

      $scope.modalShown = false;
      $scope.toggleModal = function() {
        if (!$scope.error) {
          $scope.modalShown = !$scope.modalShown;
        }
      };

      $scope.getRating = function(user) {
        // libServices.libUpdateUserRating(currentOrg, 'Ian', 4);
        libServices.libGetUserRating(currentOrg, user);         // will return null if no rating
        var userInfo = fireBase.getUserInfo(currentOrg, user);
        console.log("userInfo", userInfo);
        var userArray = [];
        fireBase.getUsersList(currentOrg, function(val) {
          userArray.push(val);
          console.log("from get users", val.$id);
        });
      };

      $scope.findUserDetail = function(user) {
        // obatin user id
        // libServices.libGetUserRating
        var userInfo = fireBase.getUserInfo(currentOrg, user);
        // console.log("userInfo", userInfo);
        $stateParams.userId = userInfo.$id;
        $state.go("users", {
          userId: userInfo.$id
        });
      };
    }
  ])
  .factory('bookAPI', function($http) {
    var key = 'UTUJEB5A';
    var getDetail = function(isbn, callback) {
      return $http({
          method: 'GET',
          url: '/bookDetail',
          params: {
            'book_isbn': isbn
          }
        })
        .then(function(res) {
          callback(res);
        });
    };

    return {
      getDetail: getDetail
    };
  });
