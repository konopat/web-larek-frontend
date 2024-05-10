import { FormErrors, IEvents, IFormAddressView, IFormState } from '../../types';
import { settings } from '../../utils/constants';
import { Form } from '../common/Form';

export class FormAddressView
	extends Form<IFormState>
	implements IFormAddressView
{
	protected _onlineMethodButton: HTMLButtonElement;
	protected _cashMethodButton: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;
	protected _formErrors: FormErrors = {};
	protected _paymentMethod: string;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._addressInput = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		this._onlineMethodButton = this.container.elements.namedItem(
			settings.paymentMethod.online
		) as HTMLButtonElement;

		this._cashMethodButton = this.container.elements.namedItem(
			settings.paymentMethod.onReceipt
		) as HTMLButtonElement;

		if (this._onlineMethodButton) {
			this._onlineMethodButton.addEventListener('click', () => {
				events.emit('order.payment:change', {
					field: 'payment',
					value: settings.paymentMethod.online,
				});
			});
		}

		if (this._cashMethodButton) {
			this._cashMethodButton.addEventListener('click', () => {
				events.emit('order.payment:change', {
					field: 'payment',
					value: settings.paymentMethod.onReceipt,
				});
			});
		}
	}

	set address(value: string) {
		this._addressInput.value = value;
		this.validate();
	}

	get address() {
		return this._addressInput.value;
	}

	set payment(value: string | null) {
		if (value === '' || null) {
			this.toggleClass(this._onlineMethodButton, 'button_alt-active', false);
			this.toggleClass(this._cashMethodButton, 'button_alt-active', false);
		}
		if (value === settings.paymentMethod.online) {
			this.toggleClass(this._onlineMethodButton, 'button_alt-active', true);
			this.toggleClass(this._cashMethodButton, 'button_alt-active', false);
		}
		if (value === settings.paymentMethod.onReceipt) {
			this.toggleClass(this._onlineMethodButton, 'button_alt-active', false);
			this.toggleClass(this._cashMethodButton, 'button_alt-active', true);
		}
		this._paymentMethod = value;
		this.validate();
	}

	validate() {
		const errors: typeof this._formErrors = {};
		if (!this._paymentMethod) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (!this.address) {
			errors.address = 'Укажите адрес';
		}

		this._formErrors = errors;
		this.events.emit('formErrors:change', this._formErrors);
		return Object.keys(errors).length === 0;
	}

	reset() {
		this.payment = null;
		this.toggleClass(this._onlineMethodButton, 'button_alt-active', false);
		this.toggleClass(this._cashMethodButton, 'button_alt-active', false);
		this.address = null;
	}
}
