import {Event} from './model.js';

const STORAGE_KEY = 'lab4-events';
const ASYNC_DELAY = 300;

function loadEvents() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  const parsed = JSON.parse(raw);
  return parsed.map(
    (item) => new Event(item.id, item.title, item.participants, item.date),
  );
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

let events = loadEvents();

function addEventAsync({id, title, participants, date}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEvent = new Event(id, title, participants, date);
      events = [...events, newEvent];
      saveEvents(events);
      resolve(newEvent);
    }, ASYNC_DELAY);
  });
}

function removeEventAsync(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      events = events.filter((event) => event.id !== id);
      saveEvents(events);
      resolve();
    }, ASYNC_DELAY);
  });
}

function addParticipantAsync(id, name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = events.find((item) => item.id === id);
      if (event) {
        event.addParticipant(name);
        saveEvents(events);
      }
      resolve();
    }, ASYNC_DELAY);
  });
}

function removeParticipantAsync(id, name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = events.find((item) => item.id === id);
      if (event) {
        event.removeParticipant(name);
        saveEvents(events);
      }
      resolve();
    }, ASYNC_DELAY);
  });
}

function createParticipantForm(event) {
  const form = document.createElement('form');
  form.className = 'participant-form';

  const input = document.createElement('input');
  input.name = 'participantName';
  input.type = 'text';
  input.placeholder = 'Имя участника';
  input.required = true;

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Добавить участника';

  form.append(input, submitButton);

  form.addEventListener('submit', async (submitEvent) => {
    submitEvent.preventDefault();
    const name = input.value.trim();
    if (!name) {
      return;
    }
    await addParticipantAsync(event.id, name);
    render();
  });

  return form;
}

function createRemoveParticipantControl(event) {
  const wrapper = document.createElement('div');
  wrapper.className = 'participant-form';

  const select = document.createElement('select');
  select.name = 'removeParticipantName';
  event.participants.forEach((name) => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'Удалить участника';
  removeButton.addEventListener('click', async () => {
    const name = select.value;
    if (!name) {
      return;
    }
    await removeParticipantAsync(event.id, name);
    render();
  });

  wrapper.append(select, removeButton);
  return wrapper;
}

function createEventCard(event) {
  const card = document.createElement('article');
  card.className = 'event-card';
  card.dataset.testid = 'entity-card';

  const title = document.createElement('h2');
  title.className = 'event-card-title';
  title.textContent = event.title;

  const meta = document.createElement('p');
  meta.className = 'event-card-meta';
  meta.textContent = `Дата: ${event.date} · Участников: ${event.participantCount}`;

  const participantsList = document.createElement('ul');
  participantsList.className = 'event-card-participants';
  event.participants.forEach((name) => {
    const item = document.createElement('li');
    item.textContent = name;
    participantsList.appendChild(item);
  });

  const actions = document.createElement('div');
  actions.className = 'event-card-actions';

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Удалить мероприятие';
  deleteButton.dataset.testid = 'delete-entity';
  deleteButton.addEventListener('click', async () => {
    await removeEventAsync(event.id);
    render();
  });

  actions.append(deleteButton);

  card.append(
    title,
    meta,
    participantsList,
    createParticipantForm(event),
    createRemoveParticipantControl(event),
    actions,
  );

  return card;
}

function render() {
  const list = document.querySelector('[data-testid="entity-list"]');
  list.innerHTML = '';
  events.forEach((event) => {
    list.appendChild(createEventCard(event));
  });
}

function setupEntityForm() {
  const form = document.querySelector('form[data-testid="entity-form"]');
  form.addEventListener('submit', async (submitEvent) => {
    submitEvent.preventDefault();
    const formData = new FormData(form);
    const id = formData.get('id');
    const title = formData.get('title');
    const date = formData.get('date');

    if (!id || !title || !date) {
      return;
    }

    await addEventAsync({id, title, date, participants: []});
    form.reset();
    render();
  });
}

setupEntityForm();
render();
