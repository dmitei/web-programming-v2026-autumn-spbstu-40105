export class Event {
  constructor(id, title, participants = [], date) {
    this.id = id;
    this.title = title;
    this.participants = [...participants];
    this.date = date;
  }

  addParticipant(name) {
    this.participants.push(name);
  }

  removeParticipant(name) {
    this.participants = this.participants.filter(
      (participant) => participant !== name,
    );
  }

  get participantCount() {
    return this.participants.length;
  }
}

export function groupEventsByDate(events) {
  return events.reduce((groups, event) => {
    const key = event.date;
    const existing = groups[key] || [];
    return {...groups, [key]: [...existing, event]};
  }, {});
}

export function getUniqueParticipants(events) {
  const unique = new Set();
  events.forEach((event) => {
    event.participants.forEach((participant) => unique.add(participant));
  });
  return [...unique];
}

export function groupEventsByParticipantCount(events) {
  return events.reduce((groups, event) => {
    const key = event.participants.length;
    const existing = groups.get(key) || [];
    groups.set(key, [...existing, event]);
    return groups;
  }, new Map());
}

export function findEventsByParticipant(events, participantName) {
  return events.filter((event) => event.participants.includes(participantName));
}

export function findEventsByMonth(events, month) {
  return events.filter(
    (event) => new Date(event.date).getMonth() + 1 === month,
  );
}
