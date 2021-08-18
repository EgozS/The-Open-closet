const db = require('quick.db') 

db.set('logins', {'username': ["skep", "neon", "lina"], "password": ["q[5>bCIg8UfA", "4{^m1nP$*(Yt", "2`G<^Jk}BpP-"]})
console.log(db.get('logins'))