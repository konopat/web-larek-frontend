import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { APIPresenter } from './components/presenter/APIPresenter';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductModel } from './components/model/ProductModel';
import { PageView } from './components/view/PageView';
import { CardView } from './components/view/CardView';
import { IProductEntity } from './types';

const events = new EventEmitter();
const api = new APIPresenter(CDN_URL, API_URL);

// Все шаблоны
const galleryTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модели данных
const productModel = new ProductModel({}, events);

// Глобальные контейнеры
const page = new PageView(document.body, events);

// Переиспользуемые части интерфейса

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on('items:changed', () => {
	page.gallery = productModel.list.items.map((item) => {
		const card = new CardView(cloneTemplate(galleryTemplate));
		card.title = item.title;
		card.price = item.price;
		card.description = item.description;
		card.image = item.image;
		card.category = item.category;
		card.id = item.id; // Будем использовать для всплывающих событий
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
		// После сохранения, модель доложит о событии 'selectedItem:changed'
		productModel.selectedItem = selectedProduct;
	} else {
		console.error(
			`Продукт с id: ${cardID} не найден в списке доступных к выбору продуктов`
		);
	}
});

// Если изменились данные выбранной карточки
events.on('selectedItem:changed', (item) => {
	console.log(item);
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
