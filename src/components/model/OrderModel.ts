import { IEvents, IOrder, IOrderEntity, IOrderModel } from '../../types';
import { settings } from '../../utils/constants';
import { Model } from '../base/model';

export class OrderModel extends Model<IOrderModel> implements IOrderModel {
	protected _state: IOrder;
	protected _completedOrders: IOrderEntity[];

	constructor(protected events: IEvents) {
		super({}, events);
		this._state = {
			items: [],
			address: '',
			payment: '',
			email: '',
			phone: '',
			total: 0,
		};
		this._completedOrders = [];
	}

	set state(order: IOrder) {
		this._state = order;
	}

	get state() {
		return this._state;
	}

	set payment(value: string) {
		this._state.payment = value;
	}

	set address(value: string) {
		this._state.address = value;
	}

	set email(value: string) {
		this._state.email = value;
	}

	set phone(value: string) {
		this._state.phone = value;
	}

	set completedOrder(order: IOrderEntity) {
		this._completedOrders.push(order);

		this.events.emit(
			settings.event.successfully,
			this._completedOrders.filter((item) => item.id === order.id)[0]
		);
	}

	get completedOrders() {
		return this._completedOrders;
	}

	resetState = () => {
		this._state = {
			items: [],
			address: '',
			payment: '',
			email: '',
			phone: '',
			total: 0,
		};
	};
}
