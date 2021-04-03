var cards = $('.cost__item');
var total = $('#cost_total');

var quant = $('#cost_quant');
// var amount = quant.val();
var hidden = $('input[type=hidden]');

//обработчик билета в форме
$('.cost__form-sum').on('change', 'input[type=radio]', function() {
	let price = '';
  $('.cost__form-btn input[type=radio]').each(function() { price = $('input[type=radio]:checked').val(); });
	$('.cost__item').each( function() {
		let cardPrice = $(this).find('.cost__price span').text();
		cardPrice = +cardPrice.replace(/\s/g, '');
		if (cardPrice == price) {
			$('.cost__item').removeClass('cost__item--active');
			$(this).addClass('cost__item--active');

		}
	});
	let amount = $('#cost_quant').val();
	total.text(+price * +amount);
	hidden.val(+price * +amount);
});

//обработчик количества билетов
$('#cost_quant').on('input', function(){
	let amount = $(this).val();
	let price = '';
  $('.cost__form-btn input[type=radio]').each(function() { price = $('input[type=radio]:checked').val(); });
	let total = $('#cost_total');
	total.text(+price * +amount);
	hidden.val(+price * +amount);
});

//обработчик клика по карточке
cards.on('click', function(){
	let price = $(this).find('.cost__price span').text();
	let amount = $('#cost_quant').val();
	price = +price.replace(/\s/g, '');
	if (price != '') {
		cards.removeClass('cost__item--active');
		$(this).addClass('cost__item--active');
		$('input[name="cost_sum"]').each( function() {
			if($(this).val() == price){
				$(this).prop('checked', true);
			}
		});
		total.text(+price * +amount);
		hidden.val(+price * +amount);
	}
});

