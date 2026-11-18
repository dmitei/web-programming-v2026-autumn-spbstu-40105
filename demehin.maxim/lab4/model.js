export class Student {
  constructor(id, name, grades = {}) {
    this.id = id;
    this.name = name;
    this.grades = grades;
  }

  addGrade(subject, grade) {
    this.grades[subject] = grade;
  }

  removeGrade(subject) {
    delete this.grades[subject];
  }

  getAverageGrade() {
    const values = Object.values(this.grades);
    if (values.length === 0) {
      return 0;
    }
    return values.reduce((acc, g) => acc + g, 0) / values.length;
  }

  get summary() {
    return `Студент ${this.name} (id: ${this.id}) — средний балл: ${this.getAverageGrade().toFixed(2)}`;
  }
}

export function getUniqueSubjects(students) {
  const set = new Set();
  for (const s of students) {
    for (const subject of Object.keys(s.grades)) {
      set.add(subject);
    }
  }
  return [...set];
}

export function groupStudentsByAverageGrade(students) {
  return students.reduce((acc, s) => {
    const key = s.getAverageGrade().toFixed(2);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(s);
    return acc;
  }, {});
}

export function groupStudentsBySubject(students) {
  const map = new Map();
  for (const s of students) {
    for (const subject of Object.keys(s.grades)) {
      if (!map.has(subject)) {
        map.set(subject, []);
      }
      map.get(subject).push(s);
    }
  }
  return map;
}

export function getTopStudents(students) {
  if (students.length === 0) {
    return [];
  }
  const max = Math.max(...students.map((s) => s.getAverageGrade()));
  return students.filter((s) => s.getAverageGrade() === max);
}

export function findStudentsBySubject(students, subject) {
  return students.filter((s) => subject in s.grades);
}
