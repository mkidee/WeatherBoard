var searchBtn = document.querySelector('#searchBtn');

var city = document.querySelector('#searchArea').textContent;

console.log(city);


$("#searchBtn").on("click", function(event){
    event.preventDefault();
    console.log("hello");
});

searchBtn.addEventListener("click", function(){
    console.log("hello");
});
