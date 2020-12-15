function isLoggedIn() {
    let userNav = $("#user-nav");
    if(userNav.prop("tagName") !== undefined) {
        return true;
    }
    return false;
}

suite("HTML tests", function() {
    test("Testing page title: ", function(){
        chai.assert.ok($(document).attr('title').indexOf("Petitioner")!=-1,"Title not Petitioner");
    });
    test("Checking that social media buttons are presence: ", function() {
        chai.assert.equal($("#social-media-group").prop("tagName"), "DIV", "Social media buttons are not presence");
    });
    test("Checking that progress bar is presence: ", function() {
        chai.assert.equal($(".progress-bar").prop("tagName"), "DIV", "Progress bar not presence");
    });
    test("Checking that Add/remove signature button does not appear for non-logged in users: ", function() {
        if(!isLoggedIn()) {
            chai.assert.notEqual($("#signature").prop("tagName"), "BUTTON", "Button appearing");
        }
    });
    test("Checking that Add/remove signature button appears for logged in users: ", function() {
        if(isLoggedIn()) {
            chai.assert.equal($("#signature").prop("tagName"), "BUTTON", "Button appearing");
        }
    });
});

suite("CSS tests", function() {
    test("Checking progress bar text is absolute: ", function(){
        chai.assert.isTrue(($('.progress-bar-text').css('position') == 'absolute'), "Progress bar text is not absolute");
    });
});

if(isLoggedIn()) {
    suite("JavaScript tests", function () {
        test("Testing that the progress bar updates once signature button is clicked: ", function () {
            let progressBar = $(".progress-bar");
            let button = $("#signature");
            let classes = button.attr('class').split(/\s+/);
            let originalWidth = progressBar.css("width");
            if(classes.includes("btn-success")) {
                button.click();
                setTimeout(function() {
                    chai.assert.notEqual(progressBar.css("width"), originalWidth, "Progress bar did not change");
                    button.click();
                }, 1000);
            }
        });
        test("Testing that the button signature changes once clicked: ", function () {
            let button = $("#signature");
            let classes = button.attr('class').split(/\s+/);
            if(classes.includes("btn-success")) {
                button.click();
                setTimeout(function() {
                    chai.assert.include(button.attr('class').split(/\s+/), 'btn-danger', "Button should of changed to red");
                    button.click();
                }, 1000);
            }
            if(classes.includes("btn-danger")) {
                button.click();
                setTimeout(function() {
                    chai.assert.include(button.attr('class').split(/\s+/), 'btn-success', "Button should of changed to green");
                    button.click();
                }, 1000);
            }
        });
    });
}
