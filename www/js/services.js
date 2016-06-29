angular.module('app.services', [])

.factory('Camera', ['$q', function($q) {
 // creating camera factory calls codova plugin to load native camera app
 //$q is used to give the controller a promise, check out the promise Api of angular for more details
 //$q and deferred is asynchronous programing and try, catch, throw is synchronous programming
 //== A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing
  return {
    getPicture: function(options) {
      // this is the same as try and catch, just asynchronous
      var deferred = $q.defer();
      navigator.camera.getPicture(function(result) {
        //calling codova plugin
        deferred.resolve(result);
      }, function(err) {
        deferred.reject(err);
      }, options);

      //handling the results
      return deferred.promise;
      //return a promise
    }

  }
}])
.factory('Authentication', function($rootScope, $firebase, $firebaseAuth, $firebaseObject, $state, $location){

  var auth = firebase.auth(); // holds data

  auth.onAuthStateChanged(function(authUser){
    if (authUser){
      var uid = authUser.uid;
      var userRef = database.ref('user/' + authUser.uid);
      var userObj = $firebaseObject(userRef);
      $rootScope.currentUser = userObj;
      console.log("currentUser");

    } else {
      $rootScope.currentUser = '';
    }
  });

  return {

    requireAuth: function() {
      
      var user = firebase.auth().currentUser;
      if (user) {
        // User is signed in.
        return true;
      } else {
        // No user is signed in.
        user.unauth();
        return false;
      }

      return Firebase.getAuth();
    }, // requreAuthentucation

    login: function(user){
      var email = user.email;
      var password = user.password;

      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (user){
        $state.go('app.newEntry');

        console.log("user logged in");
      }).catch(function(error){
          console.log(error);
        });
    }, // login

    logout: function(){
      firebase.auth().signOut().then(function() {
          // Sign-out successful.

          $state.go('app.login');
          console.log("signed out");
          console.log(firebase.auth().currentUser);
        }, function(error) {
          // An error happened.
          console.log(error);
      });
    }, // logout
    register: function(user){
        var email = user.email;
        var password = user.password;
        var firstname = user.firstname;
        var lastname = user.lastname;
      // create user wuth email and password then add data to database and catch errors
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(user){
              database.ref('user/' + user.uid).set({
                  userId: user.uid,
                  firstname: firstname,
                  lastname: lastname,
                  email: email
                }); // set
              console.log("data saved to database");
          }).catch(function(error) {
              // Handle Errors here.
              console.log(error);
          });// createUser
    } // register
  } //return
});
