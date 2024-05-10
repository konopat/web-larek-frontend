import {
	IEvents,
	IProductEntity,
	IProductList,
	IProductModel,
	ProductID,
} from '../../types';
import { Model } from '../base/model';

export class ProductModel extends Model<IProductModel> {
	protected _list: IProductList;
	protected _cart: IProductList;
	protected _cartAmount: number;
	protected _selectedItem?: IProductEntity | null;

	constructor(
		protected data: Partial<IProductList>,
		protected events: IEvents
	) {
		super({}, events);
		this._list = { items: [], total: 0 };
		this._cart = { items: [], total: 0 };
		this._cartAmount = 0;
	}

	set list(list: IProductList) {
		this._list = list;
		this.emitChanges('items:changed', { list: this._list });
	}

	get list() {
		return this._list;
	}

	get cart() {
		return this._cart;
	}

	set cartAmount(total: number) {
		this._cartAmount = total;
	}

	get cartAmount() {
		return this._cartAmount;
	}

	set selectedItem(item: IProductEntity) {
		this._selectedItem = item;
		this.emitChanges('selected-item:changed', item);
	}

	get selectedItem() {
		return this._selectedItem;
	}

	addSelectedItemToCart() {
		if (this.selectedItem) {
			this._cart.items.push(this.selectedItem);
			this._cart.total += 1;
			this.updateCartAmount();
			this.emitChanges('cart:changed', this._cart);
		}
	}

	findById(id: ProductID): IProductEntity {
		return this._list.items.filter((item) => item.id === id)[0];
	}

	isInCart(item: IProductEntity) {
		if (this._cart.items.includes(item)) {
			return true;
		}
		return false;
	}

	updateCartAmount() {
		let amount = 0;
		if (this._cart.items.length) {
			this._cart.items.forEach((item) => {
				amount += item.price;
			});
		}
		this._cartAmount = amount;
	}

	removeFromCart(item: IProductEntity) {
		this._cart.items = this.cart.items.filter((cartItem) => cartItem !== item);
		this._cart.total = this._cart.items.length;
		this.updateCartAmount();
		this.emitChanges('cart:changed', item);
	}

	clearCart() {
		this._cart.items = [];
		this._cart.total = this._cart.items.length;
		this.updateCartAmount();
		this.emitChanges('cart:changed');
	}
}
