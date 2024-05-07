import { ICategories } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	labels: {
		toBuy: 'Купить',
		addToCart: 'В корзину',
	},
	paymentMethod: {
		online: 'online',
		onReceipt: 'on receipt',
	},
	categories: {
		'софт-скил': 'card__category_soft',
		другое: 'card__category_other',
		дополнительное: 'card__category_additional',
		кнопка: 'card__category_button',
		'хард-скил': 'card__category_hard',
	} as ICategories,
};
