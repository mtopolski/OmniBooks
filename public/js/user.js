angular.module('omnibooks.user', ['ui.bootstrap','ngFileUpload','xeditable'])
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
})
.controller('UserController', ['$scope', '$stateParams', '$modal', '$state', 'auth', 'fireBase', 'libServices','Upload','$http', 'libServices',
  function($scope, $stateParams, $modal, $state, auth, fireBase, libServices, Upload, $http, libServices) {
  // obtain username from $stateParams
  $scope.username = $stateParams.userId;
  $scope.org = auth.getOrg();
  $scope.books = fireBase.getUserBookshelf($scope.org, $scope.username);
  $scope.libBooks = libServices.libGetUserBookshelf($scope.org, $scope.username);
  var userRating = libServices.libGetUserRating($scope.org, $scope.username)
  // Publish user rating!
  userRating.$loaded().then(function() {
    console.log("user Rating loaded!", userRating);
    $scope.userRating = userRating.$value;
  });

  if($scope.books.length === 0) {
    noBooks = true;
  }
}])
.directive('modal', function() {
  return {

  };
});
