/* global document, window, metamask */

async function loginwithtoken(token,account,next,process){
    try {
      const from = account;
      let message = token;
      const sign = await ethereum.request({
        method: 'personal_sign',
        params: [message, from,''],
      });
      var res = sign
    } catch (err) {
      console.error(err);
    }

    fetch('/accounts/metamask/login/', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    "X-CSRFToken": '{{ csrf_token }}',
  },
  body: JSON.stringify({
            account: account,
            login_token: res,
            next : next,
            process: 'verify',
        })
})
  .then(function (response) {
	// The API call was successful!
	return response.text();
}).then(function (html) {

	// Convert the HTML string into a document object
	var parser = new DOMParser();
	var doc = parser.parseFromString(html, 'text/html');
	document.querySelector('html').innerHTML = doc

}).catch(function (err) {
	// There was an error
	console.warn('Something went wrong.', err);
});
  // window.location.href = next;
}

async function getAccount(next, process="login") {
  const accounts = await ethereum.request({method: 'eth_requestAccounts'});
  const account = accounts[0];
  fetch('/accounts/metamask/login/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "X-CSRFToken": '{{ csrf_token }}',
    },
    body: JSON.stringify({
      account: account,
      next: next,
      process: 'token',
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    loginwithtoken(responseJson.data, account, next, process)
  })
}

