import OrphanedSocket from "../OrphanedSocket.ts";

export default class IsOrphanedSocket {
  public static run(unknown: unknown): unknown is OrphanedSocket {
    return (
      typeof unknown === "object" &&
      unknown !== null &&
      "id" in unknown &&
      "ip" in unknown &&
      "createdAt" in unknown &&
      "applicationName" in unknown &&
      typeof unknown.id === "string" &&
      typeof unknown.ip === "string" &&
      typeof unknown.applicationName === "string"
    );
  }
}
