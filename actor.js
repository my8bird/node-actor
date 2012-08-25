var last_actor_id = 0,
    process_id    = Math.floor(Math.random() * 10000000);

/* 
Entry point for sending an arbitrary message out to the world.

Example:
    // Send message actor(1) on the local machine
    // - all are equal
    actor.send(1, 'message', 'some more data');
    actor.send([actor.getProcessId(), 1], 'message', 'some more data');
    actor1.send('message', 'some more data'); // actor1 is the Actor

@param {Array} to The actors address to send the message to.  If `to` is not an
                  Array then it is assumed the message is to be routed in the
                  locale process.
*/
exports.send = function(to, message) {
  var proc_id = process_id, actor_id = to;

  if (type(to) === Array) {
    proc_id  = to[0];
    actor_id = to[1];
  }

  if (proc_id === process_id) {
    // somethign
  }
};



// Whenever this process is asked for it id send it out.
process.on('message', function(m) {
  if (m === '_actor_getProcessId') {
    process.send({key: '_actor_processId', actorId: process_id});
  }
});

exports.registerActorProcess = function(childProc) {
  // Listen for the other processes response
  function handleProcessResponse(message) {
    if (message.key === '_actor_processId') {
       // XXX Store the id and process information

       // Clean up the event listener
       // @note: `once` is not used because we can not be certain our 
       //         message will be the first one.
       process.removeListener('message', handleProcessResponse);
    }
  }
  childProc.on('message', handleProcessResponse);

  // Ask the sub process for the data
  childProc.send('_actor_getProcessId');
}

   
var Actor = exports.Actor = function(options) {
  options = options || {};

  this.recievers = options.recievers || {};
  this.name      = options.name || "<no name>";
  this.address   = options.address || ++last_actor_id;

  // Configuration option which will cause expections to be thrown 
  // for various error states
  this._throw = false;
}

/*
 * Method used by others to send messages to this actor
 *
 * @param message: The name of a reciever.
 * @param data:    All other arguments are passed to the reciever as is.
 *                 These *must* be owned excusivly by the actor
 */
Actor.prototype.send = function(reciever) {
  var reciever = this.recievers[reciever];
  if (! reciever === undefined ) {
    if (this._throw) {
      throw new Error(reciever + ' receiver unknown on actor: ' + this.name);
    }
    return;
  }

  reciever.apply(this, Array.prototype.slice.call(arguments, 1));
};


