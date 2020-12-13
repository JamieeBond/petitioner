$(function() {
    const socket = io();
    const button = $("#signature");
    const progressBar = $(".progress-bar");
    const petition = progressBar.attr('petition');
    const user = button.attr('user');

    button.click(function () {
        socket.emit("signature", {
            'petition' : petition,
            'user' : user
        });
    });

    socket.on("signature-refresh"+petition, function(data) {
        let signatures = data['signatures'];
        updateProgressBar(signatures, data['signaturesNeeded']);
        updateSignaturesObtained(signatures);
        toggleButton(user, data['signedUser']);
    });

    function updateProgressBar(signatures, signaturesNeeded) {
        let percentage = ((signatures/signaturesNeeded)*100).toFixed(2);
        progressBar.find('.progress-bar-text').html(percentage+'%');
        progressBar.css("width", percentage+'%');
        progressBar.attr('aria-valuenow', percentage+'%');
    }

    function updateSignaturesObtained(signatures) {
        $("#signature-obtained").html(signatures == 1 ? signatures+' Signature Obtained' : signatures+' Signatures Obtained');
    }

    function toggleButton(user, signedUser) {
        let addTxt = 'Add Signature';
        let removeTxt = 'Remove Signature';
        if(user == signedUser) {
            if(button.html() == addTxt) {
                button.html(removeTxt);
                button.removeClass( "btn-success" );
                button.addClass( "btn-danger" );
            } else {
                button.html(addTxt);
                button.removeClass( "btn-danger" );
                button.addClass( "btn-success" );
            }
        }
    }
});
