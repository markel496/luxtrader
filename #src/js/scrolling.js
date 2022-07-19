jQuery(document).ready(function($) {
    $('.menu__list a').click(function() { // отслеживаем клик по ссылке, которая нах-ся внутри класса menu__list
      var scroll_el = $(this).attr('href'); // берем у него содержимое атрибута href
      if ($(scroll_el).length != 0) { // чтобы избежать ошибки проверяем на существование этого элемента 
        $('html, body').animate({
          scrollTop: $(scroll_el).offset().top - 75 // отступ (пиксели)
        }, 800); // скорость (миллисекунды)
      }
      return false; // отключаем действие по умолчанию
    });
  });