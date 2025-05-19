import { Lock } from "../../../../components/lock/Lock.ts";

type Options = {
  imei: string;
  protocol: string;
  protocolVersion: string;
  coordinate?: {
    latitude: number;
    longitude: number;
  };
  lock?: Lock;
  initWithDefaultValues?: boolean;
};

export default Options;
