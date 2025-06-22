import VehicleRepositoryHashableInterface from "common/src/repositories/vehicle/VehicleRepositoryHashableInterface.ts";

import LoggerInterface from "../../../../common/src/logger/LoggerInterface.ts";
import SendAction from "../../../../common/src/vehicle/actions/SendAction.ts";
import ActionStateFromJsonInterface from "../../../../common/src/vehicle/model/actions/json/ActionStateFromJsonInterface.ts";
import OnMessageInterfaceV2 from "../../../../common/src/adapters/queue/OnMessageInterfaceV2.ts";
import HashColoredLoggerInterface from "../../../../common/src/logger/HashColoredLoggerInterface.ts";
import TransferAction from "../../../../common/src/vehicle/actions/TransferAction.ts";
import LockState from "../../../../common/src/vehicle/components/lock/LockState.ts";
import State from "../../../../common/src/vehicle/State.ts";

export class ProcessActionRequest implements OnMessageInterfaceV2 {
  constructor(
    private readonly _vehicleRepository: VehicleRepositoryHashableInterface,
    private readonly _sendAction: SendAction,
    private readonly _logger: LoggerInterface,
    private readonly _hashColoredLogger: HashColoredLoggerInterface,
    private readonly _actionStateFromJson: ActionStateFromJsonInterface,
  ) {}

  public async run(actionRequestAsString: string): Promise<boolean> {
    this._logger.debug(
      `Received action request: ${actionRequestAsString}`,
      ProcessActionRequest.name,
    );

    const actionRequest = this._actionStateFromJson.run(actionRequestAsString);

    if (actionRequest === undefined) {
      this._logger.warn("Invalid action request", ProcessActionRequest.name);

      return false;
    }

    this._hashColoredLogger.debug(
      `Action request: ${actionRequestAsString}`,
      actionRequest.id.slice(-4),
      ProcessActionRequest.name,
    );

    const hashable = await this._vehicleRepository.findById(
      actionRequest.vehicleId,
    );

    if (hashable === undefined) {
      this._logger.warn("Vehicle not found", ProcessActionRequest.name);

      return false;
    }
    const vehicle = hashable.value;

    if (!this.hasAttribute(vehicle.model, "ioT")) {
      this._logger.warn("Vehicle does not have IoT", ProcessActionRequest.name);

      return false;
    }

    if (
      vehicle.model.ioT === undefined ||
      vehicle.model.ioT.network === undefined
    ) {
      this._logger.warn(
        "IoT undefined or vehicle does not have network",
        ProcessActionRequest.name,
      );

      return false;
    }

    const isConnected = vehicle.model.ioT.network.isConnected();

    if (!isConnected) {
      this._logger.warn("Vehicle not connected", ProcessActionRequest.name);
      //TODO: respond in action_responses queue and acknowledge message
      return false;
    }

    const multipleConnected =
      vehicle.model.ioT.network.multipleModulesConnected();

    if (multipleConnected) {
      this._logger.warn(
        "Multiple modules connected, might send to wrong module",
      );
    }

    const connectedModule = vehicle.model.ioT.network.getConnectedModule();

    if (connectedModule === undefined) {
      this._logger.warn(
        "Connected module not found",
        ProcessActionRequest.name,
      );

      return false;
    }

    if (
      connectedModule.setProtocol === undefined ||
      connectedModule.setProtocolVersion === undefined
    ) {
      this._logger.warn(
        `SetProtocol or SetProtocolVersion not set, Imei: ${connectedModule.imei}`,
      );

      return false;
    }

    const imei = vehicle.model.ioT.network.getImeiOfFirstConnectedModule();

    if (imei === undefined) {
      this._logger.warn("Imei not found", ProcessActionRequest.name);

      return false;
    }

    const publishedAction = await this._sendAction.run(
      new TransferAction(
        new LockState(new State(actionRequest.state, new Date())),
        actionRequest.id,
        connectedModule.setProtocol.state,
        connectedModule.setProtocolVersion.state,
        imei,
      ),
    );

    if (publishedAction === undefined || publishedAction === false) {
      this._logger.error("Failed to publish action", ProcessActionRequest.name);

      return false;
    }
    return publishedAction;
  }

  private hasAttribute<T extends object>(
    obj: unknown,
    attribute: keyof T,
  ): obj is T {
    return attribute in (obj as T);
  }
}

export default ProcessActionRequest;
