$('body').on('click', '[href*="#"]', function(e){
	var fixed_offset = 0;

	$('html,body').stop().animate({ 
		scrollTop: $(this.hash).offset().top - fixed_offset 
	}, 700);
	e.preventDefault();
	burger.toggleClass('header__burger--close');
	menu.toggleClass('header__menu--open');
});