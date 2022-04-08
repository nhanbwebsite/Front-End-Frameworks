var app = angular.module('assignment', ['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
    .when('/subjects',{
        templateUrl:'../layout/subjects.html'
    })
    .when('/',{
        templateUrl:'home.html'
    })
})
app.directive('quizPoly', function (quizFactory) {
    return {
        restrict: 'AE',
        scope:{},
        templateUrl: '../layout/thi.html',
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
});
