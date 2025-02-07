export type ParticipantIncoming = {
  name: string;
  email?: string;
  phoneNumber?: string;
};

export type ParticipantOutgoing = {
  id: number;
  name: string;
  email?: string;
  phoneNumber?: string;
  eventId: number;
};
