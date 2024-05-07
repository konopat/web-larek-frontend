import { IProductEntity, IProductList, IProductModel } from '../../types';
import { Model } from '../base/model';

export class ProductModel extends Model<IProductModel> {
	protected _list: IProductList;
	protected _cart: IProductList;
	protected _cartAmount: number;
	protected _selectedItem?: IProductEntity | null;

	set list(list: IProductList) {
		this._list = list;
		this.emitChanges('items:changed', { list: this._list });
	}

	get list() {
		return this._list;
	}

	set cart(items: IProductList) {
		this._cart = items;
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
		this.emitChanges('selectedItem:changed', item);
	}

	get selectedItem() {
		return this._selectedItem;
	}

	isInCart(item: IProductEntity) {
		if (this._cart.items.includes(item)) {
			return true;
		}
		return false;
	}

	removeFromCart(item: IProductEntity) {
		this._cart.items = this.cart.items.filter((cartItem) => cartItem !== item);
		this.emitChanges('basket:changed', item);
	}

	clearCart() {
		this._cart.items = [];
		this.emitChanges('basket:changed');
	}
}
