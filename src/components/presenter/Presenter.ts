import { IAPI, IEvents, IPresenter } from '../../types';

export class Presenter implements IPresenter {
	api: IAPI;
	eventEmitter: IEvents;
	constructor(api: IAPI, eventEmitter: IEvents) {
		this.api = api;
		this.eventEmitter = eventEmitter;
	}
}
