const axios = require("axios");

function reset() {
  let password = document.getElementById("password").value;
  let email = document.getElementById("email").value;

  axios
    .post("http://localhost:8000/auth/reset/", {
      email: email,
      password: password,
    })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });
}
