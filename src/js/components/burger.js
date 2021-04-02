const burger = $('.header__burger');
const menu = $('.header__menu');

burger.on('click', function (e) {

	// if($('body').hasClass('scroll-disabled')){
	// 	$('body').removeClass('scroll-disabled');
	// }

	e.preventDefault();
	burger.toggleClass('header__burger--close');
	menu.toggleClass('header__menu--open');
	// $('body').toggleClass('scroll-disabled');

	$(document).keyup(function(e) {
		if (e.key === "Escape" || e.keyCode === 27) {
			$('.header__menu').removeClass('header__menu--open');
			burger.removeClass('header__burger--close');
			// $('body').removeClass('scroll-disabled');
		}
	});
});