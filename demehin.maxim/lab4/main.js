import './model.js';
import {Student, getUniqueSubjects, getTopStudents} from './model.js';

const STORAGE_KEY = 'students';

let students = loadFromStorage();

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const data = JSON.parse(raw);
    return data.map((s) => new Student(s.id, s.name, s.grades));
  } catch {
    return [];
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function asyncOp(callback, delay = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(callback()), delay);
  });
}

async function deleteStudent(id) {
  await asyncOp(() => {
    students = students.filter((s) => s.id !== id);
    saveToStorage();
  });
  render();
}

function render() {
  const container = document.querySelector('[data-testid="entity-list"]');
  container.innerHTML = '';

  if (students.length === 0) {
    container.textContent = 'Нет студентов';
    return;
  }

  for (const s of students) {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.setAttribute('data-testid', 'entity-card');
    card.dataset.id = String(s.id);

    const subjects = Object.entries(s.grades)
      .map(([subj, grade]) => `${subj}: ${grade}`)
      .join(', ');

    card.innerHTML = `
      <div><strong>ID:</strong> ${s.id}</div>
      <div><strong>Имя:</strong> ${s.name}</div>
      <div><strong>Средний балл:</strong> ${s.getAverageGrade().toFixed(2)}</div>
      <div><strong>Предметы:</strong> ${subjects || 'нет оценок'}</div>
      <button
        type="button"
        class="delete-button"
        data-testid="delete-entity"
      >Удалить</button>
    `;

    card
      .querySelector('[data-testid="delete-entity"]')
      .addEventListener('click', () => deleteStudent(s.id));

    container.appendChild(card);
  }
}

document
  .querySelector('[data-testid="entity-form"]')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const id = Number(form.elements.id.value);
    const name = form.elements.name.value.trim();

    await asyncOp(() => {
      if (students.some((s) => s.id === id)) {
        alert('Студент с таким ID уже существует');
        return;
      }
      students.push(new Student(id, name));
      saveToStorage();
    });

    form.reset();
    render();
  });

document
  .querySelector('[data-testid="grade-form"]')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const id = Number(form.elements.id.value);
    const subject = form.elements.subject.value.trim();
    const grade = Number(form.elements.grade.value);

    await asyncOp(() => {
      const s = students.find((st) => st.id === id);
      if (!s) {
        alert('Студент не найден');
        return;
      }
      s.addGrade(subject, grade);
      saveToStorage();
    });

    form.reset();
    render();
  });

document
  .querySelector('[data-testid="remove-grade-form"]')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const id = Number(form.elements.id.value);
    const subject = form.elements.subject.value.trim();

    await asyncOp(() => {
      const s = students.find((st) => st.id === id);
      if (!s) {
        alert('Студент не найден');
        return;
      }
      s.removeGrade(subject);
      saveToStorage();
    });

    form.reset();
    render();
  });

document
  .querySelector('.analytics-btn-subjects')
  .addEventListener('click', async () => {
    const subjects = await asyncOp(() => getUniqueSubjects(students));
    document.querySelector('.analytics').textContent = `Все предметы: ${
      subjects.join(', ') || 'нет'
    }`;
  });

document
  .querySelector('.analytics-btn-top')
  .addEventListener('click', async () => {
    const top = await asyncOp(() => getTopStudents(students));
    const text = top
      .map((s) => `${s.name} (${s.getAverageGrade().toFixed(2)})`)
      .join(', ');
    document.querySelector('.analytics').textContent = `Лучшие: ${
      text || 'нет'
    }`;
  });

render();
