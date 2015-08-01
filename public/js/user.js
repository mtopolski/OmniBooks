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

  // user rating:
  $scope.rating = 0;
  $scope.ratings = [{
      current: 3,
      max: 5
  }];

  $scope.getSelectedRating = function (rating) {
      // console.log(rating);
    $scope.ratingValue = rating;
  }
}])
.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});
