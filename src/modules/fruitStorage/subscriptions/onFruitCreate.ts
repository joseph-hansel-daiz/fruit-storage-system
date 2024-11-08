import { IHandle } from "../../../common/events/adapter/IHandle";
import domainEventEmitterService from "../../../common/events/application/DomainEventEmitterService";
import { FRUIT_EVENTS } from "../../fruit/domain/constants/events.constant";
import fruitStorageService from "../application/FruitStorageService";

export class OnFruitCreate implements IHandle {
  constructor() {
    this.setupSubscriptions();
  }

  public async doAction(payload: any): Promise<void> {
    await fruitStorageService.createFruitStorage(
      payload.name,
      payload.limitOfFruitToBeStored,
    );
  }

  public setupSubscriptions() {
    domainEventEmitterService.on(FRUIT_EVENTS.CREATE, this.doAction);
  }
}
