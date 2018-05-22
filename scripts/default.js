hljs.initHighlightingOnLoad();
hljs.initLineNumbersOnLoad();

function toggleMenu() {
	$("nav").toggle(300);
}

function gotoFold(el, event) {
	var fold = el.href.slice(el.href.lastIndexOf("#"));

	$("html, body").animate({
		scrollTop: $(fold).offset().top - 80
	});

	// Override URL
	window.location.hash = fold;

	return false;
}

function closeMenuOnMobile() {
	if ($(".mobile-menu-button").is(":visible")) toggleMenu();
}

var headlines = null;
var menuItems = null;

$(function () {
	$("a", $("#doc-nav")).each(function (i, el) {
		if (el.href.indexOf("#") === -1) return;
		$(el).on("click", function(e) {
			e.preventDefault();
			gotoFold(this, e);
			closeMenuOnMobile();
		});
	});

	headlines = $("main").find("h1, h2");
	menuItems = $("nav > ul li");
});

var curentSectionId = null;
var $curentSection = null;

$(document).on("scroll", function () {
	if (!headlines) return;

	var bodyScroll = $("html, body").scrollTop();
	var $curSection;
	var curSectionOffset = 0;

	headlines.each(function (i, el) {
		var $el = $(el);
		var offset = $el.offset().top;
		var headlineId = $el.attr("id");

		if (headlineId && offset - bodyScroll - 100 < 0) {
			if (offset > curSectionOffset) {
				$curSection = $el;
				curSectionOffset = offset;
			}
		}
	});

	if (!curentSectionId || ($curSection && $curSection.attr("id") !== curentSectionId)) {
		if ($curentSection) $curentSection.removeClass("cur-section");

		curentSectionId = $curSection.attr("id");
		$curentSection = menuItems.find("a[href$='" + curentSectionId + "']");

		$curentSection.addClass("cur-section");
	}
});