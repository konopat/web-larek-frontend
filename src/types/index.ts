// Псевдоним для ID продукта для наглядности в интерфейсах
type ProductID = string;

// Продукт
export interface IProductItem {
	id: ProductID;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;
}

// Список продуктов
export interface IProductList {
	total: number;
	items: IProductItem[];
}

// Описание модели для управления продуктами
// Модель используется для
export interface IProductModel {
	catalog: IProductList; // Доступные продукты (подгружаются с сервера)
	cart: IProductList | null; // Продукты, добавленные пользователем в корзину
	selected: IProductItem | null; // Продукт, выделенный пользователем. Например, для превью.
	setCatalog(items: IProductList): void; // Добавить продукты в каталог.
	addToCart(item: IProductItem): void; // Добавить продукт в корзину.
	deleteFromCart(item: IProductItem): void; // Удалить продукт из корзины.
	emptyCart(): void; // Отчистить корзину.
	getTotal(): number; // Получить итоговую сумму продуктов в корзине.
	getList(): ProductID[]; // Получить список ID продуктов в корзине.
	isInCart(item: IProductItem): boolean; // Проверить находится ли продукт в корзине, чтобы заменить кнопку с "добавить" на "удалить" например.
}

// Форма заказа
export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

// Модель для управления заказом
// Заказ создается на основе заполненной формы и корзины
export interface IOrder extends IOrderForm {
	items: ProductID[]; // Содержит только список ID продуктов
	total: number; // Итоговая сумма заказа
	submit(): void; // Отправить заказ
}

// Результат заказа
export interface IOrderResult {
	id: string;
	total: number;
}

// API для запроса списка доступных продуктов и оформления заказа
export interface IProductAPI {
	getProducts: () => Promise<IProductList>;
	order: (order: IOrder) => Promise<IOrderResult>;
}
