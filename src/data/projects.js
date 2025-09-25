const projects = [
    {
      id: 1,
      title: 'Smart Store Manager',
      description: 'A comprehensive decision support system for small business owners, featuring inventory management, sales analytics, customer insights, and AI-powered recommendations for business optimization.',
      image: '/assets/projects/smart-store-manager.png',
      technologies: ['React', 'Python', 'TensorFlow', 'PostgreSQL', 'Django', 'Chart.js'],
      featured: true,
      liveUrl: 'https://example.com/smart-store-manager',
      repoUrl: 'https://lightslategrey-stork-969980.hostingersite.com/owner/managebusiness.php'
    },
    {
      id: 2,
      title: 'Pokemon Battle',
      description: 'Pokemon-themed applications with different gameplay experiences and features.',
      image: '/assets/images/projects/pokedex.jpg',
      technologies: ['React', 'Pokemon API', 'Tailwind CSS', 'Redux'],
      featured: true,
      hasVariations: true,
      variations: [
        {
          name: 'Pokedex Browser',
          description: 'A comprehensive Pokedex application that allows users to browse, search, and view detailed information about Pokemon. Features include filtering by type, generation, and abilities.',
          image: '/assets/projects/pokemon-pokedex.jpg',
          liveUrl: 'https://example.com/pokedex',
          repoUrl: 'https://github.com/dinocavity/pokemon-pokedex.git',
          technologies: ['React', 'Pokemon API', 'Tailwind CSS', 'Redux']
        },
        {
          name: 'Pokemon Battle Arena',
          description: 'Turn-based Pokemon battle simulator with authentic game mechanics, type effectiveness, and strategic combat system.',
          image: '/assets/projects/pokemon-battle.jpg',
          liveUrl: 'https://pokemon-battle-arena.netlify.app',
          repoUrl: 'https://github.com/dinocavity/pokemon-battle.git',
          technologies: ['React', 'Pokemon API', 'Framer Motion', 'Context API']
        },
        {
          name: 'Pokemon Team Builder',
          description: 'Strategic team building tool for competitive Pokemon battles with stat calculations and team synergy analysis.',
          image: '/assets/projects/pokemon-team-builder.jpg',
          repoUrl: 'https://github.com/dinocavity/pokemon-team-builder.git',
          technologies: ['React', 'Pokemon API', 'Chart.js', 'Local Storage']
        }
      ]
    },
    {
      id: 3,
      title: 'Todo Applications',
      description: 'Task management applications with different approaches to productivity and organization.',
      image: '/assets/projects/todo-app.png',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
      featured: true,
      hasVariations: true,
      variations: [
        {
          name: 'Classic Todo',
          description: 'A clean and simple todo application with essential task management features like adding, editing, and deleting tasks.',
          image: '/assets/projects/todo-classic.jpg',
          liveUrl: 'https://todo-marquez-alonzo.netlify.app',
          repoUrl: 'https://github.com/dinocavity/TODO.git',
          technologies: ['React', 'Local Storage', 'Tailwind CSS']
        },
        {
          name: 'Advanced Todo Manager',
          description: 'Feature-rich task management with categories, priority levels, due dates, progress tracking, and team collaboration.',
          image: '/assets/projects/todo-advanced.jpg',
          liveUrl: 'https://advanced-todo-manager.netlify.app',
          repoUrl: 'https://github.com/dinocavity/advanced-todo.git',
          technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Socket.io']
        },
        {
          name: 'Kanban Todo Board',
          description: 'Trello-style kanban board for visual task management with drag-and-drop functionality and workflow stages.',
          image: '/assets/projects/todo-kanban.jpg',
          liveUrl: 'https://kanban-todo-board.netlify.app',
          technologies: ['React', 'React DnD', 'Tailwind CSS', 'Firebase']
        }
      ]
    },
    {
      id: 4,
      title: 'Portfolio Templates',
      description: 'Personal portfolio websites with different design approaches and feature sets.',
      image: '/assets/projects/portfolio.png',
      technologies: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
      featured: true,
      hasVariations: true,
      variations: [
        {
          name: 'Modern Portfolio',
          description: 'Contemporary portfolio design with smooth animations, dynamic theming, and interactive components.',
          image: '/assets/projects/portfolio-modern.jpg',
          liveUrl: 'https://marquezportfolio.netlify.app',
          repoUrl: 'https://github.com/dinocavity/final-portfolio.git',
          technologies: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion']
        },
        {
          name: 'Minimalist Portfolio',
          description: 'Clean, minimal design focusing on typography and content with subtle animations and white space.',
          image: '/assets/projects/portfolio-minimalist.jpg',
          liveUrl: 'https://minimalist-portfolio-template.netlify.app',
          technologies: ['React', 'Styled Components', 'AOS Animation']
        },
        {
          name: 'Developer Portfolio',
          description: 'Technical portfolio with integrated blog, code snippets, GitHub integration, and developer-focused features.',
          image: '/assets/projects/portfolio-developer.jpg',
          repoUrl: 'https://github.com/dinocavity/developer-portfolio.git',
          technologies: ['Next.js', 'MDX', 'GitHub API', 'Prisma', 'PostgreSQL']
        }
      ]
    },
    {
      id: 5,
      title: 'Ardeur de France',
      description: 'An elegant e-commerce platform specializing in French luxury goods. Features include product catalog, shopping cart, secure checkout, and admin dashboard.',
      image: '/assets/projects/ardeur-de-france.jpg',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
      featured: true,
      liveUrl: 'https://example.com/ardeur-de-france',
      repoUrl: 'https://github.com/dinocavity/Ardeur-de-france.git'
    }
  ];
  
  export default projects;
