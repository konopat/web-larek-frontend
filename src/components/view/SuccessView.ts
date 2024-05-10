import { IEvents, ISuccessView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';

export class SuccessView extends Component<ISuccessView> {
	protected _description: HTMLParagraphElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this._description = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			container
		);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);

		this._closeButton.addEventListener('click', () => {
			events.emit('user.confirmed:order');
		});
	}

	set description(value: number) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}
}
