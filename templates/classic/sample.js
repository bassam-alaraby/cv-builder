// The sample document this template ships with. It is deliberately generic:
// placeholder names, no real person, and every section switched on so a new
// visitor can see what the template can do.

export const sample = {
  version: 1,
  profile: {
    name: 'First Last',
    headline: 'Software Engineer · University Name',
    contacts: {
      rows: [
        {
          items: [
            { type: 'phone', value: '+1 555 0100', url: '' },
            { type: 'email', value: 'first.last@example.com', url: '' },
          ],
        },
        {
          items: [
            { type: 'website', value: 'example.com', url: '' },
            { type: 'github', value: 'username', url: '' },
            { type: 'linkedin', value: 'username', url: '' },
          ],
        },
      ],
    },
  },
  sections: {
    summary: {
      type: 'summary',
      heading: 'Objective',
      visible: true,
      body: 'Second-year Computer Science student with hands-on experience building web applications. Familiar with databases, third-party services and the fundamentals of software development. Looking for an internship to strengthen engineering skills on real projects.',
    },
    education: {
      type: 'education',
      heading: 'Education',
      visible: true,
      entries: [
        {
          institution: 'Faculty of Computers and Information — University Name',
          degree: 'B.Sc. Computer Science',
          location: 'City, Country',
          dates: { start: '2023', end: '' },
        },
      ],
    },
    experience: {
      type: 'experience',
      heading: 'Experience',
      visible: true,
      entries: [
        {
          role: 'Software Engineering Intern',
          organisation: 'Company Name',
          location: 'City, Country',
          dates: { start: 'Jun 2025', end: 'Aug 2025' },
          bullets: 'Built and shipped features end to end, from database to interface\nWorked inside a small team with weekly reviews and short release cycles\nFixed production bugs and cut page load time in half',
        },
      ],
    },
    projects: {
      type: 'projects',
      heading: 'Projects',
      visible: true,
      entries: [
        {
          name: 'Project Name — Web Platform',
          stack: 'Python, Flask, PostgreSQL',
          dates: { start: '2025', end: 'Present' },
          bullets: 'Built a full stack web application with accounts, catalogue and checkout\nImplemented authentication, input validation and rate limited admin routes\nDeployed on a free hosting tier with environment based configuration',
          url: 'example.com/project',
        },
        {
          name: 'Second Project Name',
          stack: 'C, SQL',
          dates: { start: '2024', end: '2024' },
          bullets: 'Implemented data structures and algorithms from scratch\nAdded tests and a small write up of the results',
          url: '',
        },
      ],
    },
    skills: {
      type: 'skills',
      heading: 'Technical Skills',
      visible: true,
      entries: [
        { label: 'Languages', items: 'C, C++, Python, JavaScript, SQL' },
        { label: 'Web Development', items: 'HTML, CSS, Flask, Django' },
        { label: 'Databases', items: 'SQLite, PostgreSQL' },
        { label: 'Tools', items: 'Git, GitHub, Linux' },
      ],
    },
    courses: {
      type: 'courses',
      heading: 'Courses',
      visible: true,
      entries: [
        {
          name: 'Course Name — Introduction to Computer Science',
          provider: 'University Name',
          dates: { start: '2024', end: '' },
          note: 'Algorithms, data structures, memory management, SQL and web development.',
        },
      ],
    },
    languages: {
      type: 'languages',
      heading: 'Languages',
      visible: true,
      entries: [
        { label: 'Language Name', items: 'Native' },
        { label: 'Second Language', items: 'Professional working proficiency' },
      ],
    },
    custom: [],
  },
};
