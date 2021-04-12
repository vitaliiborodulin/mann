var cards = $('.cost__item');
var total = $('#cost_total');

var quant = $('#cost_quant');
// var amount = quant.val();
var hidden = $('#priceHidden');
var promocode = false;

function addSpaces(nStr) {
	nStr = nStr.toFixed(2);
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ' ' + '$2');
	}
	return x1 + x2;
}

function calcPrice(){
	var price = '';
	$('.cost__form-btn input[type=radio]').each(function() { 
		price = $('input[type=radio]:checked').val(); 
	});
	if(typeof price=='undefined') return;

	var amount = $('#cost_quant').val(); //кол-во билетов
	var sum = +price * +amount;
	if(price>15000 && amount>2){
		var skidkaValue = sum * 0.1;
		sum = sum * 0.9;
		$('.skidka').html('Ваша скидка: <span>' + addSpaces(skidkaValue) + '</span> ₽'); 
		$('.skidka').show();	
	}else if(promocode=='first'){
		var skidkaValue = sum * 0.07;
		sum = sum * 0.93;
		$('.skidka').html('Ваша скидка: <span>' + addSpaces(skidkaValue) + '</span> ₽'); 
		$('.skidka').show();			
	}else{
		$('.skidka').hide();
	}
			
	total.text(sum); // The + operator returns the numeric representation of the object
	hidden.val(sum);	
}

	//обработчик билета в форме
	$('.cost__form-sum').on('change', 'input[type=radio]', function() {

		var price = '';
		$('.cost__form-btn input[type=radio]').each(function() { 
			price = $('input[type=radio]:checked').val(); 
		});		
		$('.cost__item').each( function() {
			var cardPrice = $(this).find('.cost__price span').text();
			cardPrice = +cardPrice.replace(/\s/g, '');
			if (cardPrice == price) {
				$('.cost__item').removeClass('cost__item--active');
				$(this).addClass('cost__item--active');

			}
		});
		calcPrice();
	});

	//обработчик количества билетов
	$('#cost_quant').on('input', function(){
		calcPrice();
	});

	//обработчик клика по карточке
	cards.on('click', function(){
		var price = $(this).find('.cost__price span').text();
		var amount = $('#cost_quant').val();
		price = +price.replace(/\s/g, '');
		if (price != '') {
			cards.removeClass('cost__item--active');
			$(this).addClass('cost__item--active');
			$('input[name="info[package]"]').each( function() {
				if($(this).val() == price){
					$(this).prop('checked', true);
				}
			});
			calcPrice();
		}
	});

	$("#cost_promo").on("change paste keyup", function() {
		if($("#cost_promo").val().toLowerCase()=='first'){
			promocode = 'first';
			$("#cost_promo").addClass('valid');
		}else{
			promocode = false;
			$("#cost_promo").removeClass('valid');
		}
		calcPrice();
 });

 $('.cost__item').eq(0).click();

