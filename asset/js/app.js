
var app = angular.module("assignment", []);
app.controller("dkdnController", function ($scope,$http) {
    // đăng ký tài khoản
  $scope.dangKyTK = function () {
    var password = $scope.password;
    var confirmpassword = $scope.confirmpassword;
    if(password === confirmpassword) {
        var data = {
            fullname : $scope.fullname,  
            username: $scope.username,
            password : $scope.password,
            email: $scope.email,
        };
        
        $http.post('http://localhost:3000/Students',data)
        .then(function(response) {
                alert('Đăng ký tài khoản thành công')
        }), then(function(response){
            alert('Đăng ký tài khoản thất bại');
        })
    }
   

     // đăng nhập

    

   
  };

  $scope.btnDN = function(e){
    var username = $scope.username;
    var password = $scope.password;

    $http.get('http://localhost:3000/Students')
    .then(function(response){
      
        var arrayGet = response.data;

       var userGet = arrayGet.find(function(item){
            return item.username == username;
        })
       
        if(userGet){
            if(userGet.password == password){
                // init locastore user
                setItemLocastore('Userlogin',username)
                location.reload();
            } else {
                alert('Sai mật khẩu');
            }
        } else {
            alert('sai tên đăng nhập');
        }
    })
 }

 var UserLogin = getItemLocaStore('Userlogin');
 if(UserLogin){
    $http.get('http://localhost:3000/Students')
    .then(function(response){
        var data = response.data;
     var getUserLogin =   data.find(function(item){
            return item.username = UserLogin;
        })

        var box__user = document.querySelector('.box__dk-dn-item');
        box__user.innerHTML = ''
        var spanElemnt = document.createElement('span');
        spanElemnt.innerHTML = `
        <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
         ${getUserLogin.fullname}
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><a class="dropdown-item" href="#">Quản lý tài khoản</a></li>
          <li><a class="dropdown-item btn_dx"  href="#">Đăng xuất</a></li>
        </ul>
      </div>
        `
        box__user.appendChild(spanElemnt);
        var btn_dx = spanElemnt.querySelector('.btn_dx');
        btn_dx.onclick = function () {
            removeItemLocastore('Userlogin')
            location.reload();
        }

    })
  
 }

 
 function setItemLocastore(name, data) {
     localStorage.setItem(name, JSON.stringify(data));
 }

 function getItemLocaStore(name) {
     return JSON.parse(localStorage.getItem(name));
 }

 function removeItemLocastore(name) {
     localStorage.removeItem(name);
 }

});
