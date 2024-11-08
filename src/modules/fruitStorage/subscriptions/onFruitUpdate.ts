import { IHandle } from "../../../common/events/adapter/IHandle";
import domainEventEmitterService from "../../../common/events/application/DomainEventEmitterService";
import { FRUIT_EVENTS } from "../../fruit/domain/constants/events.constant";
import fruitStorageService from "../application/FruitStorageService";

export class OnFruitUpdate implements IHandle {
  constructor() {
    this.setupSubscriptions();
  }

  public async doAction(payload: any): Promise<void> {
    await fruitStorageService.updateFruitStorage(
      payload.name,
      payload.limitOfFruitToBeStored,
    );
  }

  public setupSubscriptions() {
    domainEventEmitterService.on(FRUIT_EVENTS.UPDATE, this.doAction);
  }
}
