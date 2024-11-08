import { IHandle } from "../../../common/events/adapter/IHandle";
import domainEventEmitterService from "../../../common/events/application/DomainEventEmitterService";
import { FRUIT_STORAGE_EVENTS } from "../../fruitStorage/domain/constants/events.constant";
import fruitService from "../application/FruitService";

export class onFruitDeletionFromStorage implements IHandle {
  constructor() {
    this.setupSubscriptions();
  }

  public async doAction(payload: any): Promise<void> {
    await fruitService.deleteFruit(payload.name);
  }

  public setupSubscriptions() {
    domainEventEmitterService.on(FRUIT_STORAGE_EVENTS.DELETE, this.doAction);
  }
}
