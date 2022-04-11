var app = angular.module("danh_sach_mon_thi", []);
app.controller("load", function ($scope, $http) {
  $scope.ds_mon_thi = [];
  $http.get("http://localhost:3000/Subjects").then(
    function (response) {
      $scope.ds_mon_thi = response.data;
    },
    function (response) {
      alert("Lỗi load data");
    }
  );
});
