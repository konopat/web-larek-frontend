import { ICardView, ICategories, ProductID } from '../../types';
import { settings } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';

export class CardView extends Component<ICardView> {
	protected _title: HTMLElement;
	protected _price: HTMLSpanElement;
	protected _description?: HTMLParagraphElement;
	protected _image?: HTMLImageElement;
	protected _category?: HTMLSpanElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);

		if (container.querySelector(`.card__text`) !== null) {
			this._description = ensureElement<HTMLParagraphElement>(
				`.card__text`,
				container
			);
		}
		if (container.querySelector(`.card__image`) !== null) {
			this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
		}

		if (container.querySelector(`.card__category`) !== null) {
			this._category = ensureElement<HTMLSpanElement>(
				`.card__category`,
				container
			);
		}

		if (container.querySelector(`.card__button`) !== null) {
			this._button = ensureElement<HTMLButtonElement>(
				`.card__button`,
				container
			);
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title() {
		return this._title.textContent || '';
	}

	set price(value: number) {
		if (value) {
			this.setText(this._price, `${String(value)} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно 🗿');
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set image(src: string) {
		this.setImage(this._image, src, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, settings.categories[value], true);
	}
}
