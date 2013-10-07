$(document).ready(function() {
    updater.start();
    window.ondevicemotion = function(event) {
        // event.accelerationIncludingGravity.x
        // event.accelerationIncludingGravity.y
        // event.accelerationIncludingGravity.z
        var x = event.accelerationIncludingGravity.x;
        newMessage(x);
    };

});

function newMessage(e) {
    updater.socket.send(e.accelerationIncludingGravity.x);
}

var updater = {
    socket: null,

    start: function() {
        var url = "ws://" + location.host + "/socket";
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = function(event) {
            console.log(event);
        };
    },

};