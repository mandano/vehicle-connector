import dotenv from "dotenv";
import UpdateConnectionState from "common/src/vehicle/model/builders/update/components/connectionModule/state/UpdateConnectionState.ts";
import UpdateConnectionModules from "common/src/vehicle/model/builders/update/components/connectionModules/UpdateConnectionModules.ts";
import UpdateConnectionModule from "common/src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import CloneConnectionModule from "common/src/vehicle/components/iot/network/CloneConnectionModule.ts";
import CloneState from "common/src/vehicle/model/CloneState.ts";
import CloneConnectionState from "common/src/vehicle/components/iot/network/CloneConnectionState.ts";
import ConnectionState from "common/src/vehicle/components/iot/network/ConnectionState.ts";
import DtoContext from "common/src/vehicle/dto/_Context.ts";
import VehicleValkeyRepository from "common/src/repositories/vehicle/valkey/VehicleValkeyRepository.ts";
import ValkeyAdapter from "common/src/adapters/valkey/ValkeyAdapter.ts";
import OrphanedSocketFileSystemRepository from "common/src/repositories/orphanedSocket/OrphanedSocketValkeyRepository.ts";
import ConnectionModuleToChanges from "common/src/vehicle/model/builders/update/components/connectionModule/ConnectionModuleToChanges.ts";
import UpdateStateNoUndefined from "common/src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import ClonePosition from "common/src/vehicle/components/iot/position/ClonePosition.ts";
import PositionToChanges from "common/src/vehicle/components/iot/position/PositionToChanges.ts";
import NetworkToChanges from "common/src/vehicle/components/iot/network/NetworkToChanges.ts";
import UpdateDetectedProtocol from "common/src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocol.ts";
import UpdateSetProtocolVersion from "common/src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocolVersion.ts";
import UpdateDetectedProtocolVersion from "common/src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocolVersion.ts";
import UpdateSetProtocol from "common/src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocol.ts";
import ConnectionStates from "common/src/vehicle/components/iot/network/connectionModule/connectionState/ConnectionStates.ts";
import UpdateBatteries from "common/src/vehicle/model/builders/update/components/energy/batteries/UpdateBatteries.ts";
import UpdatePosition from "common/src/vehicle/model/builders/update/components/position/UpdatePosition.ts";
import UpdateBattery from "common/src/vehicle/model/builders/update/components/energy/batteries/battery/UpdateBattery.ts";
import UpdateVoltage from "common/src/vehicle/model/builders/update/components/energy/batteries/battery/voltage/UpdateVoltage.ts";
import StateToChanges from "common/src/vehicle/model/builders/update/components/state/StateToChanges.ts";
import CloneBattery from "common/src/vehicle/model/builders/update/components/energy/batteries/battery/CloneBattery.ts";
import BatteryToChanges from "common/src/vehicle/model/builders/update/components/energy/batteries/battery/BatteryToChanges.ts";
import CloneBatteries from "common/src/vehicle/model/builders/update/components/energy/batteries/CloneBatteries.ts";
import BatteriesToChanges from "common/src/vehicle/model/builders/update/components/energy/batteries/BatteriesToChanges.ts";
import UpdateLock from "common/src/vehicle/model/builders/update/components/lock/UpdateLock.ts";
import LockStateToChanges from "common/src/vehicle/components/lock/LockStateToChanges.ts";
import CloneLockState from "common/src/vehicle/components/lock/CloneLockState.ts";
import CloneIoT from "common/src/vehicle/components/iot/CloneIoT.ts";
import IotToChanges from "common/src/vehicle/model/builders/update/components/ioT/IotToChanges.ts";
import CloneNetwork from "common/src/vehicle/components/iot/network/CloneNetwork.ts";
import CloneConnectionModules from "common/src/vehicle/components/iot/network/CloneConnectionModules.ts";
import PublishChanges from "common/src/vehicle/model/builders/update/publish/PublishChanges.ts";
import UpdateState from "common/src/vehicle/model/builders/update/components/state/UpdateState.ts";
import CloneStateExt from "common/src/vehicle/model/CloneStateExt.ts";
import ToBeUpdatedOriginatedAtUndefined from "common/src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "common/src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined from "common/src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";

import { WorkerQueue } from "../../../common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { Exchange } from "../../../common/src/adapters/queue/rabbitMq/Exchange.ts";
import { SendActionRequest } from "../../../common/src/vehicle/model/actions/SendActionRequest.ts";
import { Logger } from "../../../common/src/logger/Logger.ts";
import { LogLevels } from "../../../common/src/logger/LogLevels.ts";
import { Acknowledge } from "../../../common/src/vehicle/components/iot/network/protocol/Acknowledge.ts";
import ImeiSocketIdRepository from "../../../common/src/repositories/imeiSocketId/ImeiSocketIdValkeyRepository.ts";
import { Channel } from "../../../common/src/adapters/queue/rabbitMq/Channel.ts";
import { TcpInterfaceMessageJsonConverter } from "../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverter.ts";
import Update from "../../../common/src/vehicle/model/builders/update/Update.ts";
import UpdateUnknown from "../../../common/src/vehicle/model/builders/update/models/unknown/UpdateUnknown.ts";
import UpdateIoT from "../../../common/src/vehicle/model/builders/update/components/ioT/UpdateIoT.ts";
import UpdateNetwork from "../../../common/src/vehicle/model/builders/update/components/network/UpdateNetwork.ts";
import UpdateLockableScooter from "../../../common/src/vehicle/model/builders/update/models/lockableScooter/UpdateLockableScooter.ts";
import UpdateLockState from "../../../common/src/vehicle/model/builders/update/components/lock/UpdateLockState.ts";
import UpdateSpeedometer from "../../../common/src/vehicle/model/builders/update/components/speedometer/UpdateSpeedometer.ts";

import { Cleanup } from "./Cleanup.ts";
import { HandleFirstPaket } from "./handler/onData/HandleFirstPaket.ts";
import { HandleNotFirstPaket } from "./handler/onData/HandleNotFirstPaket.ts";
import { SaveVehicle } from "./handler/onData/SaveVehicle.ts";
import { OnDisconnection } from "./handler/OnDisconnection.ts";
import { ForwardToActionResponses } from "./handler/onData/ForwardToActionResponses.ts";
import { OnData } from "./handler/onData/OnData.ts";
import { ProcessFromTcpInterfaceMessage } from "./ProcessFromTcpInterfaceMessage.ts";
import { UpdateVehicle } from "./handler/onData/UpdateVehicle.ts";
import loadContext from "./bootstrap/loadContext.ts";

async function run() {
  dotenv.config();

  const logger = new Logger(LogLevels.DEBUG_LEVEL);

  const context = await loadContext();
  const rabbitMqChannel = new Channel(context.rabbitMq, logger);

  const dtoContext = new DtoContext(
    new SendActionRequest(new WorkerQueue(rabbitMqChannel, "action_requests")),
    logger,
  );

  const valkeyAdapter = new ValkeyAdapter(logger, {
    host: process.env.VALKEY_HOST ?? "localhost",
    port: process.env.VALKEY_PORT ? parseInt(process.env.VALKEY_PORT) : 6379,
  });

  const vehicleRepository = new VehicleValkeyRepository(
    valkeyAdapter,
    logger,
    dtoContext.objectToDto().objectToDto(),
    dtoContext.dtoToVehicle().dtoToVehicle(),
    dtoContext.vehicleToObject(),
    dtoContext.dtoToObject(),
  );

  const fromTcpInterface = new WorkerQueue(rabbitMqChannel, "fromTcpInterface");
  const vehicleUpdateChanges = new WorkerQueue(
    rabbitMqChannel,
    "vehicleUpdateChanges",
    false,
    false,
    360000,
  );

  const exchange = new Exchange(rabbitMqChannel, "toTcpInterface", logger);

  const acknowledge = new Acknowledge(
    exchange,
    new TcpInterfaceMessageJsonConverter(logger),
    logger,
  );
  const handleLockAttribute = new ForwardToActionResponses(
    new Exchange(rabbitMqChannel, "action_responses", logger),
  );
  const imeiSocketIdRepository = new ImeiSocketIdRepository(
    valkeyAdapter,
    logger,
  );

  const createByMessageLineContext = context.createModelByMessageLineContext;
  const updateStateNoUndefined = new UpdateStateNoUndefined(
    new ToBeUpdatedOriginatedAtUndefined(),
    new OriginatedAtUndefined(),
    new UpdateNoUndefined(),
  );

  const updateConnectionModules = new UpdateConnectionModules(
    new UpdateConnectionModule(
      new UpdateConnectionState(
        updateStateNoUndefined,
        new CloneConnectionState(new CloneState<ConnectionStates>()),
      ),
      new UpdateDetectedProtocol(updateStateNoUndefined),
      new UpdateDetectedProtocolVersion(updateStateNoUndefined),
      new UpdateSetProtocolVersion(),
      new UpdateSetProtocol(),
    ),
    new CloneConnectionModule(
      new CloneConnectionState(
        new CloneState<
          typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
        >(),
      ),
      new CloneState<string>(),
    ),
    new ConnectionModuleToChanges(),
  );
  const clonePosition = new ClonePosition();
  const updateState = new UpdateState(
    updateStateNoUndefined,
    new StateToChanges(),
    new CloneStateExt(),
  );
  const updateIoT = new UpdateIoT(
    new UpdateNetwork(
      updateConnectionModules,
      new NetworkToChanges(),
      new CloneNetwork(
        new CloneConnectionModules(
          new CloneConnectionModule(
            new CloneConnectionState(new CloneState<ConnectionStates>()),
            new CloneState<ConnectionStates>(),
          ),
        ),
      ),
    ),
    new UpdatePosition(
      updateState,
      new ClonePosition(),
      new PositionToChanges(),
    ),
    new CloneIoT(
      clonePosition,
      new CloneNetwork(
        new CloneConnectionModules(
          new CloneConnectionModule(
            new CloneConnectionState(new CloneState<ConnectionStates>()),
            new CloneState<string>(),
          ),
        ),
      ),
    ),
    new IotToChanges(),
  );

  const updateBatteries = new UpdateBatteries(
    new UpdateBattery(
      updateStateNoUndefined,
      new UpdateVoltage(updateStateNoUndefined, new StateToChanges()),
      new BatteryToChanges(),
    ),
    new CloneBatteries(new CloneBattery()),
    new BatteriesToChanges(),
  );

  const stateToChanges = new StateToChanges();
  const cloneLockState = new CloneLockState(new CloneState<string>());
  const lockStateToChanges = new LockStateToChanges(stateToChanges);
  const updateLockState = new UpdateLockState(
    updateStateNoUndefined,
    cloneLockState,
    lockStateToChanges,
  );
  const updateLock = new UpdateLock(
    updateLockState,
    cloneLockState,
    lockStateToChanges,
  );
  const updateSpeedometer = new UpdateSpeedometer(
    updateStateNoUndefined,
    stateToChanges,
    new CloneState<number>(),
  );
  const update = new Update(
    new UpdateUnknown(updateBatteries, updateIoT),
    new UpdateLockableScooter(
      updateBatteries,
      updateIoT,
      updateLock,
      updateSpeedometer,
    ),
  );

  const updateVehicle = new UpdateVehicle(
    vehicleRepository,
    logger,
    update,
    new PublishChanges(vehicleUpdateChanges),
  );
  const saveMessageLineContextToVehicle = new SaveVehicle(
    vehicleRepository,
    logger,
    true,
    updateVehicle,
  );

  const orphanedSocketRepository = new OrphanedSocketFileSystemRepository(
    valkeyAdapter,
    logger,
  );

  const onData = new OnData(
    new HandleFirstPaket(
      imeiSocketIdRepository,
      saveMessageLineContextToVehicle,
      createByMessageLineContext,
      handleLockAttribute,
      acknowledge,
      logger,
      context.createMessageLineContext,
      orphanedSocketRepository,
    ),
    new HandleNotFirstPaket(
      vehicleRepository,
      updateVehicle,
      context.createMessageLineContextByProtocolAndVersion,
      createByMessageLineContext,
      handleLockAttribute,
      acknowledge,
      logger,
    ),
    logger,
    imeiSocketIdRepository,
  );

  const cleaner = new Cleanup(process, logger, imeiSocketIdRepository);
  cleaner.init();

  fromTcpInterface
    .consume(
      new ProcessFromTcpInterfaceMessage(
        onData,
        new OnDisconnection(imeiSocketIdRepository, vehicleRepository, logger),
        new TcpInterfaceMessageJsonConverter(logger),
      ),
    )
    .then();
}

run().then();
