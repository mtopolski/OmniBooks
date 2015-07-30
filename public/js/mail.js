angular.module('omnibooks.mail', [])
  .controller('MailController', ['$scope', '$http', '$modal', 'fireBase', 'auth',
    function($scope, $http, $modal, fireBase, auth) {

      $scope.sendMail = function() {
        var currentOrg = auth.getOrg();
        var currentUser = auth.getUser().$id;
        var offerAmt = $scope.offer;


        // get current user's email
        var emailFrom;
        var currentUserEmail = fireBase.getUserEmail(currentOrg, currentUser, function(data) {
          emailFrom = data;
        });

        // get book details
        var bookOwner;
        var bookTitle;
        var bookAskingPrice;
        var bookInfo = fireBase.getUserBook(currentOrg, currentUser, $scope.itemId, function(data) {
          bookOwner = data.createdBy;
          bookTitle = data.title;
          bookAskingPrice = data.askingPrice;
        });

        // addl user message
        var userMsg = "";
        if ($scope.userMsg) {
          if ($scope.userMsg.length !== 0) {
            userMsg = "\nHere's a message from the sender: \n\n" + $scope.userMsg;
          }
        }

        // get seller's email
        var emailTo;
        var sellerUserEmail = fireBase.getUserEmail(currentOrg, bookOwner, function(data) {
          emailTo = data;
          // aggregate info for email

        //prep email based on offer or checkout request
        var messages = {
          offer: ({
            to: emailTo,
            from: emailFrom,
            subject: "Hey, " + bookOwner + " - You have received an offer on " + bookTitle + "!",
            // html: "content",
            text: "You have received an offer on " + bookTitle + " for $" + offerAmt + "!\n" +
              "You posted this book for $" + bookAskingPrice + "\n" +
              "You can respond to this offer, by emailing the buyer at " + emailFrom + ".\n" +
              userMsg + 
              "\n\nThanks for using OmniBooks!"
          }),
          checkout: ({
            to: emailTo,
            from: emailFrom,
            subject: "Hey, " + bookOwner + " - You have received a checkout request on " + bookTitle + "!",
            text: "You have received a checkout request on " + bookTitle + "!\n" +
              "You can respond to this request by emailing the requester at " + emailFrom + ".\n" +
              userMsg + 
              "\n\nIf you do end up sharing this book, make sure to confirm you have done so " +
              "with the following link- " + "127.0.0.1:8000/checkout/" + currentOrg + '/' + 
              bookOwner + '/' + currentUser // + craft a sexy link to route to db query
          })
        };

          var msg = offerAmt === null ? messages.checkout : messages.offer;

          // post request to express routing
          $http.post('/sendMail', msg).
          success(function(data, status, headers, config) {
            console.log("message posted");
            $scope.offer = "";
            $scope.userMsg = "";
          }).
          error(function(data, status, headers, config) {
            console.log("error", data);
          });
        });
      };

      $scope.modalMsgShown = false;
      $scope.toggleMsgModal = function() {
        if (!$scope.error) {
          $scope.modalMsgShown = !$scope.modalMsgShown;
        }
      };
    }
  ])
  .directive('mailModal', ['', function() {
    return {
      scope: {
        show: '='
      },
      require: 'ngModel',
      restrict: 'A',
      templateUrl: "../html/mail.html",
      replace: true,
    };
  }]);
