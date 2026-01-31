import logo from "./logo.svg";
import logo_full from "./logo_full.svg";
import logo_full_dark from "./logo_full_dark.svg";
import search_icon from "./search_icon.svg";
import user_icon from "./user_icon.svg";
import send_icon from "./send_icon.svg";
import stop_icon from "./stop_icon.svg";
import mountain_img from "./mountain_img.jpg";
import menu_icon from "./menu_icon.svg";
import close_icon from "./close_icon.svg";
import bin_icon from "./bin_icon.svg";
import logout_icon from "./logout_icon.svg";
import diamond_icon from "./diamond_icon.svg";
import gallery_icon from "./gallery_icon.svg";
import ai_image1 from "./ai_image1.jpg";
import ai_image2 from "./ai_image2.jpg";
import ai_image3 from "./ai_image3.jpg";
import ai_image4 from "./ai_image4.jpg";
import ai_image5 from "./ai_image5.jpg";
import ai_image6 from "./ai_image6.jpg";
import ai_image7 from "./ai_image7.jpg";
import ai_image8 from "./ai_image8.jpg";
import ai_image9 from "./ai_image9.jpg";
import ai_image10 from "./ai_image10.jpg";
import ai_image11 from "./ai_image11.jpg";
import ai_image12 from "./ai_image12.jpg";
import light_mode from "./light-mode.png";
import dark_mode from "./sleep-mode.png";
import font_icon from "./font.png";
import image_icon from './image-gallery.png'
import rename_icon from './rename.png';
import archive_icon from './archive.png';
import options_icon from './more.png';
import check_icon from './check.png';
import loading_icon from './loading.png'
import unarchive_icon from './inbox.png';
import delete_icon from './delete.png';
import save_icon from './save.png';
import unarchive_chat_icon from './unarchive.png'
import archive_all_icon from './archive-all.png'
import planet_icon from './planet.png'
import share_icon from './share.png'
import shared_chats_icon from './shared-chats.png'
import archived_chats_icon from './archive-chats.png'
import unshare_chats_icon from './unshare-chats.png'
import copy_icon from './copy.png'
import model_preference_icon from './model-preference.png'
import gemini from './gemini.png';
import groq from './groq.png'
import auto from './auto.png'
import chanakya from './chanakya.jpg'
import gautama_buddha from './gautama-buddha.jpg'
import mahatma_gandhi from './mahatma-gandhi.jpg'
import rabindranath_tagore from './rabindranath-tagore.jpg'
import swami_vivekananda from './swami-vivekananda.jpg'
import avatars_icon from './avatars.png'
import sort_icon from './sort.png'
import new_chat_icon from './new-chat.png'
import chat_icon from './chat.png'
import new_tab_icon from './new-tab.png'
import down_arrow_icon from './down-arrow.png'
import pin_icon from './pin.png'
import settings_icon from './settings.png'
import info_icon from './info.png'
import reset_icon from './reset.png'

export const assets = {
    logo, logo_full, search_icon, user_icon, send_icon, stop_icon, mountain_img, menu_icon,
    close_icon, bin_icon, logout_icon, logo_full_dark, diamond_icon, gallery_icon, light_mode,
    dark_mode, font_icon, image_icon, rename_icon, options_icon, archive_icon, check_icon,
    loading_icon, unarchive_icon, delete_icon, save_icon, unarchive_chat_icon, archive_all_icon,
    planet_icon, share_icon, shared_chats_icon, archived_chats_icon, unshare_chats_icon, copy_icon,
    model_preference_icon, gemini, auto, groq, sort_icon, new_chat_icon, chat_icon, new_tab_icon,
    avatars_icon, chanakya, gautama_buddha, mahatma_gandhi, swami_vivekananda, rabindranath_tagore,
    down_arrow_icon, pin_icon, settings_icon, info_icon, reset_icon,
};

export const dummyUserData = {
    "_id": "689c6deed410acddc0d95a0e",
    "name": "GreatStack",
    "email": "admin@example.com",
    "password": "$2b$10$VESVdPDjL5LF.KCU6jKyqeXNSLASAAfpR2kkIJExtMO.PJvZJAudy",
    "credits": 200,
}

export const AVAILABLE_MODELS = [
    {
        id: "groq",
        name: "Groq",
        icon: groq,
        tagline: "Ultra-fast responses",
        description:
            "Optimized for extremely fast replies and low-latency conversations.",
        features: [
            "Very fast inference speed",
            "Great for real-time chat",
            "Ideal for coding & quick Q&A",
            "Smooth conversational flow",
        ],
        rateLimit: "Optimized for frequent short requests",
        bestFor: "Fast chats, coding help, rapid interactions",
        recommended: true,
    },
    {
        id: "gemini",
        name: "Gemini",
        icon: gemini,
        tagline: "Powerful reasoning & long context",
        description:
            "Excels at deep reasoning, long conversations, and structured responses.",
        features: [
            "Handles long prompts and conversations",
            "Strong reasoning and summarization",
            "Better context retention",
            "Detailed and thoughtful responses",
        ],
        rateLimit: "Designed for thoughtful, longer requests",
        bestFor: "Analysis, summaries, complex problem solving",
        recommended: false,
    },
    {
        id: "auto",
        name: "Auto",
        icon: auto,
        tagline: "Smart model selection",
        description:
            "Automatically selects the best available model based on speed, quality, and rate limits.",
        features: [
            "Automatically switches between models",
            "Avoids rate-limit failures",
            "Balanced speed and response quality",
            "Most reliable option",
        ],
        rateLimit: "Best overall availability",
        bestFor: "Recommended for most users and general use",
        recommended: false,
    }
];

export const AVATAR_IMAGES = {
    "gautama-buddha": gautama_buddha,
    "gandhi": mahatma_gandhi,
    "chanakya": chanakya,
    "swami-vivekananda": swami_vivekananda,
    "rabindranath-tagore": rabindranath_tagore,
}

// copy for server controllers
export const dummyPlans = [
    {
        id: 'Free',
        name: 'Free',
        price: 0,
        credits: 5,
        desc: 'Perfect for getting started!',
        features: [
            '5 free credits monthly',
            'Basic text generation',
            'Standard response speed',
            'Community support',
            'Access to GPT-3.5 model'
        ],
        popular: false,
        cta: "Get Started",
    },
    {
        id: 'Starter',
        name: 'Starter',
        price: 8,
        credits: 100,
        desc: 'Great for casual users!',
        features: [
            '100 credits monthly',
            'Text & image generation',
            'Faster response times',
            'Email support',
            'Access to GPT-4 model',
            'Basic customization options'
        ],
        popular: false,
        cta: "Purchase",
    },
    {
        id: 'Pro',
        name: 'Pro',
        price: 19,
        credits: 500,
        desc: 'Perfect for power users!',
        features: [
            '500 credits monthly',
            'Advanced text & image generation',
            'Priority response times',
            'Priority email & chat support',
            'Access to GPT-4 Turbo',
            'Advanced customization',
            'API access',
            'Custom instructions'
        ],
        popular: true,
        cta: "Purchase",
    },
    {
        id: 'Team',
        name: 'Team',
        price: 49,
        credits: 1500,
        desc: 'Collaborate with your team!',
        features: [
            '1,500 credits monthly',
            'All Pro features',
            'Team workspace',
            'Shared conversations',
            'Admin controls',
            'Dedicated support channel',
            'Custom model fine-tuning',
            'Bulk operations'
        ],
        popular: false,
        cta: "Purchase",
    },
    {
        id: 'Enterprise',
        name: 'Enterprise',
        price: 99,
        credits: 5000,
        desc: 'For large-scale applications!',
        features: [
            '5,000 credits monthly',
            'All Team features',
            'Custom SLA guarantees',
            'Dedicated account manager',
            'On-premise deployment option',
            'Advanced security & compliance',
            'Custom model training',
            '24/7 phone support',
            'Usage analytics dashboard'
        ],
        popular: false,
        cta: "Purchase",
    }
];


export const dummyChats = [
    {
        "_id": "689de4bbaa932dc3a8ef6cd7",
        "userId": "689c6deed410acddc0d95a0e",
        "userName": "GreatStack",
        "name": "New Chat",
        "messages": [
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "a boy running on water",
                "timestamp": 1755178179612,
            },
            {
                "isImage": true,
                "isPublished": true,
                "role": "assistant",
                "content": ai_image11,
                "timestamp": 1755178194747,
            }
        ],
        "createdAt": "2025-08-14T13:29:31.398Z",
        "updatedAt": "2025-08-14T13:29:54.753Z",
    },
    {
        "_id": "689ccb9016a922dd57a23fce",
        "userId": "689c6deed410acddc0d95a0e",
        "name": "New Chat",
        "messages": [
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "hello ",
                "timestamp": 1755106415912,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "assistant",
                "content": "Hello! 😊 How can I assist you today?",
                "timestamp": 1755106420723,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "Generate a image of boy talking with others",
                "timestamp": 1755107475040,
            },
            {
                "isImage": true,
                "isPublished": true,
                "role": "assistant",
                "content": ai_image1,
                "timestamp": 1755107486680,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "i have to create a realistic image of jungle with wild animals so create a prompt for it",
                "timestamp": 1755158982894,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "assistant",
                "content": "Here's a detailed and structured prompt to generate a highly realistic jungle scene with wild animals:  \n\n---  \n\n**Prompt:**  \n*\"Ultra-realistic, hyper-detailed photorealistic jungle landscape teeming with wildlife. The setting is a dense, vibrant rainforest bathed in dappled sunlight filtering through the thick canopy. Towering ancient trees with intricate root systems, lush green ferns, vines, and exotic flowers create a rich, immersive environment. A clear, sparkling stream winds through the scene, reflecting the lush surroundings.  \n\nWildlife in their natural habitat:  \n- A majestic Bengal tiger crouches on a moss-covered rock near the water, muscles tensed as it watches for prey.  \n- A family of elephants moves gently through the undergrowth, led by a large matriarch with a protective stance.  \n- Colorful macaws and parrots perch on high branches, their bright feathers contrasting with the greenery.  \n- A stealthy jaguar lurks in the shadows, its golden eyes piercing.  \n- A troupe of playful monkeys swings from vines, their expressions lively and dynamic.  \n- A slow-moving sloth clings to a tree branch, blending into the foliage.  \n\nAtmospheric elements:  \n- Soft mist lingers near the forest floor, adding depth.  \n- Dragonflies and butterflies hover near the water's edge.  \n- Distant bird calls and rustling leaves create an immersive ambiance.  \n\nCinematic composition with balanced lighting—sunbeams piercing through the canopy in a god-ray effect. Depth of field focuses sharply on the tiger while softly blurring the background for realism. Shot with a high-resolution DSLR style for maximum detail, 8K quality. Ultra HD, National Geographic-style wildlife photography.\"*  \n\n---  \n\n### **Tips for Adjusting the Prompt:**  \n- **For a more serene scene:** Remove predators (like the jaguar) and focus on grazing animals like deer or tapirs.  \n- **For a darker, mysterious tone:** Add rain, stormy lighting, or a twilight setting.  \n- **For more biodiversity:** Include reptiles (snakes, frogs) or insects (beetles, spiders).  \n\nWould you like any modifications for a specific mood or artistic style (e.g., painterly, cinematic, or fantasy-inspired)?",
                "timestamp": 1755158995829,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "Ultra-realistic, hyper-detailed photorealistic jungle landscape teeming with wildlife. The setting is a dense, vibrant rainforest bathed in dappled sunlight filtering through the thick canopy. Towering ancient trees with intricate root systems, lush green ferns, vines, and exotic flowers create a rich, immersive environment. A clear, sparkling stream winds through the scene, reflecting the lush surroundings.  Wildlife in their natural habitat:  A majestic Bengal tiger crouches on a moss-covered rock near the water, muscles tensed as it watches for prey. A family of elephants moves gently through the undergrowth, led by a large matriarch with a protective stance. Colorful macaws and parrots perch on high branches, their bright feathers contrasting with the greenery. A stealthy jaguar lurks in the shadows, its golden eyes piercing. A troupe of playful monkeys swings from vines, their expressions lively and dynamic. A slow-moving sloth clings to a tree branch, blending into the foliage. Atmospheric elements:  Soft mist lingers near the forest floor, adding depth. Dragonflies and butterflies hover near the water's edge. Distant bird calls and rustling leaves create an immersive ambiance. Cinematic composition with balanced lighting—sunbeams piercing through the canopy in a god-ray effect. Depth of field focuses sharply on the tiger while softly blurring the background for realism. Shot with a high-resolution DSLR style for maximum detail, 8K quality. Ultra HD, National Geographic-style wildlife photography.",
                "timestamp": 1755159013677,
            },
            {
                "isImage": true,
                "isPublished": true,
                "role": "assistant",
                "content": ai_image2,
                "timestamp": 1755159034238,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "top web technologies to learn in 2025",
                "timestamp": 1755159074583,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "assistant",
                "content": "Here are the top web technologies to learn in 2025 to stay competitive in the industry:\n\n### **Frontend Development**  \n1. **React.js** – Still the dominant frontend library with increasing adoption of **React Server Components (RSC)** and **Next.js**.  \n2. **Next.js (v14+)** – Meta-framework for React enabling **server-side rendering (SSR)**, static site generation (SSG), and edge computing.  \n3. **Vue.js (v3.x + Vite)** – Growing ecosystem with better DX and performance.  \n4. **Svelte & SvelteKit** – Rising in popularity due to its compile-time reactivity and lightweight output.  \n5. **WebAssembly (WASM)** – Enables near-native performance for web apps (used in Figma, Photoshop, etc.).  \n\n### **Backend Development**  \n6. **Node.js (v20+)** – Still leading in JavaScript-based backend development.  \n7. **Deno & Bun** – Faster alternatives to Node.js with modern APIs (Bun is gaining traction for speed).  \n8. **Python (FastAPI, Django, Flask)** – Python remains strong for backend and AI-powered apps.  \n9. **Rust (Actix, Axum, Rocket)** – High-performance backend development with safety guarantees.  \n10. **Go (Golang)** – Valued for scalable backend systems (used by Uber, Twitch, Docker).  \n\n### **Full-Stack & Cloud-Native**  \n11. **GraphQL (Apollo, Relay)** – Alternative to REST for efficient API queries.  \n12. **Serverless (AWS Lambda, Vercel, Cloudflare Workers)** – Shift toward edge computing and serverless architectures.  \n13. **Web3 & Blockchain (Ethereum, Solana, Web3.js, Ethers.js)** – Emerging in decentralized apps (dApps).  \n14. **Microservices & Kubernetes** – Essential for scalable cloud-native apps.  \n\n### **CSS & Styling**  \n15. **Tailwind CSS** – Utility-first CSS framework dominating modern UI development.  \n16. **CSS Modules & CSS-in-JS (Emotion, Styled Components)** – Scoped styling for component-based apps.  \n17. **PostCSS & Modern CSS (Flexbox, Grid, Container Queries)** – Advanced styling techniques.  \n\n### **Database & State Management**  \n18. **PostgreSQL, MongoDB, & Edge Databases (PlanetScale, Neon, Supabase)** – SQL + NoSQL trends.  \n19. **Prisma, DrizzleORM** – Modern ORMs for TypeScript/Node.js.  \n20. **GraphQL Client State (RTK Query, Apollo Client, URQL)** – Managing data efficiently.  \n\n### **Emerging & Future-Proof Tech**  \n21. **AI & LLM Integration (OpenAI, LangChain)** – AI-powered web apps (ChatGPT plugins, copilots).  \n22. **Progressive Web Apps (PWAs + Web APIs)** – Offline-first, installable web apps.  \n23. **WebRTC & Real-Time (Socket.io, Liveblocks, PartyKit)** – Real-time collaboration features.  \n24. **3D & WebGL (Three.js, Babylon.js, React Three Fiber)** – Interactive 3D web experiences.  \n25. **Motion UI & Animation (GSAP, Framer Motion)** – Advanced web animations.  \n\n### **Must-Have Tools & DevOps**  \n- **Git, CI/CD (GitHub Actions, Vercel, Netlify)**  \n- **Docker & Kubernetes** (for containerization)  \n- **Testing (Vitest, Playwright, Cypress, Jest)**  \n\n### **Why Learn These in 2025?**  \n- **Speed & Efficiency**: Tools like **Bun, Rust, and WASM** optimize performance.  \n- **AI Integration**: AI is being embedded into web dev at a rapid pace.  \n- **Edge Computing & Serverless**: Cloud providers are pushing serverless/edge deployments.  \n- **Full-Stack Dominance**: Frameworks like **Next.js, SvelteKit, and Remix** blur frontend/backend lines.  \n\nFocus on **React + Next.js, Rust/Go for backend, TypeScript, and AI integrations** for maximum opportunities in 2025. 🚀  \n\nWould you like a tailored roadmap based on your goals?",
                "timestamp": 1755159100513,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "write a code for basic express app ",
                "timestamp": 1755159129597,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "assistant",
                "content": "# Basic Express.js Application\n\nHere's a simple Express.js application setup with some basic routes:\n\n```javascript\n// Import required modules\nconst express = require('express');\nconst path = require('path');\n\n// Create an Express application\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\n// Middleware\napp.use(express.json()); // For parsing application/json\napp.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded\n\n// Serve static files from the 'public' directory\napp.use(express.static(path.join(__dirname, 'public')));\n\n// Basic routes\napp.get('/', (req, res) => {\n  res.send('Welcome to the Express App!');\n});\n\napp.get('/about', (req, res) => {\n  res.send('About Page');\n});\n\n// Example route with parameters\napp.get('/user/:id', (req, res) => {\n  res.send(`User ID: ${req.params.id}`);\n});\n\n// Example POST route\napp.post('/api/data', (req, res) => {\n  console.log(req.body);\n  res.json({ message: 'Data received', data: req.body });\n});\n\n// 404 Error handler\napp.use((req, res) => {\n  res.status(404).send('404 - Not Found');\n});\n\n// Error handling middleware\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).send('Something went wrong!');\n});\n\n// Start the server\napp.listen(PORT, () => {\n  console.log(`Server is running on http://localhost:${PORT}`);\n});\n```\n\n## Setup Instructions\n\n1. Make sure you have Node.js installed\n2. Create a new directory for your project\n3. Initialize a new Node.js project:\n   ```bash\n   npm init -y\n   ```\n4. Install Express:\n   ```bash\n   npm install express\n   ```\n5. Save the code above in a file named `app.js`\n6. Create a `public` directory if you want to serve static files\n7. Start the server:\n   ```bash\n   node app.js\n   ```\n\n## Features\n- Basic routes ('/', '/about', '/user/:id')\n- POST route for handling form data\n- Static file serving\n- Error handling\n- JSON body parsing\n\nYou can expand this basic setup by adding more routes, connecting to a database, or adding middleware as needed.",
                "timestamp": 1755159145294,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "generate a image of gaming pc setup in a room in realistic style",
                "timestamp": 1755159264109,
            },
            {
                "isImage": true,
                "isPublished": true,
                "role": "assistant",
                "content": ai_image3,
                "timestamp": 1755159273878,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "what are web3",
                "timestamp": 1755159666525,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "assistant",
                "content": "**Web3** (or **Web 3.0**) refers to the next evolution of the internet, centered on **decentralization, blockchain technology, and user ownership of data**. It aims to shift control from large tech companies to users by leveraging cryptographic protocols and peer-to-peer networks.\n\n### **Key Features of Web3:**\n1. **Decentralization**  \n   - No single entity controls the internet; instead, it operates on distributed networks (like blockchains or peer-to-peer systems).\n   - Contrasts with Web2 (the current internet), dominated by centralized platforms like Google, Facebook, and Amazon.\n\n2. **Blockchain & Cryptocurrency**  \n   - Uses blockchain (e.g., Ethereum, Solana) for trustless transactions and smart contracts.\n   - Cryptocurrencies (e.g., Bitcoin, ETH) enable value transfer without intermediaries.\n\n3. **User Ownership & Digital Identity**  \n   - Users own their data (via **decentralized identity** solutions) and monetize it directly.\n   - NFTs (Non-Fungible Tokens) allow ownership of digital assets (art, music, virtual land).\n\n4. **Interoperability & Openness**  \n   - Applications (dApps) can interact seamlessly across different blockchains.\n   - Open-source protocols reduce reliance on proprietary platforms.\n\n5. **Tokenized Incentives**  \n   - Users and developers are rewarded with tokens (e.g., governance tokens, staking rewards).\n\n### **Examples of Web3 Technologies:**\n- **DeFi (Decentralized Finance)** – Peer-to-peer financial services (e.g., Uniswap, Aave).  \n- **NFTs & Digital Ownership** – CryptoPunks, OpenSea, and blockchain gaming.  \n- **DAOs (Decentralized Autonomous Organizations)** – Community-governed entities (e.g., MakerDAO).  \n- **Decentralized Storage** – IPFS, Filecoin (vs. centralized cloud storage like AWS).  \n\n### **Web3 vs. Web2 vs. Web1**\n- **Web1 (1990s-2000s):** Read-only static websites (e.g., early HTML pages).  \n- **Web2 (2000s-present):** Interactive, social media, cloud computing (Facebook, YouTube).  \n- **Web3 (emerging):** Decentralized, user-owned, token-based economies.  \n\n### **Challenges of Web3**\n- **Scalability:** Blockchains struggle with speed and cost (e.g., Ethereum gas fees).  \n- **Regulation:** Governments are still figuring out crypto laws.  \n- **User Experience:** Complex for non-technical users.  \n\nWould you like a deeper dive into any specific aspect? 🚀",
                "timestamp": 1755159683847,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "Generate a image nature with trees  in realistic style",
                "timestamp": 1755160243315,
            },
            {
                "isImage": true,
                "isPublished": true,
                "role": "assistant",
                "content": ai_image4,
                "timestamp": 1755160254161,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "a gaming pc setup ",
                "timestamp": 1755163772103,
            },
            {
                "isImage": true,
                "isPublished": true,
                "role": "assistant",
                "content": ai_image6,
                "timestamp": 1755163783470,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "a streaming setup with mic and accessory's ",
                "timestamp": 1755163990514,
            },
            {
                "isImage": true,
                "isPublished": true,
                "role": "assistant",
                "content": ai_image7,
                "timestamp": 1755164001928,
            }

        ],
        "createdAt": "2025-08-13T17:29:52.421Z",
        "updatedAt": "2025-08-14T09:39:19.046Z",
        "userName": "GreatStack"
    },
    {
        "_id": Date.now(),
        "userId": "gs123456789",
        "name": "New Chat",
        "userName": "GreatStack",
        "messages": [],
        "createdAt": "2025-08-13T17:29:52.421Z",
        "updatedAt": "2025-08-14T09:39:19.046Z",
    }
]

export const dummyPublishedImages = [
    {
        "imageUrl": ai_image11,
        "userName": "GreatStack"
    },
    {
        "imageUrl": ai_image10,
        "userName": "GreatStack"
    },
    {
        "imageUrl": ai_image9,
        "userName": "GreatStack"
    },
    {
        "imageUrl": ai_image8,
        "userName": "GreatStack"
    },
    {
        "imageUrl": ai_image7,
        "userName": "GreatStack"
    },
    {
        "imageUrl": ai_image6,
        "userName": "GreatStack"
    },
    {
        "imageUrl": ai_image5,
        "userName": "GreatStack"
    },
    {
        "imageUrl": ai_image4,
        "userName": "GreatStack"
    },
    {
        "imageUrl": ai_image3,
        "userName": "GreatStack"
    },
    {
        "imageUrl": ai_image2,
        "userName": "GreatStack"
    },
    {
        "imageUrl": ai_image1,
        "userName": "GreatStack"
    }
]

export const testimonials = [
    {
        id: 1,
        name: "Sarah Chen",
        role: "Content Creator",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        content: "Quick GPT has revolutionized how I create content. It's like having a creative partner available 24/7!",
        rating: 5
    },
    {
        id: 2,
        name: "Marcus Johnson",
        role: "Software Developer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        content: "The code generation and debugging features have saved me hours of work every day. Incredible tool!",
        rating: 5
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Marketing Manager",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        content: "From email campaigns to social media posts, Quick GPT helps our team produce high-quality content faster.",
        rating: 4
    }
];