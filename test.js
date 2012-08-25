var actor = require('./actor');

/*

var a = new Actor({
  name: 'nates',
  recievers: {
    shit: function(b) {console.log('i pooped', b);}
  }
});


a.send('shit', 1);
*/


if (! process.send) {
   var cp = require('child_process');
   var c1 = cp.fork('test.js'),
       c2 = cp.fork('test.js');

   actor.registerActorProcess(c1);
   actor.registerActorProcess(c2);
}

