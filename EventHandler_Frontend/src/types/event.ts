import { ParticipantOutgoing } from './participant';

export type EventIncoming = {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
};

export type EventOutgoing = {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  participants: ParticipantOutgoing[];
};
