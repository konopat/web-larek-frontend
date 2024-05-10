import { ICardView, ICategories, IProductEntity, ProductID } from '../../types';
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
	protected _listIndex?: HTMLSpanElement;

	constructor(container: HTMLElement, data: IProductEntity) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this.setText(this._title, data.title);

		this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);
		if (data.price) {
			this.setText(this._price, `${String(data.price)} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно 🗿');
		}

		if (data.id) {
			this.container.dataset.id = data.id;
		}

		if (container.querySelector(`.card__text`) !== null) {
			this._description = ensureElement<HTMLParagraphElement>(
				`.card__text`,
				container
			);
			this.setText(this._description, data.description);
		}

		if (container.querySelector(`.card__image`) !== null) {
			this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
			this.setImage(this._image, data.image, this.title);
		}

		if (container.querySelector(`.card__category`) !== null) {
			this._category = ensureElement<HTMLSpanElement>(
				`.card__category`,
				container
			);
			this.setText(this._category, data.category);
			this._category.classList.add(settings.categories[data.category]);
		}

		if (container.querySelector(`.card__button`) !== null) {
			this._button = ensureElement<HTMLButtonElement>(
				`.card__button`,
				container
			);

			if (!data.price) {
				this.setDisabled(this._button, true);
			}
		}

		if (container.querySelector(`.basket__item-index`) !== null) {
			this._listIndex = ensureElement<HTMLSpanElement>(
				`.basket__item-index`,
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
		if (this._category) {
			this.toggleClass(this._category, settings.categories[value], true);
		}
	}

	set listingIndex(value: number) {
		this.setText(this._listIndex, value);
	}
}
