// ---
// ПСЕВДОНИМЫ И КАСТОМНЫЕ ТИПЫ
// ---

// Для работы EventEmitter
export type EventName = string | RegExp; // Для имен событий
// eslint-disable-next-line @typescript-eslint/ban-types
export type Subscriber = Function; // Для функции-подписчика
export type EmitterEvent = {
	eventName: string;
	data: unknown;
};

// Для ID продукта
type ProductID = string;

// ---
// MODEL
// ---
// Слой для работы с данными
// Содержит две сущности: Продукт и Заказ

// Описание базовой модели
export interface IModel {
	emitChanges: (event: string, payload?: object) => void;
}

// Сущность – Продукт
export interface IProductEntity {
	id: ProductID;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number;
}

// Список продуктов
export interface IProductList {
	items: IProductEntity[]; // Продукты
	total: number; // Количество продуктов
}

// ---
// MODEL – PRODUCT
// ---
export interface IProductModel {
	items: IProductList; // Доступно к покупке
	cart: IProductList; // Продукты в корзине
	cartAmount: number; // Сумма продуктов в корзине
	selectedItem: IProductEntity; // Выбранный продукт в данный момент

	isInCart: (item: IProductEntity) => boolean; // Проверить продукт в корзине
	removeFromCart: (item: IProductEntity) => IProductList; // Удалить продукт из корзины
	clearCart: () => void; // Очистить корзину
}

// Сущность – Заказ
export interface IOrderEntity {
	id: string; // Выдается сервером
	total: number; // Сумма заказа
}

// Форма заказа
export interface IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
}

// Заказ
export interface IOrder extends IOrderForm {
	items: ProductID[]; // Список ID продуктов
}

// ---
// MODEL – ORDER
// ---
export interface IOrderModel {
	state: IOrder; // Текущий заказ
	completedOrders: IOrderEntity[]; // Оформленные заказы (возможно, в будущем понадобится хранить)
	resetState: () => IOrder; // Отчистить данные текущего заказа
}

// ---
// VIEW
// ---
// Слой для отображения данных и работы с пользовательским интерфейсом

// Описание класса для создания компонентов
export interface IComponent<T> {
	toggleClass: (
		element: HTMLElement,
		className: string,
		force?: boolean
	) => void;

	setDisabled: (element: HTMLElement, state: boolean) => void;
	render: (data?: Partial<T>) => HTMLElement;
}

// Базовый View
// Используется для компонентов с динамичным контентом
export interface IContentView {
	content: HTMLElement;
}

// Модальное окно
// Может отображать динамичный контент и обязательно содержит кнопку "Закрыть"
export interface IModalView extends IComponent<IContentView> {
	content: HTMLElement;
	closeButton: HTMLButtonElement;
}

// Карточка
// Используется в различных списках и галереях
// Содержит обязательные и опциональные элементы в зависимости от контекста
export interface ICardView extends IComponent<IProductEntity> {
	title: HTMLHeadingElement;
	description?: HTMLParagraphElement;
	image: HTMLImageElement;
	price: HTMLSpanElement;
	category: HTMLSpanElement;
	button?: HTMLButtonElement;
}

// Страница
// Отображает количество добавленных в корзину продуктов
// Отображает галерею доступных к продаже продуктов
export interface IPageView extends IComponent<IProductList> {
	cartTotal: HTMLSpanElement;
	gallery: HTMLElement;
}

// Корзина
// Отображает список добавленных в корзину продуктов
// Отображает стоимость добавленных в корзину продуктов
// Содержит кнопку оформления заказа
export interface ICartView extends IComponent<IProductList> {
	list: HTMLElement;
	price: HTMLSpanElement;
	button: HTMLButtonElement;
}

// Форма заказа
// Содержит обязательные поля для оформления заказа
// Предполагает отображение ошибок валидации
export interface IFormView extends IComponent<IOrderForm> {
	paymentMethodToggleButtons: HTMLButtonElement[];
	address: HTMLInputElement;
	email: HTMLInputElement;
	phone: HTMLInputElement;
	submit: HTMLButtonElement;
	errors: HTMLSpanElement;
}

// Заказ оформлен
// Отображает описание с финальной суммой заказа
// Содержит кнопку, которая закроет модальное окно и обнулит текущий заказ с корзиной
export interface ISuccessView extends IComponent<IOrderEntity> {
	description: HTMLParagraphElement;
	closeButton: HTMLButtonElement;
}

// ---
// PRESENTER
// ---
// Промежуточный слой между View и Model
// Запрашивает данные, их редактирование, реагирует на изменения
// Отправляет View актуальные инструкции для отображения

// API
// Для работы с сервером
export interface IApi {
	getProducts: () => Promise<IProductList>;
	postOrder: (order: IOrder) => Promise<IOrderEntity>;
}

// EventEmitter
// Для работы с событиями
export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

// Реализует единую точку входя для работы со слоем Presenter
export interface IPresenter {
	api: IApi;
	eventEmitter: IEvents;
}
