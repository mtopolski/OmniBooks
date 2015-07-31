angular.module('omnibooks.item', [])
  .controller('ItemController', ['$scope', '$stateParams', '$modal', 'fireBase', 'libServices', 'bookAPI', 'auth',
    function($scope, $stateParams, $modal, fireBase, libServices, bookAPI, auth) {
      var currentOrg = auth.getOrg();
      var currentUser = auth.getUser();

      // var displayDetail = function(res) {    //I believe this function is purely for prices
      //   $scope.prices = res.data.data;       //why can't books be like free and stuff man
      // };
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

      $scope.getRating = function() {
        // libServices.libUpdateUserRating(currentOrg, 'Ian', 4);
        libServices.libGetUserRating(currentOrg, 'Ian');
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
