let redirectTimer;
var re = new RegExp(/^.*\//);
const baseURL = re.exec(window.location.href);

function startReturn() {
  redirectTimer = setTimeout('redirect()', 5000);
}

function redirect() {
  window.location = baseURL;
}

$(document).ready(function () {
  startReturn();
});
