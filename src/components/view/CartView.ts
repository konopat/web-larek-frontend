import { ICartView, IEvents } from '../../types';
import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/component';

export class CartView extends Component<ICartView> implements ICartView {
	protected _list: HTMLElement;
	protected _totalPrice: HTMLSpanElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this._totalPrice = ensureElement<HTMLSpanElement>(
			'.basket__price',
			container
		);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);
	}

	set list(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setDisabled(this._button, false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Добавьте товары',
				})
			);
			this.setDisabled(this._button, true);
		}
	}

	set totalPrice(total: number) {
		this.setText(this._totalPrice, `${total} синапсов`);
	}
}
