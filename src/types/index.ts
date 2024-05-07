// ---
// ПСЕВДОНИМЫ И КАСТОМНЫЕ ТИПЫ
// ---

import { Form } from '../components/common/Form';

// Для работы EventEmitter
export type EventName = string | RegExp; // Для имен событий
// eslint-disable-next-line @typescript-eslint/ban-types
export type Subscriber = Function; // Для функции-подписчика
export type EmitterEvent = {
	eventName: string;
	data: unknown;
};

// Для ID продукта
export type ProductID = string;

// Для списка категорий продуктов
export interface ICategories {
	[category: string]: string;
}

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
	price: number | null;
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
	list: IProductList; // Доступно к покупке
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
// MODEL – Общее состояние приложения
// ---
export interface IAppState {
	order: IOrderModel;
	products: IProductModel;
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
export interface IModalData {
	content: HTMLElement;
}

// Модальное окно
// Принимает контент для отображения. Окно можно "Открыть" и "Закрыть"
export interface IModalView extends IComponent<IModalData> {
	open: () => void;
	close: () => void;
}

// Карточка
// Используется в различных списках и галереях
// Содержит обязательные и опциональные элементы в зависимости от контекста
export interface ICardView {
	title: HTMLHeadingElement;
	price: HTMLSpanElement;
	description?: HTMLParagraphElement;
	image?: HTMLImageElement;
	category?: HTMLSpanElement;
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

// Состояние формы
export interface IFormState {
	valid: boolean;
	errors: string;
}

// Ошибки формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Форма заказа
// Содержит обязательные поля для оформления заказа
// Предполагает отображение ошибок валидации
export interface IFormView extends Form<IFormState> {
	paymentMethodToggleButtonsElement: HTMLButtonElement[];
	addressElement: HTMLInputElement;
	emailElement: HTMLInputElement;
	phoneElement: HTMLInputElement;
	submitElement: HTMLButtonElement;
	errorsElement: HTMLSpanElement;
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
export interface IAPI {
	getProduct: (id: ProductID) => Promise<IProductEntity>;
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
	api: IAPI;
	eventEmitter: IEvents;
}
