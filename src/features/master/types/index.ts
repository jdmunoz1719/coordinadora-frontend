export interface Application {
  id: string;
  name: string;
  code: string;
}

export interface SeverityLevel {
  id: number;
  name: string;
  color: string;
}

export interface EventType {
  id: number;
  name: string;
}

export interface IncidentStatus {
  id: number;
  name: string;
  color: string;
}

export interface AlertStatus {
  id: number;
  name: string;
}
