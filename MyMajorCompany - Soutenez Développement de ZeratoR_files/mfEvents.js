window.mfEvents = {
    addEventListener:function(event_name, callback)
    {
        if(!this.eventsListeners) this.eventsListeners = {};
        if(!this.eventsListeners[event_name]) this.eventsListeners[event_name] = [];
        this.eventsListeners[event_name].push(callback);
    },
    dispatchEvent: function(event_name, object)
    {
        if(this.eventsListeners && this.eventsListeners[event_name])
        {
            for(o in this.eventsListeners[event_name])
            {
                var listener = this.eventsListeners[event_name][o];
                listener.call(this, object);
            }
        }
    }
};