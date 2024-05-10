import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { APIPresenter } from './components/presenter/APIPresenter';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductModel } from './components/model/ProductModel';
import { PageView } from './components/view/PageView';
import { CardView } from './components/view/CardView';
import { IProductEntity } from './types';
import { Modal } from './components/common/Modal';
import { CartView } from './components/view/CartView';

const events = new EventEmitter();
const api = new APIPresenter(CDN_URL, API_URL);

// Шаблоны
const galleryTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modalTemplate = ensureElement<HTMLElement>('#modal-container');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модели данных
const productModel = new ProductModel({}, events);

// Глобальные контейнеры
const pageWrapper: HTMLElement = document.querySelector('.page__wrapper');

// Переиспользуемые части интерфейса
const page = new PageView(document.body, events);
const modal = new Modal(modalTemplate, events);
const cart = new CartView(cloneTemplate(basketTemplate), events);

//----
// БИЗНЕС-ЛОГИКА
//----
// Поймали событие, сделали что нужно

// Если изменились элементы каталога
events.on('items:changed', () => {
	page.gallery = productModel.list.items.map((item) => {
		const card = createCardView(item, galleryTemplate);
		return card.render();
	});
});

// Если выбрана карточка
events.on('item:selected', (item: HTMLElement) => {
	// Вынимаем id
	const cardID = item.dataset['id'];
	// Ищем id в списке доступных продуктов
	const selectedProduct: IProductEntity = productModel.list.items.filter(
		(item) => item.id === cardID
	)[0];
	if (selectedProduct) {
		// Если нашли, сохраняем
		// После сохранения, модель доложит о событии 'selected-item:changed'
		productModel.selectedItem = selectedProduct;
	} else {
		console.error(
			`Продукт с id: ${cardID} не найден в списке доступных к выбору продуктов`
		);
	}
});

// Если изменились данные выбранной карточки
events.on('selected-item:changed', (item: IProductEntity) => {
	const card = createCardView(item, cardPreviewTemplate);
	modal.render({ content: card.render() });
});

// Если изменились данные в корзине
events.on('cart:changed', () => {
	// Создаем карточки продуктов, добавленных в корзину
	const products = productModel.cart.items.map((item, index) => {
		const card = createCardView(item, cardBasketTemplate);
		card.listingIndex = index + 1;
		return card.render();
	});
	// Создаем корзину
	cart.list = products;
	cart.totalPrice = productModel.cartAmount;
	// Обновляем счетчик товаров
	page.cartTotal = productModel.cart.total;
	// Перерисовываем корзину
	modal.render({ content: cart.render() });
});

// Если открыто модальное окно
events.on('modal:open', (content) => {
	// Блокируем прокрутку страницы
	page.toggleClass(pageWrapper, 'page__wrapper_locked', true);
	// Проверяем что у нас в содержимом
	if (content instanceof Element) {
		// Если открыта карточка
		const card = content.querySelector('.card_full');
		if (card) {
			openCard(card);
		}

		// Если открыта корзина
		const cart = content.querySelector('.basket__list');
		if (cart) {
			openCart(cart, content);
		}
	}
});

// Если модальное окно закрыто
events.on('modal:close', () => {
	page.toggleClass(pageWrapper, 'page__wrapper_locked', false);
});

//----
// ВЫНЕСЕННАЯ ЛОГИКА
//----

// Открыть карточку
const openCard = (card: Element) => {
	const cardButtonElement: HTMLButtonElement =
		card.querySelector('.card__button');
	// Проверяем выбранную карточку
	const selectedItem: IProductEntity = productModel.selectedItem;
	const isInCart: boolean = productModel.isInCart(selectedItem);
	// Если выбранный продукт уже в корзине
	if (isInCart) {
		// Деактивируем кнопку
		modal.setDisabled(cardButtonElement, true);
	} else {
		// Если продукт доступен к покупке, вешаем слушатель на кнопку "В корзину"
		// Можно было вешать его сразу в CardView, но так больше контроля,
		// ведь слушатель нужен только пока открыто модальное окно
		cardButtonElement.addEventListener(
			'click',
			() => {
				// Добавляем выбранный продукт в корзину
				productModel.addSelectedItemToCart();
				modal.close();
			},
			{ once: true } // Удаляем слушатель после первого же использования
		);
	}
};

// Открыть корзину
const openCart = (cart: Element, context: Element) => {
	// Если в корзине должны быть товары
	if (productModel.cart.items.length) {
		const cards = cart.querySelectorAll('.card');
		// Отрисовываем список товаров
		cards.forEach((card: HTMLElement) => {
			const product = productModel.findById(card.dataset['id']);
			const deleteButton = card.querySelector('.basket__item-delete');
			if (deleteButton) {
				// Вешаем слушатели на кнопки удаления товара
				deleteButton.addEventListener(
					'click',
					() => {
						productModel.removeFromCart(product); // Удаляем из модели
					},
					{ once: true } // Удаляем слушатель сразу после использования
				);
			}
		});
		// Вешаем слушатель на кнопку оформления заказа только если в корзине есть товары
		const orderButton: HTMLButtonElement =
			context.querySelector('.basket__button');
		orderButton.addEventListener('click', () => {
			console.log(orderButton);
			////////////////////////
			/// НАДО РЕАЛИЗОВАТЬ ОФОРМЛЕНИЕ ЗАКАЗА
			////////////////////////
		});
	}
};

//----
// VIEW-ГЕНЕРАТОРЫ
//----

const createCardView = (
	item: IProductEntity,
	template: HTMLTemplateElement
) => {
	const card = new CardView(cloneTemplate(template));
	card.id = item.id;
	card.title = item.title;
	card.price = item.price;
	if (item.description) {
		card.description = item.description;
	}
	if (item.image) {
		card.image = item.image;
	}
	if (item.category) {
		card.category = item.category;
	}
	return card;
};

api
	.getProducts()
	.then((result) => {
		productModel.list = result;
	})
	.catch((err) => {
		console.error(err);
	});
