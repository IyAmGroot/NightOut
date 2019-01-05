// INITIALIZE FIREBASE--------------------------------------------------------------------------------------//

var config = {
    apiKey: "AIzaSyDOlqaA7ds8o2V_6B9OSD3Vm8A0M-Q-dAM",
    authDomain: "nightout-c139f.firebaseapp.com",
    databaseURL: "https://nightout-c139f.firebaseio.com",
    projectId: "nightout-c139f",
    storageBucket: "",
    messagingSenderId: "87971422557"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var auth = firebase.auth();
     
// REGISTERING USER  ----------------------------------------------------------------------------------------//
  
  $("#registerBtn").on("click", function(event) {
    
      event.preventDefault(); //prevents page from reloading
      
      // Grabs user input
      var userName = $("#inputName").val().trim();   
      var userEmail = $("#inputEmail").val().trim();
      var userPhone = $("#inputPhone").val().trim();  
      var userBirth = $("#inputBirth").val().trim();  
      var userAge = $( "#inputAge option:selected" ).text();       
      var userGender = $( "#inputGender option:selected" ).text();       
      var userAddress = $("#inputAddress").val().trim();      
      var userCity = $("#inputCity").val().trim();      
      var userState = $( "#inputState option:selected" ).text();          
      var userZip = $("#inputZip").val().trim();
      var user1Genre = $( "#input1Genre option:selected" ).text();    
      var user2Genre = $( "#input2Genre option:selected" ).text();   
      var user3Genre = $( "#input3Genre option:selected" ).text();   
   
      // Creates local "temporary" object for holding user data-------------------------------------------//
      var newUser = {
        name: userName,
        email: userEmail,
        phone: userPhone,
        birth: userBirth,
        age: userAge,
        gender: userGender,
        address: userAddress,
        city: userCity,
        state: userState,
        zip: userZip,
        genre1: user1Genre,
        genre2: user2Genre,
        genre3: user3Genre,
      };
  
      // Uploads user data to the database
      database.ref().push(newUser);
       
      
      // Alert box  --------------------------------------------------------------------------------------//

      alert("You have been successfully registered!");

      // var message = "You have been registered!";
      // var title = "Great!";
      // console.log(message);

      // // $.extend({ alert: function (message, title) {
      // //   console.log(title);
      // //   $("<div></div>").dialog( {
      // //     buttons: { "Ok": function () { $(this).dialog("close"); } },
      // //     close: function (event, ui) { $(this).remove(); },
      // //     resizable: false,
      // //     title: title,
      // //     modal: true
      // //   }).text(message);
      // // }
      // // });

      // Clears all of the text-boxes -------------------------------------------------------------------//
      $("#inputName").val("");
      $("#inputEmail").val("");
      $("#inputBirth").val("");
      $("#inputAge").val("");
      $("#inputGender").val("");
      $("#inputPhone").val("");
      $("#inputAddress").val("");
      $("#inputCity").val("");
      $("#inputState").val("");
      $("#inputZip").val("");
      $("#input1Genre").val("");    
      $("#input2Genre").val(""); 
      $("#input3Genre").val(""); 

      window.location.href = "movieSearch.html";

      });



// VERIFYING EMAIL AND LOGIN TO SIGN IN

    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    var uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';
        }
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInSuccessUrl: 'movieSearch.html',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
            
      // Terms of service url.
      tosUrl: 'movieSearch.html',
      // Privacy policy url.
      privacyPolicyUrl: '<your-privacy-policy-url>'
    };
    ui.start('#firebaseui-auth-container', uiConfig);