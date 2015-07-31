angular.module('omnibooks.checkout', [])
  .controller('CheckoutController', ['$scope', '$stateParams', '$modal', 'fireBase', 'bookAPI', 'auth', 'libServices',
    function($scope, $stateParams, $modal, fireBase, bookAPI, auth, libServices) {
      var currentOrg = auth.getOrg();
      var currentUser = auth.getUser();

      var displayDetail = function(res) {
        $scope.prices = res.data.data;
      };
      $scope.itemId = $stateParams.itemId;
      $scope.book = libServices.libGetUserBook(currentOrg, currentUser.$id, $scope.itemId, function(data) {
        bookAPI.getDetail(data.isbn, displayDetail);
      });

      $scope.modalMsgShown = false;
      $scope.toggleMsgModal = function() {
        console.log('is this running');
        if (!$scope.error) {
          $scope.modalMsgShown = !$scope.modalMsgShown;
          console.log($scope.modalMsgShown);
        }
      };
      $scope.dafuq = function() {
        $scope.modalMsgShown = $scope.modalMsgShown ? false : true;
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
