var submit = document.getElementById('submit_btn');
submit.onclick = function () {
  //Create a request object
  var request =  new XMLHttpRequest();
  
  //Capture the response and store it in a variable
  request.onreadystatechange = function () {
      if(request.readyState === XMLHttpRequest.DONE) {
          //Take some action
          if(request.status === 200) {
                console.log('user logged in');
                alert('Logged in successfully.');
          } else if(request.status === 403) {
              alert('Username/password incorrect');
          } else if(request.status === 500) {
              alert('Something went wrong on the server');
          }
      }
      //Not done yet
  };
  
  //Make the request
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open('POST', 'http://acharya221b.imad.hasura-app.io/login', true); 
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({username: username, password: password}));
  
 /* //Capture a list of names and render it as a list
  var names=['name1', 'name2', 'name3', 'name4'];
  var list='';
  for(var i=0; i < names.length; i++) {
      list += '<li>' + names[i] + '</li>';
  }
  var ul=document.getElementById('namelist');
  ul.innerHTML = list;*/
};



/*console.log('Loaded!');
//Change the text of the main-text div
var element = document.getElementById('main-text');
element.innerHTML = 'New Value';

//Move the image
var img = document.getElementById('madi');

var marginLeft = 0;
function moveRight ()
{
    marginLeft = marginLeft + 1;
    img.style.marginLeft = marginLeft + 'px';
}

img.onclick = function() {
 var interval = setInterval(moveRight,50);  
};
*/

//Counter Code
var button = document.getElementById('counter');
button.onclick = function () {
  //Create a request object
  var request =  new XMLHttpRequest();
  
  //Capture the response and store it in a variable
  request.onreadystatechange = function () {
      if(request.readyState === XMLHttpRequest.DONE) {
          //Take some action
          if(request.status === 200) {
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
          }
      }
      //Not done yet
  };
  
    //Make the request
    request.open('GET', 'http://acharya221b.imad.hasura-app.io/counter', true);
    request.send(null);
};

/*
//Submit name

var submit = document.getElementById('submit_btn');

submit.onclick = function () {
  //Create a request object
  var request =  new XMLHttpRequest();
  
  //Capture the response and store it in a variable
  request.onreadystatechange = function () {
      if(request.readyState === XMLHttpRequest.DONE) {
          //Take some action
          if(request.status === 200) {
                //var counter = request.responseText;
                //var span = document.getElementById('count');
                //span.innerHTML = counter.toString();
                //Capture a list of names and render it as a list
                var names= request.responseText; //instead of var names=['name1', 'name2', 'name3', 'name4'];
                //request.responseText is a string of names
                 names= JSON.parse(names); //Converting string to Javascript array of objects
                  var list='';
                  for(var i=0; i < names.length; i++) {
                      list += '<li>' + names[i] + '</li>';
                  }
                  var ul=document.getElementById('namelist');
                  ul.innerHTML = list;
          }
      }
      //Not done yet
  };
  */
   /* //Make the request
    var nameInput = document.getElementById('name');
    var name = nameInput.value;
    request.open('GET', 'http://acharya221b.imad.hasura-app.io/submit-name?name=' + name, true); 
    //Instead of '/counter' we write /submit-name?name='+name
    request.send(null); */
  
  //Submit username/password to login


