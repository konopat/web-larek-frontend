import { IAPI, IEvents, IPresenter } from '../../types';

export class Presenter implements IPresenter {
	protected _api: IAPI;
	protected _events: IEvents;

	constructor(api: IAPI, events: IEvents) {
		this._api = api;
		this._events = events;
	}

	set api(api: IAPI) {
		this._api = api;
	}

	get api() {
		return this._api;
	}

	set events(events: IEvents) {
		this._events = events;
	}

	get events() {
		return this._events;
	}
}
