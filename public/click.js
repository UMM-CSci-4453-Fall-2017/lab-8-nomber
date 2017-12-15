angular.module('buttons',[])
  .controller('buttonCtrl',ButtonCtrl)
  .factory('buttonApi',buttonApi)
  .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function ButtonCtrl($scope,buttonApi){
   $scope.buttons=[]; //Initially all was still
   $scope.list=[];
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
   buttonApi.getList()
     .success(function(data){
        $scope.list=data;
        getTotalAmt();
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

  function getTotalAmt(){
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
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
    clickButton: function(id, utcDate){
      var url = apiUrl+'/click?id='+ id + '&time=' + utcDate;
      console.log("Attempting with "+url);
      return $http.post(url);
    },
    getList: function(){
      var url = apiUrl + '/list';
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
