import { IEvents, IPageView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';

export class PageView extends Component<IPageView> {
	protected _cartTotal: HTMLSpanElement;
	protected _gallery: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._cartTotal = ensureElement<HTMLElement>('.header__basket-counter');

		// Всплывающие события элементов галереи
		this.container.addEventListener('click', (evt) => {
			// Проверяем, что нажатие было точно по элементу DOM
			const isElem = evt.target instanceof Element;
			if (isElem) {
				// Если это так, ищем карточку
				const cardElement: HTMLElement = evt.target.closest('.card');
				// И если элемент - это карточка
				if (cardElement) {
					// Докладываем о событии и передаем элемент
					this.events.emit('item:selected', cardElement);
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
