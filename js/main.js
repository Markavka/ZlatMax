//<_ibg>======================================================================================

function _ibg() {

	let ibg = document.querySelectorAll("._ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img')) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}

_ibg();

//</_ibg>=====================================================================================

//<Спойлеры>===========================================================================

/* Использование Спойлеров:
Родителю спойлера(ов) добавляем атрибут "data-spollers" (S на конце)
Заголовку спойлера добавляем атрибут "data-spoller"

Включить режим Аккордиона можно добавив раодителю спойлера атрибут
"data-one-spoller"

Если необходимы включить/выключить работу спойлеров на разных
экранах, указываем параметры (размер, тип) в "data-spollers"
Например:
data-spollers="991.98,max" - спойлер будет работать только на экранах
									  меньше 991.98px
data-spollers="767.98,max" - спойлер будет работать толькр на экранах
									  больше 767.98px
*/

const spollersArray = document.querySelectorAll('[data-spollers]'); // Получаем коллекцию всех элементов, которые содержат атрибут "data-spollers"
if (spollersArray.length > 0) { // Проверяем, есть ли такие элементы в принципе
	//--- Получение ОБЫЧНЫХ (Regular) спойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) { // Переводим коллекцию в массив, дублируем массив в константу "spollersRegular" и возвращаем туда все элементы массива, соответствующие условию:
		return !item.dataset.spollers.split(",")[0]; // Получаем все элементы, в первом параметре атрибута "data-spollers" которых пусто
	});
	// Инициализация ОБЫЧНЫХ (Regular) спойлеров
	if (spollersRegular.length > 0) { // Проверяем, есть ли такие элементы в принципе
		initSpollers(spollersRegular) // Передаём в функцию "initSpollers" полученный массив "spollersRegular"
	}

	//--- Получение спойлеров с МЕДИА ЗАПРОСАМИ (Media)
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) { // Переводим коллекцию в массив, дублируем массив в константу "spollersRegular" и возвращаем туда все элементы массива, соответствующие условию:
		return item.dataset.spollers.split(",")[0]; // Получаем все элементы с указанным первым параметром в атрибуте "data-spollers"
	});
	// Инициализация спойлеров с МЕДИА ЗАПРОСАМИ (Media)
	if (spollersMedia.length > 0) { // Проверяем, есть ли такие элементы в принципе
		const breakpointsArray = []; // Пустой массив, в дальнейшем наполнится параметрами (число брейкпоинта, тип, сам объект)
		spollersMedia.forEach(item => { // Перебор массива "spollersMedia"
			const params = item.dataset.spollers; // Получаем строку с параметрами
			const breakpoint = {}; // Пустой объект, в дальнейшем наполнится пара метрами
			const paramsArray = params.split(","); // Преобразуем строку "params" в массив с параметрами
			breakpoint.value = paramsArray[0]; // Присваиваем нулевую ячейку массива "paramsArray" (размер экрана, например 991.98)
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max"; // Присваиваем первую ячейку массива "paramsArray" (тип, например min (min-width)), если параметр не указан, по умолчанию присвоится тип "max"
			breakpoint.item = item; // Присваиваем сам этот объект
			breakpointsArray.push(breakpoint); // Всё это добавляется к массиву "breakpointsArray"
		});

		// Получаем уникальные брейкпоинты
		let mediaQueries = breakpointsArray.map(function (item) { // Переделываем массив при помощи метода "map":
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type; // Получаем Например (min-width: 991.98px), 991.98,min
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) { // Фильтруем массив "mediaQueries"
			return self.indexOf(item) === index; // Получаем массив "mediaQueries", содержащий только уникальные значения без повторов
		});

		// Работаем с каждым брейкпоинтом
		mediaQueries.forEach(breakpoint => { // Перебор массива "mediaQueries"
			const paramsArray = breakpoint.split(","); // Получаем строку и преобразуем её в массив
			const mediaBreakpoint = paramsArray[1]; // Получаем первый параметр массива "paramsArray". Например 991.98
			const mediaType = paramsArray[2]; // Получаем второй параметр массива "paramsArray". Например "min"
			const matchMedia = window.matchMedia(paramsArray[0]); // Слушает ширину экрана и отрабатывает в случае, если отработал нулевой параметр массива "paramsArray"

			// Объекты с нужными условиями
			const spollersArray = breakpointsArray.filter(function (item) { // Получаем в константу "spollersArray" объекты, соответствующие условию:
				if (item.value === mediaBreakpoint && item.type === mediaType) { // Если совпадает брейкпоинт и тип
					return true;
				}
			});
			// Событие
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia); // в функцию "initSpollers" передаём собранный массив объектов "spollersArray" и константу "matchMedia"
			});
			initSpollers(spollersArray, matchMedia); // Запускаeм функцию, чтобы она отработала сразу при загрузке страницы
		});
	}
	// Инициализация
	function initSpollers(spollersArray, matchMedia = false) { // Передаём в функцию параметрами массив "spollersArray" и константу "matchMedia", но если matchMedia не передаём, её значение будет "false"
		spollersArray.forEach(spollersBlock => { // Перебираем каждый элемент "spollersBlock" массива "spollersArray"
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock; // Проверяем, если "matchMedia" не равна "false" (То есть чему-то равно), тогда присваиваем имя объекта (spollersBlock.item), иначе присвваиваем "spollersBlock"
			if (matchMedia.matches || !matchMedia) { // Если брейкпоинт сработал || если передали ОБЫЧНЫЕ спойлеры (Regular)
				spollersBlock.classList.add('_init'); // Родителю спойлера (оболочке спойлера) добавляем класс "_init"
				initSpollerBody(spollersBlock); // Отправляем объект в функцию "initSpollerBody"
				spollersBlock.addEventListener("click", setSpollerAction); // Вешаем событие клик на блок спойлера и вызываем функцию "setSpollerAction"
			} else { // Иначе
				spollersBlock.classList.remove('_init'); // Родителю спойлера (оболочке спойлера) удаляем класс "_init"
				initSpollerBody(spollersBlock, false); // Отправляем объект в функцию "initSpollerBody", с параметром "false"
				spollersBlock.removeEventListener("click", setSpollerAction); // Снимаем событие клик на блок спойлера и вызываем функцию "setSpollerAction"
			}
		});
	}
	// Работа с контентом
	function initSpollerBody(spollersBlock, hideSpollerBody = true) { // Передаём в функцию параметрами массив "spollersBlock" (Каждый отдельный блок со спойлерами) и "hideSpollerBody"
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]'); // Получаем коллекцию заголовков спойлеров
		if (spollerTitles.length > 0) { // Проверяем, есть ли такие элементы в принципе
			spollerTitles.forEach(spollerTitle => { // Перебираем каждый элемент "spollerTitle" массива "spollerTitles"
				if (hideSpollerBody) { // Если "hideSpollerBody" равен "true":
					spollerTitle.removeAttribute('tabindex'); // Удаляем атрибут "tabindex" (отключаем возможность перехода между заголовками нажатием на "Tab")
					if (!spollerTitle.classList.contains('_active')) { // Если у заголовка остутствует класс "_active":
						spollerTitle.nextElementSibling.hidden = true; // Скрываем контентную часть (Следующий элемент после заголовка)
					}
				} else { // Иначе (Если "hideSpollerBody" равен "false")
					spollerTitle.setAttribute('tabindex', '-1'); // Добавляем атрибут "tabindex" со значением "-1" (включаем возможность перехода между заголовками нажатием на "Tab")
					spollerTitle.nextElementSibling.hidden = false; // Показываем контентную часть (Следующий элемент после заголовка)
				}
			});
		}
	}
	function setSpollerAction(e) { // Выполняется при клике на заголовок спойлера
		const el = e.target; // Получаем нажатый объект
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) { // Если у объекта есть атрибут "data-spoller" || Если у ближайшего родителя есть атрибут "data-spoller"
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]'); // Получаем кнопку (сам элемент) либо его ближайший родитель с атрибутом "data-spoller"
			const spollersBlock = spollerTitle.closest('[data-spollers]'); // Получаем родительский блок спойлера, обращаемся к заголовку и ищем ближайшего родителся с атрибутом "data-spollers"
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false; // Если у оболочки спойлеров (у родителя) есть атрибут "data-one-spoller", присваиваем константе "true", если такого атрибут нет, присваиваем "false"
			if (!spollersBlock.querySelectorAll('._slide').length) { // Проверяем, НЕТ ли у оболочки спойлеров (родителя) есть внутри объекты с классом "_slide", если НЕТ:
				if (oneSpoller && !spollerTitle.classList.contains('_active')) { // Если оболочка спойлеров имеет атрибут "data-one-spoller" && У нажатой кнопки нет класса "_active":
					hideSpollersBody(spollersBlock); // Скрываем все остальные спойлеры
				}
				spollerTitle.classList.toggle('_active'); // Добавляем/удаляем класс "_active"
				_slideToggle(spollerTitle.nextElementSibling, 500); // Выполняем функцию "_slideToggle"
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active'); // Получаем активный спойлер (Имющий атрибут "[data-spoller]" и класс "_active")
		if (spollerActiveTitle) { // Если такой есть:
			spollerActiveTitle.classList.remove('_active'); // Удаляем класс "_active" 
			_slideUp(spollerActiveTitle.nextElementSibling, 500); // Выполняем функцию "_slideUp"
		}
	}
}

//<SlideToggle>========================================================================
// Анимированно скрывает объект
let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
// Анимированно показывает объект
let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
// Анимированно показывает/скрывает объект
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}
//</SlideToggle>=======================================================================

//</Спойлеры>==========================================================================


//<popup>===========================================================================

/* Использование:

timeout - Значение этой константы должно совпадать со значением
			 скорости анимации свойства "transition", например:
			 transition: all 0.8s ease 0s;
			 timeout = 800

data-popup="name" - Добавляем данный дата-атрибут popup'у
						  с указанием имени

data-popup-link="name" - Добавляем элементу, при нажатии на который
								 будет открываться popup, с указанием имени
								 самого popup'a (data-popup - name)

data-popup-close - Добавляем элементу, при нажатии на который
						 будет закрываться popup
						 (Крестик, кнопка "Закрыть" и т.п.)

data-lock-padding - Можно указать для фиксированных объектов
						  (position: fixed;), чтобы они не смещались
						  при удалении скролла, во время открытия popup'а
*/

const popupLinks = document.querySelectorAll('[data-popup-link]');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('[data-lock-padding]');

let unlock = true;

const timeuot = 800;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener('click', function (e) {
			const popupName = popupLink.dataset.popupLink;
			const currentPopup = document.querySelectorAll('[data-popup]');
			for (let index = 0; index < currentPopup.length; index++) {
				const el = currentPopup[index];
				const elDataValue = el.dataset.popup;
				if (elDataValue === popupName) {
					popupOpen(el);
				}
			}
			e.preventDefault();
		});
	}
}

const popupCloseIcon = document.querySelectorAll('[data-popup-close]');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('[data-popup]'));
			e.preventDefault();
		});
	}
}

// Открытие popup'a
function popupOpen(currentPopup) {
	if (currentPopup && unlock) {
		const popupActive = document.querySelector('[data-popup]._open');
		if (popupActive) {
			popupClose(popupActive, false)
		} else {
			bodyLock();
		}
		currentPopup.classList.add('_open');
		currentPopup.addEventListener('click', function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('[data-popup]'));
			}
		});
	}
}

// Закрытие popup'a
function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('_open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('_lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeuot);
}

function bodyUnLock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('_lock');
	}, timeuot);
}

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		const popupActive = document.querySelector('[data-popup]._open');
		if (popupActive) {
			popupClose(popupActive);
		}

	}
});

(function () {
	if (!Element.prototype.closest) {
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		}
	}
})();
(function () {
	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();
//<//popup>=========================================================================

//<Табы header>=====================================================================

// Автоматическое добавление модификатора по количеству столбцов
const menuBlocks = document.querySelectorAll('.sub-list-catalog__block');
if (menuBlocks.length) {
	menuBlocks.forEach(menuBlock => {
		const menuBlocksItems = menuBlock.querySelectorAll('.sub-list-catalog__title-wrap').length;
		menuBlock.classList.add(`sub-list-catalog__block_${menuBlocksItems}`);
	});
}

const catalogHeader = document.querySelector('.catalog-header');
// Открытие/закрытие таба
document.addEventListener("click", documentActions);

function documentActions(e) {
	const targetElement = e.target;
	if (targetElement.closest('[data-parent]')) {
		const subMenuId = targetElement.dataset.parent ? targetElement.dataset.parent : null;
		const subMenu = document.querySelector(`[data-submenu="${subMenuId}"]`);

		if (subMenu) {
			const activeLink = document.querySelector('._sub-menu-active');
			const activeBlock = document.querySelector('._sub-menu-open');
			if (activeLink && activeLink !== targetElement) {
				activeLink.classList.remove('_sub-menu-active');
				activeBlock.classList.remove('_sub-menu-open');
				document.documentElement.classList.remove('sub-menu-open');
			}
			document.documentElement.classList.toggle('sub-menu-open');
			targetElement.classList.toggle('_sub-menu-active');
			subMenu.classList.toggle('_sub-menu-open');
		}

		e.preventDefault();
	}
	if (!targetElement.closest(".catalog-header") && document.querySelector('.sub-menu-open')) {
		document.querySelector('.sub-menu-open').classList.remove('sub-menu-open');
		document.querySelector('._sub-menu-active').classList.remove('_sub-menu-active');
		document.querySelector('._sub-menu-open').classList.remove('_sub-menu-open');
	}


	if (targetElement.closest('.menu-top-header__link_catalog')) {
		document.documentElement.classList.add('catalog-open');
		e.preventDefault();
	}
	if (targetElement.classList.contains('menu-catalog__back')) {
		document.documentElement.classList.remove('catalog-open');

		document.querySelector('._sub-menu-active') ? document.querySelector('._sub-menu-active').classList.remove('_sub-menu-active') : null;
		document.querySelector('._sub-menu-open') ? document.querySelector('._sub-menu-open').classList.remove('_sub-menu-open') : null;
		e.preventDefault();
	}
	if (targetElement.classList.contains('sub-list-catalog__back')) {
		document.documentElement.classList.remove('sub-menu-open');
		document.querySelector('._sub-menu-active') ? document.querySelector('._sub-menu-active').classList.remove('_sub-menu-active') : null;
		document.querySelector('._sub-menu-open') ? document.querySelector('._sub-menu-open').classList.remove('_sub-menu-open') : null;
		e.preventDefault();
	}

}

//</Табы header>====================================================================

// <Бурегр Меню>==============================================================================

// Бургер
const iconMenu = document.querySelector('.icon-menu'); // Получаем в константу класс кнопки "Бургер"
const menuBody = document.querySelector('.menu__body'); // Получаем в константу класс всего Меню
if (iconMenu) { // Если таковая имеется:
	iconMenu.addEventListener("click", function (e) { // По клику на "Бургер"
		document.body.classList.toggle('_lock'); // Добавляем для body класс "lock"
		iconMenu.classList.toggle('_active'); // Добавляем для Бургера класс "active"
		menuBody.classList.toggle('_active'); // Добавляем для Меню класс "avtive"
		if (document.documentElement.classList.contains('catalog-open')) {
			document.documentElement.classList.remove('catalog-open');
		}
		if (document.documentElement.classList.contains('sub-menu-open')) {
			document.documentElement.classList.remove('sub-menu-open');
			document.querySelector('._sub-menu-active') ? document.querySelector('._sub-menu-active').classList.remove('_sub-menu-active') : null;
			document.querySelector('._sub-menu-open') ? document.querySelector('._sub-menu-open').classList.remove('_sub-menu-open') : null;
		}
	});
}

// // Прокрутка по клику
// const menuLinks = document.querySelectorAll('.menu-footer__link[data-goto], .button[data-goto], .menu-header__link[data-goto]'); // Получаем все объекты с классом "menu-header__link", имеющие атрибут "data-goto"
// if (menuLinks.length > 0) { // Если таковые имеются:
// 	menuLinks.forEach(menuLink => {
// 		menuLink.addEventListener('click', onMenuLinkClick); // При клике на любой из этих объектов выполнить функцию "onMenuLinkClick"
// 	});

// 	function onMenuLinkClick(e) {
// 		const menuLink = e.target; // Получаем объект на который был совершен клик
// 		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) { // Проверяем заполнен ли дата атрибут "data-goto" && Проверяем, существует ли объект, на который ссылается этот артибут
// 			const gotoBlock = document.querySelector(menuLink.dataset.goto); // Получаем объект, на который ссылается атрибут "data-goto"
// 			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset; // Высчитываем положение этого объекта

// 			if (iconMenu.classList.contains('_active')) { // Если Бургер содержит класс "active"
// 				document.body.classList.remove('_lock'); // Удаляем класс "active"
// 				iconMenu.classList.remove('_active'); // Удаляем класс "active"
// 				menuBody.classList.remove('_active'); // Удаляем класс "active"
// 			}

// 			window.scrollTo({ // Скролл к - "top", как? - "smooth (плавно)"
// 				top: gotoBlockValue,
// 				behavior: "smooth"
// 			});
// 			e.preventDefault(); // Выключает перезагрузки странцы при клике на ссылку
// 		}
// 	}
// }

// </Бурегр Меню>=============================================================================

//<swiper-слайдер>=================================================================

// Главный слайдер
if (document.querySelector('.main-block__slider')) {
	new Swiper('.main-block__slider', {
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},
		autoHeight: true,
		observer: true,
		observerParenst: true,
		slidesPerView: 1,
		spaceBetween: 50,
		speed: 800,
		loop: true,
		parallax: true,

		// Dots
		pagination: {
			el: '.main-block .control-main-block__dots',
			clickable: true,
			bulletClass: "slider__bullet",
			bulletActiveClass: "slider__bullet-active",
		},
		// Адаптив Breakpoints ---------------------------
		// Ширина экрана
		// !!! По принципе MOBILE FIRST !!!
		// breakpoints: {
		// 	320: {
		// 		slidesPerView: 1,
		// 	},
		// 	480: {
		// 		slidesPerView: 2,
		// 	},
		// 	992: {
		// 		slidesPerView: 3,
		// 	},
		// },

		on: {
			init: function (swiper) {
				const allSlides = document.querySelector('.fraction-control__all');
				const allSlidesItem = document.querySelectorAll('.main-block__slide:not(.swiper-slide-duplicate)');
				allSlides.innerHTML = allSlidesItem.length;
			},
			slideChange: function (swiper) {
				const currentSlides = document.querySelector('.fraction-control__current');
				currentSlides.innerHTML = swiper.realIndex + 1 < 10 ? `0${swiper.realIndex + 1}` : swiper.realIndex;
			},
		},
	});
}
// Слайдер продуктов
if (document.querySelector('.slider-products__body')) {
	new Swiper('.slider-products__body', {
		wrapperClass: "slider-wrapper",
		slideClass: "slider-slide",

		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},
		observer: true,
		observerParenst: true,
		spaceBetween: 30,
		slidesPerView: 4,
		speed: 800,
		loop: true,
		// parallax: true,

		// Dots
		pagination: {
			el: '.slider-products__dots',
			clickable: true,
			dynamicBullets: true,
			dynamicMainBullets: 3,
			bulletClass: "slider__bullet",
			bulletActiveClass: "slider__bullet-active",
		},

		// Адаптив Breakpoints ---------------------------
		// Ширина экрана
		// !!! По принципе MOBILE FIRST !!!
		breakpoints: {
			0: {
				slidesPerView: 1,
				spaceBetween: 20,
			},
			767.98: {
				slidesPerView: 2,
			},
			991.98: {
				slidesPerView: 3,
				spaceBetween: 30,
			},
			1400: {
				slidesPerView: 4,
			},
		},
	});
}
// Слайдер новых продуктов
if (document.querySelector('.slider-new-products__body')) {
	new Swiper('.slider-new-products__body', {
		wrapperClass: "slider-wrapper",
		slideClass: "slider-slide",

		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},
		observer: true,
		observerParenst: true,
		spaceBetween: 30,
		slidesPerView: 3,
		speed: 800,
		loop: true,
		// parallax: true,

		// Dots
		pagination: {
			el: '.slider-new-products__dots',
			clickable: true,
			dynamicBullets: true,
			dynamicMainBullets: 3,
			bulletClass: "slider__bullet",
			bulletActiveClass: "slider__bullet-active",
		},

		// Адаптив Breakpoints ---------------------------
		// Ширина экрана
		// !!! По принципе MOBILE FIRST !!!
		breakpoints: {
			0: {
				slidesPerView: 1,
				spaceBetween: 15,
			},
			767.98: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1401: {
				slidesPerView: 3,
				spaceBetween: 30,

			},
		},
	});
}

// Слайдер картинок продукта
if (document.querySelector('.product')) {
	// Слайдер тамбнейлов
	let sliderProductThumb = new Swiper('.thumb-slider', {
		observer: true,
		observerParenst: true,
		slidesPerView: 4,
		spaceBetween: 15,
		resistanceRatio: 0,

		on: {
			init: function () {
				if (this.slides.length > 4 && window.innerWidth > 575.98) {
					this.params.slidesPerView = 4.2;
				}
			},
		},


		// Адаптив Breakpoints ---------------------------
		// Ширина экрана
		// !!! По принципе MOBILE FIRST !!!
		breakpoints: {
			0: {
				slidesPerView: 2.2,
			},
			379.98: {
				slidesPerView: 3.2,
			},
			575.98: {
				slidesPerView: 4,
			},
		},
	});
	let sliderProductMain = new Swiper('.main-slider', {
		observer: true,
		observerParenst: true,
		slidesPerView: 1,
		spaceBetween: 15,

		allowTouchMove: false, // Нельзя переключать слайды кликом/тыканьем

		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},

		thumbs: {
			swiper: sliderProductThumb
		},

		// watchOverflow: true, // Если слайдов меньше, чем slidesPerView, выключает функционал слайдера
	});


}

//</swiper-слайдер>================================================================

//<tippy>==========================================================================

/* Использование:
Файлы:
#source/js/tippy.js
#source/scss/_tippy.scss


data-tippy-content="" - Присваивается объектупри при наведении
								на который хотим показывать подсказку.
								Параметром указываем текст подсказки
								Например:
								data-tippy-content="Подсказка 1"


*/

if (document.querySelector('[data-tippy-content]')) {
	tippy('[data-tippy-content]', {
		placement: 'top-end', // Положение стрелки
		theme: 'zlatmax' // Тема (стили)
	});
}


//</tippy>=========================================================================

//<star-rating>=========================================================================
/* Использование:
Файлы:
#source/scss/_star-rating.scss
#source/html/star-rating.html
#source/js/star-rating.js

Включить возможность выставлять рейтинг:
объекту с классов star-rating добавить
класс-модификатор "star-rating_set"

*/
const ratings = document.querySelectorAll('.star-rating');
if (ratings.length > 0) {
	initRatings();
}

// Основная функция
function initRatings() {
	let ratingActive, ratingValue;
	for (let index = 0; index < ratings.length; index++) {
		const rating = ratings[index];
		initRating(rating);
	}

	// Инициализируе конкретный рейтинг
	function initRating(rating) {
		initRatingVars(rating);

		setRatingActiveWidth();

		if (rating.classList.contains('star-rating_set')) {
			setRating(rating);
		}
	}

	// Инициализация переменных
	function initRatingVars(rating) {
		ratingActive = rating.querySelector('.star-rating__active');
		ratingValue = rating.querySelector('.star-rating__value');
	}
	// Изменяем ширину активных звёзд
	function setRatingActiveWidth(index = ratingValue.innerHTML) {
		const ratingActiveWidth = index / 0.05; // Делим на 0.05, потому что в рейтиге 5 звёзд
		ratingActive.style.width = `${ratingActiveWidth}%`;
	}
	// Возможность указывать оценку
	function setRating(rating) {
		const ratingItems = rating.querySelectorAll('.star-rating__item');
		for (let index = 0; index < ratingItems.length; index++) {
			const ratingItem = ratingItems[index];
			ratingItem.addEventListener("mouseenter", function (e) {
				// Обновление переменных
				initRatingVars(rating);
				// Обновление активных звёзд
				setRatingActiveWidth(ratingItem.value);
			});
			ratingItem.addEventListener("mouseleave", function (e) {
				// Обновление активных звёзд
				setRatingActiveWidth();
			});
			ratingItem.addEventListener("click", function (e) {
				// Обновление переменных
				initRatingVars(rating);

				ratingValue.innerHTML = index + 1;
				setRatingActiveWidth();
			});
		}
	}
}
//</star-rating>========================================================================

//<form-valid>======================================================================

/* Использование:

Файлы:
#source/js/form/form-valid.js

data-form-valid - Присваивается форме (form), которую будем
						проверять на валидность

data-required - Присваивается объекту (input'у) формы, валидацию 
					 которого нужно совершить

					 data-required="email", если тип поля email

._error - Добавляется элементу формы и его родителю, если поле
			 не прошло валидацию. Используется для стилизации ошибки

*/

document.addEventListener('DOMContentLoaded', function () {
	const forms = document.querySelectorAll('[data-form-valid]');
	if (forms.length > 0) {
		forms.forEach(form => {
			form.addEventListener('submit', formSend);

			async function formSend(e) {
				e.preventDefault();

				let error = formValidate(form);

				if (error === 0) {
					form.reset();
					alert("Данные отправлены");
				} else {

				}
			}

			function formValidate(form) {
				let error = 0;
				console.log(form);
				let formReq = form.querySelectorAll('[data-required]');

				for (let index = 0; index < formReq.length; index++) {
					const input = formReq[index];
					formRemoveError(input);

					if (input.dataset.required === 'email') {
						if (emailTest(input)) {
							formAddError(input);
							error++;
						}
					} else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
						formAddError(input);
						error++;
					} else if (input.dataset.required === 'tel') {
						if (telTest(input)) {
							formAddError(input);
							error++;
						}
					} else {
						if (input.value === '' || input.value.trim() === '') {
							formAddError(input);
							error++;
						}
					}
				}
				return error;
			}

			function formAddError(input) {
				input.parentElement.classList.add('_error');
				input.classList.add('_error');
			}
			function formRemoveError(input) {
				input.parentElement.classList.remove('_error');
				input.classList.remove('_error');
			}
			function emailTest(input) {
				return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
			}
			function telTest(input) {
				return !/\+7\d{3}\d{3}\d{2}\d{2}/.test(input.value);
			}
		});
	}


});
//</form-valid>=====================================================================


//<select>=============================================================================
/* Использование:
Файлы:
#source/html/select.html
#source/scss/form/_select.scss
#source/js/form/select.js

data-value - Присваиваем значение, закрепленное за элементом списка
				 Например:
				 data-value="Пункт 3"

*/

document.querySelectorAll('.select').forEach(function (selectWrapper) {
	const selectButton = selectWrapper.querySelector('.select__button');
	const selectList = selectWrapper.querySelector('.select__list');
	const selectItems = selectList.querySelectorAll('.select__item');
	const selectInput = selectWrapper.querySelector('.select__input');

	// Показать/скрыть выпадающий список
	selectButton.addEventListener('click', function () {

		if (!selectList.classList.contains('_slide')) {
			selectButton.classList.toggle('_open');
		}
		_slideToggle(selectList, 300);
		selectButton.classList.add('_focus');
	});

	// Выбор элемента из списка
	selectItems.forEach(selectItem => {
		selectItem.addEventListener('click', function (e) {
			e.stopPropagation();

			if (!selectList.classList.contains('_not-selected')) {
				selectButton.classList.remove('_not-selected');
			}


			if (!selectList.classList.contains('_slide')) {
				selectButton.classList.remove('_open');
				selectButton.innerText = this.innerText;
				selectInput.value = this.dataset.value;

				selectItems.forEach(selectItem => {
					if (selectItem.classList.contains('_selected')) {
						selectItem.classList.remove('_selected');
					}
				});

				if (selectItem.innerText === selectButton.innerText) {
					selectItem.classList.add('_selected');
				}
			}


			_slideUp(selectList, 300);

		});
	});

	// Закрытие списка при клике вне него
	document.addEventListener('click', function (e) {
		if (e.target !== selectButton) {
			selectButton.classList.remove('_focus');
			if (!selectList.classList.contains('_slide')) {
				selectButton.classList.remove('_open');
			}
			if (selectList.hidden == false) {
				_slideUp(selectList, 300);
			}
		}
	});

	// Закрытие списка при нажатии на Tab или Escape
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Tab' || e.key === 'Escape') {
			if (!selectList.classList.contains('_slide')) {
				selectButton.classList.remove('_open');
			}
			selectButton.classList.remove('_focus');
			if (selectList.hidden == false) {
				_slideUp(selectList, 300);
			}
		}
	});

	// Помечает выбранный элемент
	selectItems.forEach(selectItem => {
		if (selectItem.innerText === selectButton.innerText) {
			selectItem.classList.add('_selected');
		}
	});
});
//</select>============================================================================

//<noUiSlider>=========================================================================

const sizeRanges = document.querySelectorAll('[data-range]');
if (sizeRanges.length) {
	sizeRanges.forEach(sizeRange => {
		const fromValue = sizeRange.querySelector('[data-range-from]');
		const toValue = sizeRange.querySelector('[data-range-to]');
		const itemRange = sizeRange.querySelector('[data-range-item]');
		const sizeInputs = [fromValue, toValue];

		noUiSlider.create(itemRange, {
			step: 1,
			start: [Number(fromValue.dataset.rangeFrom), Number(toValue.dataset.rangeTo)],
			connect: true,
			range: {
				'min': Number(fromValue.dataset.rangeFrom),
				'max': Number(toValue.dataset.rangeTo)
			},
			format: {
				to: function (value) {
					return parseInt(value);
				},
				from: function (value) {
					return parseInt(value);
				}
			},
			direction: "rtl"
		});

		//========================================================================

		// Range Цены
		if (itemRange.dataset.rangeTooltip == 1) {
			itemRange.noUiSlider.destroy();

			noUiSlider.create(itemRange, {
				start: [Number(fromValue.dataset.rangeFrom), Number(toValue.dataset.rangeTo)],
				tooltips: [true, false],
				connect: true,
				range: {
					'min': Number(fromValue.dataset.rangeFrom),
					'max': Number(toValue.dataset.rangeTo)
				},
				format: {
					to: function (value) {
						return parseInt(value);
					},
					from: function (value) {
						return parseInt(value);
					}
				},
			});

			// Показ максимальной цены Tooltip
			const priceTooltip = sizeRange.querySelector('.noUi-tooltip');
			itemRange.noUiSlider.on('update', function () {
				if (priceTooltip.innerText !== Number(toValue.dataset.rangeTo)) {
					priceTooltip.innerText = Number(toValue.dataset.rangeTo);
				}
			});
		}

		// Обновление значения в input при движении ручек
		itemRange.noUiSlider.on('update', function (values, handle) {
			sizeInputs[handle].value = Math.round(values[handle]);
		});
		// Обновление положения ручек, при изменении значения в input
		const setPriceRange = (i, value) => {
			let arr = [null, null];
			arr[i] = value;

			itemRange.noUiSlider.set(arr);
		}
		sizeInputs.forEach((sizeInput, index) => {
			sizeInput.addEventListener('change', (e) => {
				setPriceRange(index, e.currentTarget.value);
			});
		});
	});
}

//</noUiSlider>========================================================================

//========================================================================
// Спойлер фильтра товаров
const spollerCatalog = document.querySelector('.filter-catalog__title');
if (spollerCatalog) {
	window.addEventListener('resize', move);

	//Функция
	function move() {
		const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		if (viewport_width <= 992) {
			spollerCatalog.addEventListener('click', spollerHidden);

		} else {
			spollerCatalog.removeEventListener('click', spollerHidden)
			if (spollerCatalog.nextElementSibling.hasAttribute('hidden')) {
				(spollerCatalog.nextElementSibling.removeAttribute('hidden'))
			}
		}
	}

	//Вызываем функцию
	move();

	function spollerHidden() {
		if (!spollerCatalog.nextElementSibling.classList.contains('_slide')) {
			spollerCatalog.classList.toggle('_active');
			_slideToggle(spollerCatalog.nextElementSibling, 300);
		}
	}
}


//========================================================================

//========================================================================
// Автоматическое добавление модификатора по количеству столбцов для слайдеров
const productSliders = document.querySelectorAll('.products-slider');
if (productSliders.length) {
	for (let index = 0; index < productSliders.length; index++) {
		const productSlider = productSliders[index];
		productSlider.classList.add(`products-slider_${index}`);
	}
}
//========================================================================

//<quantity>==============================================================

/* Использование:

Файлы:
#source/scss/form/_quantity.scss
#source/js/form/quantity.js

Сниппет: quantity (HTML)

*/

if (document.querySelector('.quantity__input')) {
	const quantityPlus = document.querySelector('.quantity__button_plus');
	const quantityMinus = document.querySelector('.quantity__button_minus');
	const quantityInput = document.querySelector('.quantity__input');

	const priceValueBlock = document.querySelector('.line-actions__price');
	const priceValue = Number(priceValueBlock.innerText);


	// Если value меньше минимума
	if (Number(quantityInput.value) <= Number(quantityInput.min)) {
		quantityMinus.disabled = true;
		quantityInput.value = quantityInput.min;
	}
	// Если value больше максимума
	if (Number(quantityInput.value) >= Number(quantityInput.max)) {
		quantityPlus.disabled = true;
		quantityInput.value = quantityInput.max;
	}

	// Plus
	quantityPlus.addEventListener('click', function () {
		quantityInput.value++;
		if (Number(quantityInput.value) > Number(quantityInput.min)) {
			quantityMinus.disabled = false;
			priceValueBlock.innerText = quantityInput.value * priceValue;
		}

		if (Number(quantityInput.value) >= Number(quantityInput.max)) {
			quantityPlus.disabled = true;
		}
	});
	// Minus
	quantityMinus.addEventListener('click', function () {
		quantityInput.value--;
		if (Number(quantityInput.value) <= Number(quantityInput.min)) {
			quantityMinus.disabled = true;
		}

		if (Number(quantityInput.value) < Number(quantityInput.max)) {
			quantityPlus.disabled = false;
			priceValueBlock.innerText = priceValueBlock.innerText - priceValue;
		}
	});

	// Input
	quantityInput.addEventListener('change', function () {
		// Min
		if (Number(quantityInput.value) <= Number(quantityInput.min)) {
			quantityInput.value = quantityInput.min;
			quantityMinus.disabled = true;
			quantityPlus.disabled = false;
		}
		if (Number(quantityInput.value) > Number(quantityInput.min)) {
			quantityMinus.disabled = false;
		}
		// Max
		if (Number(quantityInput.value) >= Number(quantityInput.max)) {
			quantityInput.value = quantityInput.max;
			quantityPlus.disabled = true;
			quantityMinus.disabled = false;
		}
		if (Number(quantityInput.value) < Number(quantityInput.max)) {
			quantityPlus.disabled = false;
		}

		// input change
		priceValueBlock.innerText = priceValue * quantityInput.value;
	});
}
//</quantity>=============================================================

//<tabs>===============================================================================

/* Использование:
Файлы:
#source/html/tabs.html
#source/js/tabs.js

Сниппет: tabs (HTML)

data-tabs - Присваивается оболочке табов

data-tabs-titles - Присваивается оболочке с кнопками табов

data-tabs-content - Присваивается оболочке с блоками контента табов

._tab-active - Класс, присваивается кнопке, контент которой будет
					показываться по умолчанию. Класс для стилизации
					активного таба

*/

const tabsArray = document.querySelectorAll('[data-tabs]');

if (tabsArray.length > 0) {
	tabsArray.forEach(tabsBlock => {
		const tabsNav = tabsBlock.querySelector('[data-tabs-titles]');
		const tabsTitles = Array.from(tabsBlock.querySelector('[data-tabs-titles]').children);
		const tabsContents = Array.from(tabsBlock.querySelector('[data-tabs-content]').children);
		let summ = 0;

		tabsTitles.forEach((tabsTitle, index) => {

			if (tabsTitle.classList.contains('_tab-active')) {
				tabsContents.forEach(tabsContent => {
					tabsContent.hidden = true;
				});
				tabsContents[index].hidden = false;
			}

			tabsTitle.addEventListener('click', tabsTitleClick);

			function tabsTitleClick(e) {
				if (!tabsTitles[index].classList.contains('_tab-active')) {
					tabsContents.forEach(tabsContent => {
						tabsContent.hidden = true;
					});
					tabsTitles.forEach(tabsTitle => {
						tabsTitle.classList.remove('_tab-active');
					});

					tabsContents[index].hidden = false;
					tabsTitles[index].classList.add('_tab-active');
				}
			}
			//<>===================================================================================

			(function () {

				function scrollHorizontally(e) {
					e = window.event || e;
					var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
					document.getElementById('statistic-table').scrollLeft -= (delta * 4); // Multiplied by 10
					e.preventDefault();
				}
				if (document.getElementById('statistic-table').addEventListener) {
					// IE9, Chrome, Safari, Opera
					document.getElementById('statistic-table').addEventListener("mousewheel", scrollHorizontally, false);
					// Firefox
					document.getElementById('statistic-table').addEventListener("DOMMouseScroll", scrollHorizontally, false);
				} else {
					// IE 6/7/8
					document.getElementById('statistic-table').attachEvent("onmousewheel", scrollHorizontally);
				}

			})();

			// window.onload = move();
			// window.addEventListener('resize', move);

			// //Функция
			// function move() {
			// 	summ += tabsTitle.offsetWidth;
			// 	if (summ > tabsNav.offsetWidth) {
			// 		if (tabsNav) {
			// 			// При удержании кнопки мыши
			// 			// let mouseDown = false;
			// 			// let startX, scrollLeft;

			// 			// let startDragging = function (e) {
			// 			// 	mouseDown = true;
			// 			// 	startX = e.pageX - tabsNav.offsetLeft;
			// 			// 	scrollLeft = tabsNav.scrollLeft;

			// 			// };
			// 			// let stopDragging = function (event) {
			// 			// 	mouseDown = false;
			// 			// };

			// 			// document.addEventListener('mousemove', (e) => {
			// 			// 	e.preventDefault();
			// 			// 	if (!mouseDown) {
			// 			// 		return;
			// 			// 	}
			// 			// 	const x = e.pageX - tabsNav.offsetLeft;
			// 			// 	const scroll = x - startX;
			// 			// 	tabsNav.scrollLeft = scrollLeft - scroll;
			// 			// });

			// 			// // Add the event listeners
			// 			// tabsNav.addEventListener('mousedown', startDragging, false);
			// 			// document.addEventListener('mouseup', stopDragging, false);
			// 			// // tabsNav.addEventListener('mouseleave', stopDragging, false);


			// 			//========================================================================

			// 			// При прокрутке колеса мыши
			// 			// tabsNav.addEventListener('wheel', function (event) {
			// 			// 	if (event.deltaMode == event.DOM_DELTA_PIXEL) {
			// 			// 		var modifier = 1;
			// 			// 		// иные режимы возможны в Firefox
			// 			// 	} else if (event.deltaMode == event.DOM_DELTA_LINE) {
			// 			// 		var modifier = parseInt(getComputedStyle(this).lineHeight);
			// 			// 	} else if (event.deltaMode == event.DOM_DELTA_PAGE) {
			// 			// 		var modifier = this.clientHeight;
			// 			// 	}
			// 			// 	if (event.deltaY != 0) {
			// 			// 		// замена вертикальной прокрутки горизонтальной
			// 			// 		this.scrollLeft += modifier * event.deltaY;
			// 			// 		event.preventDefault();
			// 			// 	}
			// 			// });
			// 		}
			// 	}
			// }
			// //Вызываем функцию
			// move();

			//</>==================================================================================
		});
	});
}
//</tabs>==============================================================================








