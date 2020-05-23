var positive = 0;
var recovered = 0;
var death = 0;
var initial = true;
var country = 'ID';

$(document).ready(function(){
	$("body").css('display', 'block');
	consumeApi();

	$(".list-group-item").on("click", function(){
		$(".list-group-item.active").removeClass("active");
		$(this).addClass('active');
		country = $(this).data('code');
		consumeApi();
	});
});

$(window).scroll(function() {
	var height = $(window).scrollTop();
	if(height > 80) {
		$('.navbar').addClass('custom-sticky');
	} else {
		$('.navbar').removeClass('custom-sticky');
	}
});

$('a[href*="#"]').on('click', function(e) {
	e.preventDefault()

	$('html, body').animate(
	{
		scrollTop: $($(this).attr('href')).offset().top,
	},
	500
	)
})

function loadSlider(){
	$('#slider').slick({
		dots: true,
		infinite: false,
		speed: 300,
		slidesToShow: 3.5,
		slidesToScroll: 1,
		responsive: [
		{
			breakpoint: 1024,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
				dots: true
			}
		},
		{
			breakpoint: 600,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}
		]
	});
}

function consumeApi(){
	asyncLoad();
	var timer = setTimeout(function(){
		$.get("https://covid19.mathdro.id/api/countries/"+country, function(data, status){
			if(status == 'success'){
				positive = data.confirmed.value;
				recovered = data.recovered.value;
				death = data.deaths.value;

				moment.locale('en');
				$("#update").text(moment(data.lastUpdate).format('dddd, DD MMMM YYYY HH:mm'));
				showPage();
				printCount();
			}else{
				showError();
			}
			clearTimeout();
		}).catch(function(error){
			showError();
			clearTimeout();
		});
	},1500);
}

function printCount(){
	$("#confirmed").text(numeral(positive).format('0.0a'));
	$("#recovered").text(numeral(recovered).format('0.0a'));
	$("#death").text(numeral(death).format('0.0a'));
}

function asyncLoad(){
	$("#confirmed").html('<i class="fas fa-spinner fa-spin"></i>');
	$("#recovered").html('<i class="fas fa-spinner fa-spin"></i>');
	$("#death").html('<i class="fas fa-spinner fa-spin"></i>');
	$("#update").html('<i class="fas fa-spinner fa-spin"></i>');
}

function showPage(){
	$(".loading").slideUp(2000);
	$("#main").show();
	$("#main").slideDown(3000);
	if(initial){
		loadSlider();
		initial = false;
	}
}