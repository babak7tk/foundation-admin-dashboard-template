//foundation main jquery
$(document).foundation();

//for sidebar
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#page-content-wrapper").toggleClass("toggled");
    $("#sidebar-wrapper").toggleClass("toggled");
    $(".sidebar-nav").toggleClass("toggled");
    $("#wrapper").toggleClass("toggled");
});
