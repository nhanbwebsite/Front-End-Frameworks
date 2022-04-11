var app = angular.module('assignment', ['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'home.html'
    })
    .when('/subjects',{
        templateUrl:'subjects.html',
        controller:'subjectsCtrl'
    })
    .when('/quiz/:id/:name',{
        templateUrl:'baithi.html',
        // controller:'quizController'
    })
    .when('/quan-ly-tai-khoan',{
        templateUrl:'suathongtin.html',
        controller:'quanlytaikhoan'
    })
    .when('/quen-mk',{
        templateUrl:'quenmk.html',
        controller:'quenmk'
    })
   
});
app.controller('subjectsCtrl',function($scope,$http){
    $scope.list_subject = [];
    $http.get('http://localhost:3000/Subjects').then(function(res){
        $scope.list_subject = res.data;
    })
   
})
app.controller('quenmk',function($scope,$http){
    var btn_laymk = document.querySelector('#btn_laymk');
    btn_laymk.onclick = function(){
        $http.get('http://localhost:3000/Students')
        .then(function(res){
           data = res.data;
           var emailInput = document.querySelector('#laylaimk').value;
          var user = data.find(function(item){
               return item.email = emailInput;
           })
         if(user){
           document.querySelector('#mklayLai').innerHTML = 'Mật khẩu của bạn là: ' + user.password
         }
        })
    }

   
})
app.controller('quizController',function($scope,$http,$routeParams,quizFactory){
   
    $http.get('http://localhost:3000/' + $routeParams.id)
    .then(function(response){
      
        quizFactory.question = response.data;
        // console.log(response)
       
    })
// app.controller('timeOut',function($scope,$timeOut){
//     $scope.
// })
    // $http.get('http://localhost:3000/' + $routeParams.id).then(function(res){
       
    //     quizFactory.question = res.data;
      
    // })
})
app.directive('quizPoly', function (quizFactory,$routeParams,$timeout,$window) {

    return {
        restrict: 'AE',
        scope:{},
        templateUrl: 'templateQuiz.html',
        link: function (scope, element, attr) {
            scope.start = function(){
                
                var local =  $window.localStorage['Userlogin'];
              if(local) {
                scope.id=0;
                scope.mang_dap_an = [];
                scope.quizOver = false;//Chưa hoàn thành quiz
                scope.inProgess=true;
                scope.showDiem = false;
                scope.getQuestion();
                scope.timeOut();
                scope.subject = $routeParams.id
                scope.subject_name = $routeParams.name
              } else{
                $window.alert("Vui lòng đăng nhập để làm bài thi");
              }
               
                // time out
            };
            scope.end = function(){
                scope.quizOver = true;
                scope.showDiem = true;
                clearInterval(scope.dongho)
               
            }
           scope.timeOut = function(){
               var phut = 5-1;
               var giay = 60;
               scope.dongho=setInterval(function(){
                if(giay!=0)
                {
                    giay--;
                }
                else
                {
                    phut--;
                    giay=60-1;
                }
             
                document.getElementById("time").innerHTML=phut+":"+giay;
                if(phut==0 && giay==0)
            {
                scope.elementDiem = document.querySelector('.diem_max');
                scope.elementDiem.innerHTML = scope.diem;
                    clearInterval(dongho);
            }
    
            },1000);
                $timeout(function(){
                  
                    scope.showDiem = true;
                    scope.quizOver = true;
                },500000)
           }
            scope.reset = function(){
                scope.inProgess=false;
                scope.score = 0;
            };
            scope.getQuestion = function(){
                var quiz = quizFactory.getQuestion(scope.id);

                if(quiz){
                   
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.answerMode = true;
                }else{
                        // scope.quizOver = true; //khi hết câu hỏi thì true
                }
               
            }
            scope.checkAnswer = function(){
                if(!$('input[name = answer]:checked').length) return;
                var ans = $('input[name="answer"]:checked').val();
                
              
               
                if(ans == scope.answer){
                    // alert('answer');
                    scope.score++;
                    scope.mang_dap_an.push(ans);
                    scope.diem_max = scope.mang_dap_an.length
                    scope.correctAns = true;
                }else{
                    // alert('sai');
                    scope.correctAns = false;
                }
                scope.answerMode = false;
                // console.log(scope.answer);
            };
           
            scope.nextQuestion = function(){
                scope.id++;
                if(scope.id >=10){
                    scope.id = 0;
                    // document.querySelector('#chuyen').disabled = true;
                }
                scope.getQuestion();
            }
            scope.prevQuestion = function(){
                scope.id--;
                if(scope.id < 0){
                    scope.id = 9;
                }
                scope.getQuestion();
            }
            scope.reset();
        }
    }
});
app.factory('quizFactory',function($http,$routeParams){
    $http.get('http://localhost:3000/' + $routeParams.id).then(function(res){
        ma_de = $routeParams.id;
        
        questions = res.data;
      var arrayQ = [];
        var numRandom = Math.floor(Math.random()*questions.length);
       
         for(var i = 0; i < 10; i++){
            var numRandom = Math.floor(Math.random()*questions.length);
            arrayQ.push(questions[numRandom])
         }

        
         questions = arrayQ
     console.log(questions)

    })
    return {
        
        getQuestion:function(id){
            
            var ramdomItem = questions[id];
         
       
          
            var count = questions.length;
            if (count>=10){
                id= 0;

            }
            if(id<10){
                return ramdomItem;
                
            }else{
                return alert('Bấm Vào Nút Kết Thúc Bài Thi');
            }
    }
    }






    
});

app.controller('quanlytaikhoan',function($scope,$window,$http){
    var local =  $window.localStorage['Userlogin'];
    if(local){
     var user = JSON.parse(local);

    $http.get('http://localhost:3000/Students')
    .then(function(response){
       var data = response.data
       console.log(data)
        var returnData = data.find(function(item){
            return item.username == user;
        })

        if(returnData){
         var username = document.querySelector('#username');
         var idUser = document.querySelector('#idUser');
         var password = document.querySelector('#password');
         var email = document.querySelector('#email');
         var fullname = document.querySelector('#fullname');
         idUser.value = returnData.id
        username.value = returnData.username
        email.value = returnData.email
        fullname.value = returnData.fullname
        password.value = returnData.password
        var luu = document.querySelector('#save');
            luu.onclick = function(){
                var fullnamee = document.querySelector('#fullname');
                var password = document.querySelector('#password');
                var username = document.querySelector('#username');
                var idUser = document.querySelector('#idUser');
                var email = document.querySelector('#email');
                var idUser = document.querySelector('#idUser').value;

                data = {
                    fullname: fullnamee.value,
                    username: username.value,
                    email: email.value,
                    password: password.value
                }
               var con =  $http.put('http://localhost:3000/Students/' + idUser, data);
               if(con){
                   alert('Cập nhật thành công');
               }


            }

            var btndoiml = document.querySelector('#btndoiml');
            btndoiml.onclick = function(){
                var mk_curen = document.querySelector('#mk_curen');
                var mk_change = document.querySelector('#mk_change');
                var mk_change_confirm = document.querySelector('#mk_change_confirm');
              if(mk_curen.value != returnData.password) {
                  $window.alert('Mật khẩu hiện tại không đúng')
              }  else {
                  if(mk_change.value != mk_change_confirm.value){
                    $window.alert('Mật khẩu xác nhận không trùng khớp')
                  } else {
                    var idUser = document.querySelector('#idUser').value;
                data = {
                    password: mk_change.value
                }
                var con =  $http.patch('http://localhost:3000/Students/' + idUser, data);
                if(con){
                    $window.alert('Đổi mật khẩu thành công')
                }
                  }
              }
            }

        }

        
    })
    
    }
})

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
            return item.username == UserLogin;
        })

        var box__user = document.querySelector('.box__dk-dn-item');
        box__user.innerHTML = ''
        var spanElemnt = document.createElement('span');
        spanElemnt.innerHTML = `
        <div class="dropdown boxDangNhap">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
         ${getUserLogin.fullname}
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><a class="dropdown-item" href="#!quan-ly-tai-khoan">Quản lý tài khoản</a></li>
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
