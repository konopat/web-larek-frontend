import { FormErrors, IEvents, IFormState } from '../../types';
import { Form } from '../common/Form';

export class FormContactsView extends Form<IFormState> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;
	protected _formErrors: FormErrors = {};

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._emailInput = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;

		this._phoneInput = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
	}

	set email(value: string | null) {
		this._emailInput.value = value;
		this.validate();
	}

	get email() {
		return this._emailInput.value;
	}

	set phone(value: string | null) {
		this._phoneInput.value = value;
		this.validate();
	}

	get phone() {
		return this._phoneInput.value;
	}

	validate() {
		const errors: typeof this._formErrors = {};
		const emailValid = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
		const phoneValid =
			/^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/;

		if (!this.email) {
			errors.email = 'Укажите Email';
		} else if (!emailValid.test(this.email)) {
			errors.email = 'Укажите правильный Email';
		}
		if (!this.phone) {
			errors.phone = 'Укажите телефон';
		} else if (!phoneValid.test(this.phone)) {
			errors.phone = 'Укажите правильный телефон';
		}

		this._formErrors = errors;
		this.events.emit('formErrors:change', this._formErrors);
		return Object.keys(errors).length === 0;
	}

	reset() {
		this.email = null;
		this.phone = null;
	}
}
