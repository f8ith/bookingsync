import jayson from 'jayson';

let token = ''

const authClient = jayson.Client.https({
  host: 'user-api.simplybook.me',
  path: '/login',
});

authClient.request('getToken', { 'companyLogin': 'dbsdev', 'apiKey': '03c448a1ecb1650736b057b6b0c76be50fe64783ecd6955bc3bf490210f0590d' }, (err, response) => {
  if (err) throw err;
  token = response.result
  console.log(token)
}
)

const client = jayson.Client.https({
  host: 'user-api.simplybook.me',
  path: '/admin',
  headers: {
    'X-Company-Login': 'dbsdev',
    'X-Token': token
  }
});

client.request('getClassesList', {}, (err, response) => {
  if (err) throw err;
  console.log(response.result);
});
