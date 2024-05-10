import { ICategories } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	paymentMethod: {
		online: 'card',
		onReceipt: 'cash',
	},
	categories: {
		'софт-скил': 'card__category_soft',
		другое: 'card__category_other',
		дополнительное: 'card__category_additional',
		кнопка: 'card__category_button',
		'хард-скил': 'card__category_hard',
	} as ICategories,
	event: {
		itemsChanged: 'items:changed',
		itemSelected: 'item:selected',
		selectedItemChanged: 'selected-item:changed',
		cartChanged: 'cart:changed',
		modalOpen: 'modal:open',
		modalClose: 'modal:close',
		orderStart: 'order:start',
		orderSubmit: 'order:submit',
		contactsSubmit: 'contacts:submit',
		successfully: 'successfully',
		userConfirmedOrder: 'user.confirmed:order',
		formErrorsChange: 'formErrors:change',
	},
};
