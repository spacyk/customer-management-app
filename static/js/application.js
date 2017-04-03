var conf = angular.module('userapp', ['ngRoute', 'ngResource']);

conf.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

conf.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);


conf.factory('Customer', function($resource) {
    return $resource('/customer/:id', {
      id: '@id'
    },{
      delete_customer: {
        method: 'DELETE'
      }
    });
  });


conf.controller('change', function($scope, $location, Customer) {

    $scope.customs = Customer.query();

    $scope.deleteCustomer = function(customer) { // Delete a customer. Issues a DELETE to /customer/:id
        customer.$delete_customer(function() {
            $scope.customs = Customer.query();
        });
    };


});
