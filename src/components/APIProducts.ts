import {
	IAPI,
	IOrder,
	IOrderEntity,
	IProductEntity,
	IProductList,
	ProductID,
} from '../types';
import { API } from './base/api';

// Класс, который отвечает за работу с API в слое Presenter
export class APIProducts extends API implements IAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// Получить продукт
	getProduct(id: ProductID): Promise<IProductEntity> {
		return this.get(`/product/${id}`).then((item: IProductEntity) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	// Получить список продуктов
	getProducts(): Promise<IProductList> {
		return this.get('/product').then((data: IProductList) => {
			data.items.forEach((item) => {
				item.image = this.cdn + item.image;
			});
			return data;
		});
	}

	// Опубликовать заказ
	postOrder(order: IOrder): Promise<IOrderEntity> {
		return this.post('/order', order).then((data: IOrderEntity) => data);
	}
}
