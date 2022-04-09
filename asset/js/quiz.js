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
});
app.controller('subjectsCtrl',function($scope,$http){
    $scope.list_subject = [];
    $http.get('http://localhost:3000/Subjects').then(function(res){
        $scope.list_subject = res.data;
    })
})
app.controller('quizController',function($scope,$http,$routeParams,quizFactory){
   
    $http.get('http://localhost:3000/' + $routeParams.id)
    .then(function(response){
      
        quizFactory.question = response.data;
        // console.log(response)
       
    })

    // $http.get('http://localhost:3000/' + $routeParams.id).then(function(res){
       
    //     quizFactory.question = res.data;
      
    // })
})
app.directive('quizPoly', function (quizFactory,$routeParams) {

    return {
        restrict: 'AE',
        scope:{},
        templateUrl: 'templateQuiz.html',
        link: function (scope, element, attr) {
            scope.start = function(){
                scope.id=1;
                scope.quizOver = false;//Chưa hoàn thành quiz
                scope.inProgess=true;
                scope.getQuestion();
                scope.subject = $routeParams.id
                scope.subject_name = $routeParams.name
                // time out
            };
           
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
app.factory('quizFactory',function($http,$routeParams){
    $http.get('http://localhost:3000/' + $routeParams.id).then(function(res){
        ma_de = $routeParams.id;
        questions = res.data;
      
       

    })
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






    
});


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
