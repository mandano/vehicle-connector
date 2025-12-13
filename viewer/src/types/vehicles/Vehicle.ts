export default interface Vehicle {
  id: number;
  model: {
    modelName: string;
    ioT: {
      position: {
        latitude: {
          state: number;
          originatedAt?: string; // ISO 8601 date string
          updatedAt?: string; // ISO 8601 date string
          createdAt: string; // ISO 8601 date string
        };
        longitude: {
          state: number;
          originatedAt?: string; // ISO 8601 date string
          updatedAt?: string; // ISO 8601 date string
          createdAt: string; // ISO 8601 date string
        };
      };
      network: {
        connectionModules: Array<{
          imei: string;
          state: {
            state: {
              state: "connected" | "disconnected";
              originatedAt: string; // ISO 8601 date string
              updatedAt?: string; // ISO 8601 date string
              createdAt: string; // ISO 8601 date string
            };
          };
          detectedProtocol: {
            state: string;
            originatedAt: string; // ISO 8601 date string
            updatedAt?: string; // ISO 8601 date string
            createdAt: string; // ISO 8601 date string
          };
          setProtocol: {
            state: string;
            originatedAt: string; // ISO 8601 date string
            updatedAt?: string; // ISO 8601 date string
            createdAt: string; // ISO 8601 date string
          };
          setProtocolVersion: {
            state: string;
            originatedAt: string; // ISO 8601 date string
            updatedAt?: string; // ISO 8601 date string
            createdAt: string; // ISO 8601 date string
          };
          detectedProtocolVersion: {
            state: string;
            originatedAt: string; // ISO 8601 date string
            updatedAt?: string; // ISO 8601 date string
            createdAt: string; // ISO 8601 date string
          };
        }>;
      };
    };
    lock?: {
      state: {
        state: "locked" | "unlocked";
        originatedAt?: string; // ISO 8601 date string
        updatedAt?: string; // ISO 8601 date string
        createdAt: string; // ISO 8601 date string
      };
    };
    batteries?: {
      batteries: Array<{
        level: {
          state: number;
          originatedAt?: string; // ISO 8601 date string
          updatedAt?: string; // ISO 8601 date string
          createdAt: string; // ISO 8601 date string
        };
      }>;
    };
  };
}
