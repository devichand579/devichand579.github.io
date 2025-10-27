// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-about",
          title: "about",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/";
          },
        },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "GitHub repositories and projects",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-news",
          title: "news",
          description: "Latest news and announcements",
          section: "Navigation",
          handler: () => {
            window.location.href = "/news/";
          },
        },{id: "nav-services",
          title: "services",
          description: "Services and consulting",
          section: "Navigation",
          handler: () => {
            window.location.href = "/services/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
      
        title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
      section: "Posts",
      handler: () => {
        
          window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
        
      },
    },{id: "post-displaying-external-posts-on-your-al-folio-blog",
      
        title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
        
      },
    },{id: "news-started-my-undergraduate-journey-at-iit-kharagpur-at-computer-science-and-engineering-department-in-2021",
          title: 'Started my undergraduate journey at IIT Kharagpur at Computer Science and Engineering department...',
          description: "",
          section: "News",},{id: "news-started-my-research-internship-at-saint-petersburg-electro-technical-university-russia-under-the-supervision-of-dr-dimitrii-kaplun",
          title: 'Started my research internship at Saint Petersburg Electro-technical University, Russia under the supervision...',
          description: "",
          section: "News",},{id: "news-started-my-research-internship-at-iit-palakkad-under-the-supervision-of-dr-sabarimalai-manikandan",
          title: 'Started my research internship at IIT palakkad under the supervision of Dr.Sabarimalai manikandan....',
          description: "",
          section: "News",},{id: "news-started-my-research-internship-at-queen-mary-university-of-london-under-the-supervision-of-dr-ahmed-m-a-sayed",
          title: 'Started my research internship at Queen Mary University of London under the supervision...',
          description: "",
          section: "News",},{id: "news-started-my-position-as-research-fellow-at-artificial-intelligence-institute-of-south-carolina-under-the-supervision-of-dr-amit-sheth",
          title: 'Started my position as research fellow at Artificial Intelligence Institute of South Carolina...',
          description: "",
          section: "News",},{id: "news-paper-accepted-to-aaai-2025-cogsci-ai-neurosymbolic-bridge",
          title: 'Paper accepted to AAAI 2025 CogSci-AI Neurosymbolic Bridge',
          description: "",
          section: "News",},{id: "news-started-as-undergraduate-researcher-at-iit-kharagpur-under-the-supervision-of-dr-pawan-goyal",
          title: 'Started as undergraduate researcher at IIT Kharagpur under the supervision of Dr.Pawan Goyal....',
          description: "",
          section: "News",},{id: "news-started-my-machine-learning-engineering-internship-at-kla-corporation",
          title: 'Started my machine learning engineering internship at KLA Corporation.',
          description: "",
          section: "News",},{id: "news-paper-accepted-to-kdd-2025-workshop-on-prompt-optimization",
          title: 'Paper accepted to KDD 2025 Workshop on Prompt Optimization.',
          description: "",
          section: "News",},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%62%75%64%61%67%61%6D@%64%65%76%69%63%68%61%6E%64.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/devichand579", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/devichand", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=AOcTwe4AAAAJ&hl", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/devichand579", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
