
/*JS-функция определения поддержки WebP*/

// function testWebP(callback) {

// 	var webP = new Image();
// 	webP.onload = webP.onerror = function () {
// 		callback(webP.height == 2);
// 	};
// 	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
// }

// testWebP(function (support) {

// 	if (support == true) {
// 		document.querySelector('body').classList.add('webp');
// 	}
// 	else{
// 		document.querySelector('body').classList.add('no-webp');
// 	}
// });
@include('scrolling.js')
@include('dynamic_adapt.js')
@include('sliders.js')

let user_icon = document.querySelector('.user-header__icon'); //Присваиваю переменной объект с классом .user-header__icon
let user_menu = document.querySelector('.user-header__menu');
user_icon.addEventListener("click", function(e) {
	user_menu.classList.toggle('_active');
});

let burger_icon = document.querySelector('.icon-menu');
let menu_body = document.querySelector('.menu__body');
let body = document.querySelector('body');
burger_icon.addEventListener("click", function(e) {
	burger_icon.classList.toggle('_active');
	menu_body.classList.toggle('_active');
	body.classList.toggle('lock');
});

document.addEventListener("click", function (e) {//Слушаю клик на любую область всего документа
	if(!e.target.closest('.user-header')) {//Нету ли родителя с классом .user-header у кликнутого элемента 
		user_menu.classList.remove('_active');
	}
})