window.onload = function() {
    const socket = io();
    let button = $("#signature");
    let petition = button.attr('petition');
    button.click(function () {
        socket.emit("signature", petition);
    });
};
