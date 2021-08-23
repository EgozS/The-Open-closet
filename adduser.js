const db = require('quick.db');

db.delete('logins');

db.set('logins', {'username': ["skep", "neon", "lina"], "password": ["265782982672", "801497428462", "113120573772"]});

console.log(db.get('logins'));