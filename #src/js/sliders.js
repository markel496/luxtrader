//BildSlider from Andrikanich:)
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
	for (let index = 0; index < sliders.length; index++) {
		let slider = sliders[index];
		if (!slider.classList.contains('swiper-container')) {
			let slider_items = slider.children;
			if (slider_items) {
				for (let index = 0; index < slider_items.length; index++) {
					let el = slider_items[index];
					el.classList.add('swiper-slide');
				}
			}
			let slider_content = slider.innerHTML;
			let slider_wrapper = document.createElement('div');
			slider_wrapper.classList.add('swiper-wrapper');
			slider_wrapper.innerHTML = slider_content;
			slider.innerHTML = '';
			slider.appendChild(slider_wrapper);
			slider.classList.add('swiper-container');
		}
		if (slider.classList.contains('_gallery')) {
			//slider.data('LightGallery').destroy(true);
		}
	}
	sliders_bild_callback();
}

function sliders_bild_callback(params) { }

let main_slider = new Swiper('.main-slider__body', {
	navigation: {
	prevEl: '.control-main-slider__arrow_prev',
   nextEl: '.control-main-slider__arrow_next',
  },
  speed: 700,
  loop: true,
  breakpoints: {
   	// when window width is >= 320px
   	320: {
   	  autoHeight: true
   	},
   	// when window width is >= 768px
   	768: {
   	  autoHeight: false
   	},
   }
})

let slider_lots = new Swiper('.slider-lots__body', {
	navigation: {
	prevEl: '.control-slider-lots__arrow_prev',
   nextEl: '.control-slider-lots__arrow_next',
  },
  speed: 700,
  loop: true,
  slidesPerView: 3,
  breakpoints: {
   	// when window width is >= 320px
   	320: {
   		slidesPerView: 1
   	},
   	550: {
   		slidesPerView: 2
   	},
   	// when window width is >= 768px
   	768: {
   	 	slidesPerView: 3
   	},
   }
})

let slider_quotes = new Swiper('.slider-quotes__body', {
	slidesPerView: 1,
	speed: 1000,
	loop: true,
	effect: 'fade',
	navigation: {
   	nextEl: '.control-slider-quotes__circle'
   },
   breakpoints: {
   	// when window width is >= 320px
   	320: {
   	  autoHeight: true
   	},
   	// when window width is >= 670px
   	670: {
   	  autoHeight: false
   	}
   }
})