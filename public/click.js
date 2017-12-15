angular.module('buttons',[])
  .controller('buttonCtrl',ButtonCtrl)
  .factory('buttonApi',buttonApi)
  .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function ButtonCtrl($scope,buttonApi){
   $scope.buttons=[]; //Initially all was still
   $scope.transaction=[];
   $scope.total=[];
   $scope.errorMessage='';
   $scope.logMessage='';
   $scope.deleteItem=deleteItem;
   $scope.isLoading=isLoading;
   $scope.refreshButtons=refreshButtons;
   $scope.refreshList=refreshList;
   $scope.buttonClick=buttonClick;

   var loading = false;

   function isLoading(){
    return loading;
   }

  function deleteItem($event){
    $scope.errorMessage='';
    buttonApi.deleteItem(event.target.id)
       .success(function(){
         refreshList();
       })
       .error(function(){$scope.errorMessage="Unable click";});
  }

  function refreshButtons(){
    loading=true;
    $scope.errorMessage='';
    buttonApi.getButtons()
      .success(function(data){
         $scope.buttons=data;
         loading=false;
      })
      .error(function () {
          $scope.errorMessage="Unable to load Buttons:  Database request failed";
          loading=false;
      });
 }

 function refreshList(){
   loading=true;
   $scope.errorMessage='';
   buttonApi.getTransation()
     .success(function(data){
        $scope.transaction=data;
        getTotalAmount();
        loading=false;
     })
     .error(function () {
         $scope.errorMessage="Unable to load Buttons:  Database request failed";
         loading=false;
     });
  }

  function buttonClick($event){
     $scope.errorMessage='';
     buttonApi.clickButton(event.target.id)
        .success(function(){
          refreshList();
        })
        .error(function(){$scope.errorMessage="Unable click";});
  }

  function getTotalAmount(){
    loading=true;
    $scope.errorMessage='';
    buttonApi.totalAmount()
      .success(function(data){
        $scope.amount=data[0].TOTAL;
        loading=false;
      })
      .error(function(){$scope.errorMessage="Unable to get total transaction amount";});
  }

  refreshButtons();
  refreshList();
}

function buttonApi($http,apiUrl){
  return{
    clickButton: function(id, utcDate){
      var url = apiUrl+'/click?id='+ id + '&time=' + utcDate;
      console.log("Attempting with "+url);
      return $http.post(url);
    },
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
    getTransation: function(){
      var url = apiUrl + '/transaction';
      console.log("Attempting with " + url);
      return $http.get(url);
    },
    deleteItem: function(id){
      var url = apiUrl + '/delete?id=' + id;
      console.log("Attempting with "+url);
      return $http.post(url);
    },
    totalAmount: function(){
      var url = apiUrl + '/total';
      console.log("Attempting with "+url);
      return $http.get(url);
    }
 };
}
