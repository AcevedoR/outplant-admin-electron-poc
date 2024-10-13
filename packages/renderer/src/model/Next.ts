export interface Next {
  event: string;
  in?: number;
  weight?: number;
  effects?: Record<string, boolean>;
}
