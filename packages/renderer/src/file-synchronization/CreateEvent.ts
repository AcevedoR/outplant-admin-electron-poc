export interface CreateEvent {
  id: string;
  parentEventId: string;
  text: string;
  in?: number;
  weight?: number;
}
