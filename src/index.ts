import './scss/styles.scss';

import { API_URL, CDN_URL, settings } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { APIProducts } from './components/APIProducts';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductModel } from './components/model/ProductModel';
import { PageView } from './components/view/PageView';
import { CardView } from './components/view/CardView';
import { IOrderEntity, IOrderForm, IProductEntity } from './types';
import { Modal } from './components/common/Modal';
import { CartView } from './components/view/CartView';
import { OrderModel } from './components/model/OrderModel';
import { FormAddressView } from './components/view/FormAddressView';
import { FormContactsView } from './components/view/FormContactsView';
import { SuccessView } from './components/view/SuccessView';

const events = new EventEmitter();
const api = new APIProducts(CDN_URL, API_URL);

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
const productModel = new ProductModel(events);
const orderModel = new OrderModel(events);

// Глобальные контейнеры
const pageWrapper: HTMLElement = document.querySelector('.page__wrapper');

// Переиспользуемые части интерфейса
const page = new PageView(document.body, events);
const modal = new Modal(modalTemplate, events);
const cart = new CartView(cloneTemplate(basketTemplate), events);
const formAddress = new FormAddressView(
	cloneTemplate(orderFormTemplate),
	events
);
const formContacts = new FormContactsView(
	cloneTemplate(contactsFormTemplate),
	events
);
const successView = new SuccessView(cloneTemplate(successTemplate), events);

// Бизнес-логика
// Поймали событие, сделали что нужно

// Если изменились элементы каталога
events.on(settings.event.itemsChanged, () => {
	page.gallery = productModel.list.items.map((item) => {
		const card = new CardView(cloneTemplate(galleryTemplate), item);
		return card.render();
	});
});

// Если выбрана карточка
events.on(settings.event.itemSelected, (item: HTMLElement) => {
	// Ищем id в списке доступных продуктов
	const cardID = item.dataset['id'];
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
events.on(settings.event.selectedItemChanged, (item: IProductEntity) => {
	const card = new CardView(cloneTemplate(cardPreviewTemplate), item);
	modal.render({ content: card.render() });
});

// Если изменились данные в корзине
events.on(settings.event.cartChanged, () => {
	// Создаем карточки продуктов, добавленных в корзину
	const products = productModel.cart.items.map((item, index) => {
		const card = new CardView(cloneTemplate(cardBasketTemplate), item);
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
events.on(settings.event.modalOpen, (content) => {
	// Блокируем прокрутку страницы
	page.toggleClass(pageWrapper, 'page__wrapper_locked', true);
	// Проверяем что у нас в содержимом
	if (content instanceof Element) {
		// Если открыта карточка
		const card = content.querySelector('.card_full');
		if (card) {
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
		}

		// Если открыта корзина
		const cart = content.querySelector('.basket__list');
		if (cart) {
			// Если в корзине должны быть товары
			if (productModel.cart.items.length) {
				const cards = cart.querySelectorAll('.card');
				// Отрисовываем список товаров
				cards.forEach((card: HTMLElement) => {
					const product = productModel.findById(card.dataset['id']);
					// Вешаем слушатели на кнопки удаления товара
					card.querySelector('.basket__item-delete').addEventListener(
						'click',
						() => {
							productModel.removeFromCart(product); // Удаляем из модели
						},
						{ once: true } // Удаляем слушатель сразу после использования
					);
				});
				// Вешаем слушатель на кнопку оформления заказа только если в корзине есть товары
				content
					.querySelector('.basket__button')
					.addEventListener('click', () => {
						events.emit('order:start');
					});
			}
		}
	}
});

// Если модальное окно закрыто
events.on(settings.event.modalClose, () => {
	page.toggleClass(pageWrapper, 'page__wrapper_locked', false);
});

// Если пользователь начал оформлять заказ
events.on(settings.event.orderStart, () => {
	modal.render({
		content: formAddress.render({
			valid: false,
			errors: [],
		}),
	});
	// Сразу валидируем форму на случай, если пользователь закроет ее и вернется позже
	formAddress.validate();
});

// Если пользователь успешно отправил форму адреса
events.on(settings.event.orderSubmit, () => {
	modal.render({
		content: formContacts.render({
			valid: false,
			errors: [],
		}),
	});
	// Сразу валидируем форму на случай, если пользователь закроет ее и вернется позже
	formContacts.validate();
});

// Если пользователь успешно отправил форму контактов
events.on(settings.event.contactsSubmit, () => {
	// Приравниваем сумму корзины к сумме заказа
	orderModel.state.total = productModel.cartAmount;
	productModel.cart.items.forEach((item) => {
		// Добавляем в заказ продукты из корзины
		orderModel.state.items.push(item.id);
	});
	// Отправляем заказ на сервер
	api
		.postOrder(orderModel.state)
		.then((result: IOrderEntity) => {
			// Получаем принятный заказ
			orderModel.completedOrder = result;
		})
		.catch((err) => {
			console.error(err);
		});
});

// Если заказ был успешно опубликован
events.on(settings.event.successfully, (completedOrder: IOrderEntity) => {
	// Рендерим уведомление об успешном заказе
	modal.render({
		content: successView.render({
			description: completedOrder.total, // Публикуем сумму принятого заказа
		}),
	});
	productModel.clearCart();
	orderModel.resetState();
	formAddress.reset();
	formContacts.reset();
	page.cartTotal = 0;
});

// Если пользователь подтвердил успешность заказа (нажал на "За новыми покупками!")
events.on(settings.event.userConfirmedOrder, () => {
	modal.close();
});

// Если изменилось одно из полей формы адреса
events.on(
	/^(order\..*):change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		switch (data.field) {
			case 'payment':
				formAddress.payment = data.value;
				orderModel.payment = data.value;

				break;
			case 'address':
				formAddress.address = data.value;
				orderModel.address = data.value;
				break;
		}
	}
);

// Если изменилось одно из полей формы контактов
events.on(
	/^(contacts\..*):change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		switch (data.field) {
			case 'email':
				formContacts.email = data.value;
				orderModel.email = data.value;
				break;

			case 'phone':
				formContacts.phone = data.value;
				orderModel.phone = data.value;
				break;
		}
	}
);

// Если изменилось состояние валидации форм
events.on(settings.event.formErrorsChange, (errors: Partial<IOrderForm>) => {
	// Все проверяемые поля
	const { payment, address, email, phone } = errors;
	// Форма адреса
	formAddress.valid = !payment && !address;
	formAddress.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	// Форма контактов
	formContacts.valid = !email && !phone;
	formContacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Получаем продукты с сервера
api
	.getProducts()
	.then((result) => {
		productModel.list = result;
	})
	.catch((err) => {
		console.error(err);
	});
