export abstract class BaseValidationRules {
  public time = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  public protocol = /^T_S_P$/;
  public imei = /^[0-9]{15}$/;
  public trackingId = /^[1-9]\d{4,50}$|^$|^undefined$/;
}
