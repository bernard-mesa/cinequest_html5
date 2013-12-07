/**
 * author: Snigdha Mokkapati
 */

var str="<h1>Cinequest</h1>"+
    "<div data-role='controlgroup' data-type='horizontal' id='btn_group'>"+
//    "<a href='index.html' data-role='button' data-inline='true' data-icon='home'>Home</a>"+
//    "<a href='swipe_page.html' data-role='button' rel='external'"+
//    "data-inline='true' data-transition='flip'>Swipe Mode</a>"+
    "</div>"+
    "<a href='info.html' data-rel='dialog' class='ui-btn-right' data-icon='info' data-transition='pop'>Info</a>"+
    "<div data-role='navbar'>"+
    "<ul><li><a href='index.html' rel='external'>NEWS</a></li>"+
    "<li><a href='films.html' id='filmstag' rel='external'>FILMS</a></li>"+
	"<li><a href='events.html' rel='external'>EVENTS</a></li>"+
    "<li><a href='forum.html' rel='external'>FORUMS</a></li>"+
    "<li><a href='schedule.html'>MY SCHEDULE</a></li></ul></div></ul></div>";

$("header").html(str);