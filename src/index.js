const http = require('http');
const url = require('url');
const admin = require('firebase-admin');
const serviceAccount = require('./smart-airconditioner-firebase-adminsdk-sfniy-9b695f818d.json');
const db = admin.firestore();
const docRef = db.collection('data').doc('sensor');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

http.createServer(function(req, res) {
  let uri = req.url;
  let query = url.parse(uri, true).query;  
  if(req.method == 'GET') {
    res.writeHead(200, {"Content-type" : "text/html"});
    try {
      let setAda = docRef.set({
        'dust': query.dust,
        'humi': query.humi,

        'temp': query.temp
      });
    } catch (e) {
      db.collection('data').get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
          });
        })
        .catch((err) => {
          console.log('Error getting documents', err);
        });
    }
    res.end("dust : " + query.dust + " humi : " + query.humi + " temp : " + query.temp);
  }
}).listen(8888, function() {
  console.log('server running on 8888');
});