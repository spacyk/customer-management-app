var conf = angular.module('configurator', ['schemaForm', 'ngRoute', 'ui.bootstrap', 'angular-json-editor', 'ngclipboard']);

conf.config(
        function($routeProvider, JSONEditorProvider) {
            JSONEditorProvider.configure({
                defaults: {
                    options: {
                        disable_edit_json: true,
                        disable_properties: true,
                        required_by_default: true,
                        display_required_only: false,
                        iconlib: 'fontawesome4',
                        theme: 'bootstrap3',
                        ajax: false 
                    } 
                }
            });

            $routeProvider.
            when('/comp/:component/:param?', {
                templateUrl: 'sites/main.html',
                controller: 'main_json'
            }).
            when('/id/:uuid/:param?', {
                templateUrl: 'sites/main.html',
                controller: 'main_json'
            }).
            when('/notfound', {
                templateUrl: 'sites/notfound.html'
            }).
            when('/testingurl2', {
                templateUrl: 'sites/test2.html',
                controller: 'test_config2'
            }).
            otherwise({
                redirectTo: '/notfound'
            });


        }),
conf.run(function($rootScope) {
        $rootScope.validor = false;
        $rootScope.changed = true;
        $rootScope.show = false;
        $rootScope.validate = function(val) {
            if(val) {$rootScope.validor = true;}
            else    {$rootScope.validor = false;}
            $rootScope.show = true;
            $rootScope.changed = false;
        
        };

}),


conf.controller('main_json', function($scope, $http, $routeParams, $rootScope, $location) {
                                     var defAlertKeys = ["GEN:WIN:GEN:R:C:System Disk Cleanup and Disk Usage-V2.6", "GEN:WIN:SMI:R:C:ITM Agent Offline-V3.1"];
                                     $scope.showKeys = true;
                                     $scope.showValues = false;
                                     $scope.showIds = false;
                                     $scope.notShowValues = false;
                                     $scope.notShowIds = false;
                                     $scope.timestamp = "";
                                     $scope.uuid = "";
                                     $scope.url = "";
                                     $scope.keys = "";
                                     $scope.values = "";
                                     $scope.ids = "";
                                     $scope.nvalues = "";
                                     $scope.nids = "";
                                     $scope.model = {};
                                     //To check if model is empty object (no form will be generated)
                                     $scope.empty = false;
                                     $scope.component = "";
                                     $scope.mySchema = {};
                                     $scope.save = 0;
             // check whether valid parameter provided
             if ($routeParams.component != undefined || $routeParams.uuid != undefined) {

                 if ($routeParams.param != undefined) {
                        switch ($routeParams.param) {
                            case "valuesids":
                                $scope.showValues = true;
                                $scope.showIds = true;
                                break;
                            case "values":
                                $scope.showValues = true;
                                break;
                            case "ids":
                                $scope.showIds = true;
                                break;
                            case "nvalues":
                                $scope.notShowValues = true;
                                break;
                            case "nids":
                                $scope.notShowIds = true;
                                break;
                            case "scheduled":
                                $scope.showKeys = false;
                                break;
                            default:
                     }
                 
                 }

                 if ($routeParams.component != undefined) {
                                $scope.component = $routeParams.component;
                                $http.get("/baad/api/get_schema/"+$scope.component)
                                      .then(function(response) {        
                                           $scope.output = response.data.output;
                                           if($scope.output == "Not found"){
                                               $location.path( "/notfound" );
                                               }
                                           else{
                                               var schema = $scope.output.json_schema;
                                               $scope.mySchema = schema;


                          }

                })              // If default alert keys allowed set them, ALLOWED FOR ALL NOW
                               // if (defAlertKeys.indexOf($scope.component) > -1){
                                     var json = {"automaton_name":"","imt_id":null,"type":"a","version":""}
                                     var spl = $scope.component.split("-V");
                                     json['automaton_name'] = spl[0];
                                     json['version'] = spl[1];
                                     $http.post("/baad/api/get_config", json)
                                                     .then(function (response) {
                                                           $scope.response = response.data;
                                                           if ("lists" in $scope.response){
                                                                $scope.keys = $scope.response.lists.alertkey;
                                                           }
                                                  })
                                              // }
                                
                  }
                                
     
                 else if($routeParams.uuid != undefined){
                               $scope.uuid = $routeParams.uuid;
                               var component_input = {};
                               component_input = $http.get("/baad/api/load_created/"+$scope.uuid)
                                    .then(function (response) {
                                        $scope.output = response.data.output;
                                        if ($scope.output == "Load failed"){
                                            $location.path( "/notfound" );
                                          }
                                        else {       
                                            var schema = $scope.output.json_schema;
                                            $scope.mySchema = schema;
                                            $scope.component = $scope.output.component;
                                            /*
                                             if (noKeysList.indexOf($scope.component) > -1){
                                                      $scope.hideKeys = true;                                                                                                                                                                              }
                                            */
                                            $scope.timestamp = "Created: " + $scope.output.timestamp;
                                            $scope.keys = $scope.output.alert_keys;
                                            $scope.values = $scope.output.instance_values;
                                            $scope.ids = $scope.output.instance_ids;
                                            $scope.nvalues = $scope.output.n_instance_values;
                                            $scope.nids = $scope.output.n_instance_ids;
                                           
                                            if($scope.output.hasOwnProperty("component_input")){                
                                                component_input = $scope.output.component_input;
                                                return component_input;
                                            }
                                        }
                            
                 })     
                                $scope.myStartVal = component_input;        
                }
             }
                 else{
                      $location.path( "/notfound" );
                 }



        $scope.onChange = function (data) {
                           $rootScope.changed = true;
                           $scope.model = data;
                           $scope.empty = angular.equals(JSON.stringify($scope.model), '{}');
                               if ($scope.empty) {
                                    $rootScope.validor = true;
                                    $rootScope.changed = false;
                                 }

                           };

        
        $scope.insertNewJson = function(component, json, keys, values, ids, nvalues, nids) {
                           var whole = {}
                           whole["component_input"] = json;
                           whole["alert_keys"] = String(keys);
                           whole["instance_values"] = String(values);
                           whole["instance_ids"] = String(ids);
                           whole["n_instance_values"] = String(nvalues);
                           whole["n_instance_ids"] = String(nids);
                           $http.post("/baad/api/insert_json/"+component, whole)
                                .then(function (response) {
                                      $scope.save = 1;
                                      $scope.keys = response.data.output.alert_keys;
                                      $scope.values = response.data.output.instance_values;
                                      $scope.ids = response.data.output.instance_ids;
                                      $scope.nvalues = response.data.output.n_instance_values;
                                      $scope.nids = response.data.output.n_instance_ids;
                                      $scope.uuid = response.data.output.uuid;
                                      $scope.timestamp ="Created: " + response.data.output.timestamp;
                                      $scope.url = "https://aconfigurator.webreports.ipctrnl02.com/#/id/" + $scope.uuid;
                                      if ($routeParams.param != undefined) { $scope.url = $scope.url + "/" + $routeParams.param; }
                                             })
                                    }
                            
                        })




conf.controller('test_config2', function($scope, $http, $routeParams) {


            $scope.mySchema = {
                        type: 'object',
            properties: {
                            name: {
                                                type: 'string',
                    title: 'Item Name',
                    required: true,
                    minLength: 1
                    },
                age: {
                                    type: 'integer',
                    title: 'Age',
                    required: true,
                    min: 0
                    }
            }
        };
                 $scope.myStartVal = {
                             age: 25
                                     };

            

                    $scope.onChange = function (data) {
                                console.log('Form changed!');
                                        console.dir(data);
                                            };//console.log('onSubmit data in sync controller', $scope.editor.getValue());
    })

