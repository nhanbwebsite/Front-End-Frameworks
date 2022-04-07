<<<<<<< HEAD
var app = angular.module('assignment', ['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'home.html'
    })
    .when('/subjects',{
        templateUrl:'../layout/subjects.html'
    })
    
})
app.directive('quizPoly', function (quizFactory) {
    return {
        restrict: 'AE',
        scope:{},
        templateUrl: '../layout/thi.hmtl',
        link: function (scope, element, attr) {
            scope.start = function(){
                scope.id=1;
                scope.quizOver = false;//Chưa hoàn thành quiz
                scope.inProgess=true;
                scope.getQuestion();
            };
            scope.end = function(){
                scope.id=1;
                scope.inProgess=true;
                scope.getQuestion();
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
                        scope.quizOver = true; //khi hết câu hỏi thì true
                }
                // localStorage.setItem("quiz",JSON.stringify(quiz));
                // console.log(quiz);
            }
            scope.checkAnswer = function(){
                if(!$('input[name = answer]:checked').length) return;
                var ans = $('input[name="answer"]:checked').val();
                console.log(ans);
                if(ans == scope.answer){
                    // alert('answer');
                    scope.score++;
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
                if(scope.id <=10){
                    document.querySelector('#chuyen').disabled = true;
                }
                scope.getQuestion();
            }
            scope.prevQuestion = function(){
                scope.id--;
                scope.getQuestion();
            }
            scope.reset();
        }
    }
});
app.factory('quizFactory',function($http){
    $http.get('http://localhost:3000/quiz').then(function(res){
        questions = res.data;
    console.log(questions.length);
    });
    return {
        getQuestion:function(id){
            var ramdomItem = questions[Math.floor(Math.random()*questions.length)];
            var count = questions.length;
            if (count>10){
                count = 10;
            }
            if(id<10){
                return ramdomItem;
                
            }else{
                return alert('Bấm Vào Nút Kết Thúc Bài Thi');
            }
    }
    }
=======

var app = angular.module("assignment", []);
app.controller("myController", function ($scope,$http) {
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

>>>>>>> add11b57b9791b9e30f27be86bb6a61da4122d75
});
