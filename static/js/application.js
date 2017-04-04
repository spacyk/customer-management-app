var app = angular.module('customerapp', ['ngResource']);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);


app.factory('Customer', function($resource) {
    return $resource('/customer/:id', {
      id: '@id'
    },{
      delete_customer: {
        method: 'DELETE'
      }
    });
  });


app.controller('change', function($scope, Customer) {

    $scope.customs = Customer.query();

    $scope.deleteCustomer = function(customer) { // Delete a customer. Issues a DELETE to /customer/:id
        customer.$delete_customer(function() {
            $scope.customs = Customer.query();
        });
    };


});
