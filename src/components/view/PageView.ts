import { IEvents, IPageView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';

export class PageView extends Component<IPageView> {
	protected _cartTotal: HTMLSpanElement;
	protected _gallery: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._gallery = ensureElement<HTMLElement>('.gallery', container);
		this._cartTotal = ensureElement<HTMLElement>(
			'.header__basket-counter',
			container
		);

		// Всплывающие события
		this.container.addEventListener('click', (evt) => {
			// Проверяем, что нажатие было точно по элементу DOM
			const isElem = evt.target instanceof Element;
			if (isElem) {
				// Отслеживаемые элементы
				// Карточка
				const cardElement: HTMLElement = evt.target.closest('.card');
				if (cardElement) {
					// Докладываем о событии и передаем элемент
					this.events.emit('item:selected', cardElement);
				}
				// Корзина
				const cartElement: HTMLElement = evt.target.closest('.header__basket');
				if (cartElement) {
					this.events.emit('cart:open');
				}
			}
		});
	}

	set cartTotal(value: number) {
		this.setText(this._cartTotal, String(value));
	}

	set gallery(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}
}
