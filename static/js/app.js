
$(document).ready(function() {
    var z = 0;
    var progress = 0;
    var id = Math.round($.now()*Math.random());
    var clients = {};

    var progressbar = '<div class="progress progress-striped active" id="' + id;
        progressbar += '"><div class="progress-bar" role="progressbar" aria-valuenow="' + progress;
        progressbar += '" aria-valuemin="0" aria-valuemax="100" style="width: ' + progress + '%"></div></div>';

    $('.container').append(progressbar);

    updater.start();
    window.ondevicemotion = function(event) {
        if (event.accelerationIncludingGravity.z !== z) {
            if (z - event.accelerationIncludingGravity.z > 2) {
                newMessage(
                    event.accelerationIncludingGravity.z,
                    id,
                    $('#' + id).children('div').attr('aria-valuenow')
                );
            }
            z = event.accelerationIncludingGravity.z;
        }
    };

});

function newMessage(z, id, progress) {
    updater.socket.send(
        JSON.stringify(
            {
                'z': z,
                'id': id,
                'progress': progress
            }
        )
    );
}

var updater = {
    socket: null,

    start: function() {
        var url = "ws://" + location.host + "/socket";
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = function(msg) {
            var data = JSON.parse(msg.data);
            var bar = $('#' + data.id);
            if (bar.length === 0) {
                    var pb = '<div class="progress progress-striped active" id="' + data.id;
                    pb += '"><div class="progress-bar" role="progressbar" aria-valuenow="' + data.progress;
                    pb += '" aria-valuemin="0" aria-valuemax="100" style="width: ' + data.progress + '%"></div></div>';
                    $('.container').append(pb);
            } else {
                bar.children('div').attr('aria-valuenow', data.progress);
                bar.children('div').css('width', data.progress + '%');
            }
        };
    },

};