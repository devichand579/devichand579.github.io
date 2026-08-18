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
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-news",
          title: "news",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/news/";
          },
        },{id: "nav-services",
          title: "services",
          description: "",
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
        },{id: "nav-world",
          title: "world",
          description: "A small physical world. Infer the hidden law, then predict the next state.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/world/";
          },
        },{id: "news-started-my-undergraduate-journey-at-iit-kharagpur-at-computer-science-and-engineering-department-in-2021",
          title: 'Started my undergraduate journey at IIT Kharagpur at Computer Science and Engineering Department...',
          description: "",
          section: "News",},{id: "news-awarded-silver-honour-in-the-international-astronomy-and-astrophysics-competition-among-participants-from-more-than-70-countries",
          title: 'Awarded Silver Honour in the International Astronomy and Astrophysics Competition among participants from...',
          description: "",
          section: "News",},{id: "news-started-my-research-internship-at-saint-petersburg-electro-technical-university-russia-under-the-supervision-of-dr-dimitrii-kaplun",
          title: 'Started my research internship at Saint Petersburg Electro-technical University, Russia under the supervision...',
          description: "",
          section: "News",},{id: "news-started-my-research-internship-at-iit-palakkad-under-the-supervision-of-dr-sabarimalai-manikandan",
          title: 'Started my research internship at IIT palakkad under the supervision of Dr.Sabarimalai Manikandan....',
          description: "",
          section: "News",},{id: "news-started-my-research-internship-at-queen-mary-university-of-london-under-the-supervision-of-dr-ahmed-m-a-sayed",
          title: 'Started my research internship at Queen Mary University of London under the supervision...',
          description: "",
          section: "News",},{id: "news-started-my-position-as-research-fellow-at-artificial-intelligence-institute-of-south-carolina-under-the-supervision-of-dr-amit-sheth",
          title: 'Started my position as research fellow at Artificial Intelligence Institute of South Carolina...',
          description: "",
          section: "News",},{id: "news-awarded-the-indiaai-fellowship-by-the-government-of-india-among-fewer-than-200-undergraduate-students-for-research-contributions-to-ai",
          title: 'Awarded the IndiaAI Fellowship by the Government of India among fewer than 200...',
          description: "",
          section: "News",},{id: "news-paper-accepted-to-aaai-2025-cogsci-ai-neurosymbolic-bridge",
          title: 'Paper accepted to AAAI 2025 CogSci-AI Neurosymbolic Bridge',
          description: "",
          section: "News",},{id: "news-started-as-undergraduate-researcher-at-iit-kharagpur-under-the-supervision-of-prof-pawan-goyal-and-dr-manish-gupta",
          title: 'Started as undergraduate researcher at IIT Kharagpur under the supervision of prof. Pawan...',
          description: "",
          section: "News",},{id: "news-started-my-machine-learning-engineering-internship-at-kla-corporation",
          title: 'Started my machine learning engineering internship at KLA Corporation.',
          description: "",
          section: "News",},{id: "news-co-founded-meridian-a-proactive-intelligence-os-for-finance-and-accounting-teams",
          title: 'Co-founded Meridian, a proactive intelligence OS for finance and accounting teams.',
          description: "",
          section: "News",},{id: "news-paper-accepted-to-kdd-2025-workshop-on-prompt-optimization",
          title: 'Paper accepted to KDD 2025 Workshop on Prompt Optimization.',
          description: "",
          section: "News",},{id: "news-paper-accepted-as-an-oral-at-eacl-2026-industry-track",
          title: 'Paper accepted as an oral at EACL 2026 Industry Track.',
          description: "",
          section: "News",},{id: "news-received-the-amd-gpu-open-research-grant-for-my-master-s-thesis-with-dr-pawan-goyal",
          title: 'Received the AMD GPU Open Research Grant for my master’s thesis with Dr....',
          description: "",
          section: "News",},{id: "news-selected-among-the-top-1-of-startups-for-the-off-season-ii-accelerator-at-founders-inc",
          title: 'Selected among the top 1% of startups for the Off Season II accelerator...',
          description: "",
          section: "News",},{id: "news-started-as-artificial-intelligence-engineer-2-at-kla-corporation",
          title: 'Started as Artificial Intelligence Engineer 2 at KLA Corporation.',
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
        id: 'social-huggingface',
        title: 'Hugging Face',
        section: 'Socials',
        handler: () => {
          window.open("https://huggingface.co/devichand", "_blank");
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
