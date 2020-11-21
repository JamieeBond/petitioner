window.onload = function() {
    let prePetitions = [];
    $("#search").on("input", function() {
        // input value
        let string = this.value;
        // reset if search is empty
        if(string == "") {
            resetSearchItems();
            prePetitions = [];
        } else {
            // else search for items
            $.get("/petition/search?string=" + string).then(function (petitions) {
                // only change if search results have changed
                if (petitions.length != prePetitions.length) {
                    prePetitions = petitions;
                    resetSearchItems();
                    petitions.forEach(function (petition) {
                        let newItem = $("#searchResults").append("<a id=\"" + petition._id + "\" href=\"#\" class=\"list-group-item list-group-item-action searchItem\">" + petition.title + "</a>").hide();
                        newItem.slideDown("normal");
                    });
                }
            });
        }
    });

    function resetSearchItems() {
        $(".searchItem").slideUp("normal", function () {
            $(this).remove();
        });
    }
};

