import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Blog from '../models/Blog.js';
import Enrollment from '../models/Enrollment.js';
import Certificate from '../models/Certificate.js';
import dns from 'dns'
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnplus');
    console.log(`✅  MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// ─── UNIQUE CATEGORY THUMBNAILS ───────────────────────────────────────────────
const CATEGORY_THUMBNAILS = {
  'Web Development': [
    'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop',
  ],
  'App Development': [
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551836022-4196f3f2e739?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568952433726-3896e3881c65?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585389619571-5b6a3f14fba8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595246140520-1991cca96c8c?w=800&auto=format&fit=crop',
  ],
  'Programming Languages': [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503468756753-b0ae8c5e23ca?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=800&auto=format&fit=crop',
  ],
  'Data Structures & Algorithms': [
    'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
  ],
  'Machine Learning': [
    'https://images.unsplash.com/photo-1527430253228-e93688616381?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1623282033815-40b05d96c903?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&auto=format&fit=crop',
  ],
  'Artificial Intelligence': [
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&auto=format&fit=crop',
  ],
  'Data Science': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop',
  ],
  'Cybersecurity': [
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555664954-aa17258d8545?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504438190342-5951e134ffee?w=800&auto=format&fit=crop',
  ],
  'Cloud Computing': [
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606765962248-7ff407b51667?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580983218765-f663bec07b37?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop',
  ],
  'DevOps': [
    'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617042375876-a13e36732a04?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547396729-0bba37eb4f83?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547586696-ea80fcd9b838?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?w=800&auto=format&fit=crop',
  ],
  'UI/UX Design': [
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576153192396-180ecef2a715?w=800&auto=format&fit=crop',
  ],
  'Database Management': [
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1629654291663-b91ad427698f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494961104209-3c223057bd26?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
  ],
  'Aptitude & Interview Preparation': [
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580983218765-f663bec07b37?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573496799515-eebbb63814f2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551836022-8b2858c9c69b?w=800&auto=format&fit=crop',
  ],
  'Blockchain & Web3': [
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584949091598-c31daadb4a90?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=800&auto=format&fit=crop',
  ],
};

// ─── THEORY CONTENT POOLS ────────────────────────────────────────────────────
// [category][weekIndex][lessonOrder(0,1,2)] → 6-7 bullet points
const THEORY_POOLS = {
  'Web Development': [
    [ // Week 1
      ['HTML (HyperText Markup Language) is the skeleton of web pages, providing semantic structure and meaning', 'Block-level elements like <div>, <p>, <h1>–<h6> take the full container width; inline elements like <span>, <a>, <img> flow within text', 'HTML5 semantic tags — <header>, <nav>, <main>, <article>, <section>, <footer> — improve both SEO rankings and screen-reader accessibility', 'Attributes provide extra information: id, class, href, src, alt, placeholder, type, required', 'The browser parses HTML top-to-bottom into a DOM (Document Object Model) tree that JavaScript can traverse and modify', 'Forms use <form>, <input>, <label>, <select>, <textarea>, and <button> to collect and submit user data'],
      ['CSS (Cascading Style Sheets) controls the visual presentation of HTML elements through rules and declarations', 'A CSS rule consists of a selector, property, and value: h1 { color: #1e293b; font-size: 2rem; }', 'Specificity determines which styles win: inline > ID (#id) > class (.class) > element (p, h1)', 'The box model wraps every element: content → padding → border → margin — order is crucial for layout math', 'CSS custom properties (variables) defined with --primary: #6366f1 make themes manageable and reusable', 'Media queries enable responsive design: @media (max-width: 768px) { ... } targets specific viewport widths'],
      ['Flexbox is a 1D layout system: apply display:flex to a container and use justify-content + align-items to arrange children', 'CSS Grid provides 2D layouts with rows and columns: grid-template-columns: repeat(3, 1fr) creates three equal columns', 'Pseudo-classes like :hover, :focus, :nth-child(n), :not() apply styles based on element state or position', 'CSS transitions animate property changes smoothly: transition: all 0.3s ease enables hover animations without JavaScript', 'CSS animations use @keyframes to define from/to or percentage-based states for complex motion', 'Absolute positioning removes elements from document flow; relative positioning keeps them in flow while allowing offset'],
    ],
    [ // Week 2
      ['JavaScript is a dynamically-typed, single-threaded language that runs in the browser and on Node.js via the V8 engine', 'Variables declared with const cannot be reassigned; let allows reassignment; avoid var due to hoisting issues', 'Functions are first-class citizens — they can be stored in variables, passed as arguments, and returned from other functions', 'Arrow functions (const fn = () => {}) have no own this binding, making them ideal for callbacks and array methods', 'Template literals (backtick strings) support multiline text and embedded expressions: `Hello, ${name}!`', 'Destructuring extracts values from objects and arrays: const { name, age } = user; const [first, ...rest] = array'],
      ['The DOM API lets JavaScript read and modify HTML: document.querySelector(".btn"), element.addEventListener("click", handler)', 'Events bubble from the target element up through parent nodes — use event.stopPropagation() to prevent this', 'Async JavaScript uses Promises and async/await to handle operations that take time without blocking the main thread', 'fetch() returns a Promise; chain .then().catch() or use await inside an async function to handle responses', 'Local Storage persists key-value strings across sessions: localStorage.setItem("theme", "dark"); localStorage.getItem("theme")', 'Array higher-order methods — .map(), .filter(), .reduce(), .find() — transform data without mutating the original array'],
      ['Node.js runs JavaScript on the server using the V8 engine, enabling full-stack development with one language', 'npm (Node Package Manager) manages project dependencies listed in package.json; run npm install to pull all packages', 'Express.js is a minimal web framework: app.get("/api/data", (req, res) => res.json({ data })) defines a route handler', 'Middleware functions process requests before they reach route handlers: app.use(cors()); app.use(express.json())', 'Environment variables stored in .env files keep secrets (DB passwords, API keys) out of source code — use dotenv to load them', 'REST APIs follow conventions: GET (read), POST (create), PUT (update), DELETE (remove) mapped to resource URLs'],
    ],
    [ // Week 3
      ['React is a component-based UI library; components are reusable functions that return JSX (JavaScript XML)', 'JSX compiles to React.createElement() calls — always wrap multiple elements in a parent or use empty fragment <>', 'useState hook stores local component state: const [count, setCount] = useState(0); calling setState triggers a re-render', 'Props are read-only inputs passed from parent to child; never mutate props directly inside a component', 'useEffect hook runs side effects (API calls, subscriptions) after render; provide a dependency array to control when it fires', 'Keys on list items (array.map(item => <li key={item.id}>)) help React identify which items changed for efficient re-rendering'],
      ['React Router enables client-side navigation without full page reloads using <BrowserRouter>, <Routes>, <Route>, <Link>', 'useParams() extracts dynamic URL segments: const { id } = useParams() from a route like /courses/:id', 'Context API shares state across deeply nested components without prop drilling: createContext, Provider, useContext', 'useReducer is preferable over useState for complex state logic: it accepts a reducer function and returns [state, dispatch]', 'Custom hooks (functions starting with "use") encapsulate and reuse stateful logic across multiple components', 'React.memo and useMemo/useCallback prevent unnecessary re-renders of expensive components or recalculation of heavy values'],
      ['Axios is an HTTP client that wraps fetch with cleaner syntax, automatic JSON parsing, and request/response interceptors', 'Interceptors add authorization headers globally: axios.interceptors.request.use(config => { config.headers.Authorization = `Bearer ${token}`; return config; })', 'Error boundaries catch rendering errors in component trees and display fallback UI instead of crashing the app', 'Lazy loading with React.lazy() and Suspense defers loading heavy components until they are needed, reducing initial bundle size', 'Vite provides lightning-fast HMR (Hot Module Replacement) and uses native ES modules in development for near-instant updates', 'Production builds with vite build create optimised, tree-shaken bundles with code splitting for fast load times'],
    ],
    [ // Week 4
      ['MongoDB is a NoSQL document database storing data as JSON-like BSON documents inside collections (not tables)', 'Mongoose adds schema validation, middleware hooks, and chainable query methods on top of the MongoDB Node.js driver', 'JWT (JSON Web Tokens) authenticate users: server signs a token with a secret; client sends it in the Authorization header', 'bcryptjs hashes passwords before storing them: await bcrypt.hash(password, 12) — never store plain-text passwords', 'CORS (Cross-Origin Resource Sharing) must be configured on the Express server to allow the React frontend to make requests', 'Deploy Node.js APIs to platforms like Railway, Render, or Heroku; host React builds on Vercel or Netlify for free'],
      ['HTTP status codes communicate outcomes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error', 'RESTful API design principles: stateless, uniform interface, resource-based URLs (/users, /courses/:id), standard methods', 'Pagination prevents sending thousands of records at once: use ?page=2&limit=20 query params to slice database results', 'Indexes in MongoDB (or SQL databases) dramatically speed up queries on frequently searched fields like email or category', 'Rate limiting (express-rate-limit) protects APIs from abuse by capping requests per IP per time window', 'WebSockets (via Socket.io) enable real-time bidirectional communication for features like live notifications and chat'],
      ['Testing ensures reliability: unit tests (Jest) test individual functions; integration tests check combined modules; E2E tests (Playwright) test user flows', 'CI/CD pipelines (GitHub Actions) automatically run tests and deploy on every commit push to main branch', 'Performance audits with Lighthouse score pages on Performance, Accessibility, Best Practices, and SEO', 'Image optimisation (WebP format, lazy loading, srcset) and code splitting significantly reduce page load times', 'Security checklist: validate all inputs, parameterise queries, set security headers with Helmet.js, use HTTPS everywhere', 'Semantic versioning (semver): MAJOR.MINOR.PATCH — increment MAJOR for breaking changes, MINOR for features, PATCH for bug fixes'],
    ],
  ],
  'App Development': [
    [
      ['Mobile apps are built natively (Swift/Kotlin), cross-platform (React Native/Flutter), or as Progressive Web Apps (PWAs)', 'React Native uses JavaScript and React concepts but renders to real native UI components — not a WebView', 'The Metro bundler compiles React Native JavaScript; Expo simplifies the setup by abstracting native build tools', 'Core components: View (div equivalent), Text (any text must be inside Text), Image, ScrollView, FlatList, Pressable', 'StyleSheet.create({}) in React Native uses a JavaScript object syntax similar to CSS but with camelCase properties (e.g., backgroundColor)', 'Flexbox is the only layout system in React Native — every View defaults to flex-direction: column'],
      ['Flutter uses Dart language and compiles to native ARM code, providing 60/120 fps animations on both iOS and Android', 'Dart is strongly typed, object-oriented, and similar to Java/C# but simpler — built-in null safety prevents null crashes', 'Everything in Flutter is a Widget: StatelessWidget for unchanging UI, StatefulWidget for interactive/dynamic content', 'The Widget tree is immutable; state changes trigger rebuild via setState() in StatefulWidget or providers in state management', 'Hot reload applies code changes instantly without losing app state — a major productivity boost over native development cycles', 'Material Design (Google) and Cupertino (Apple) widget sets give Flutter platform-appropriate UI out of the box'],
      ['Xcode and the iOS Simulator are required for iOS development; Android Studio manages Android SDK, emulators, and Gradle builds', 'App bundles: iOS uses .ipa files distributed via App Store Connect; Android uses .aab or .apk deployed via Google Play Console', 'Permissions must be declared in AndroidManifest.xml and Info.plist before requesting camera, location, or contacts at runtime', 'Deep linking connects URLs to specific app screens: configure intent filters (Android) or Universal Links (iOS) in app settings', 'Push notifications require APNs (Apple) and FCM (Firebase) — Firebase Cloud Messaging works for both platforms simultaneously', 'AsyncStorage (React Native) and SharedPreferences (Android) / UserDefaults (iOS) store small key-value data persistently'],
    ],
    [
      ['State management libraries like Redux Toolkit, Zustand, or MobX manage shared state across many React Native screens', 'Navigation in React Native uses React Navigation: Stack Navigator for screen stacks, Tab Navigator for bottom tabs, Drawer for side menus', 'useCallback and React.memo prevent unnecessary re-renders of child components when parent state updates', 'FlatList renders large lists efficiently using virtualisation — only items visible on screen are mounted in the DOM', 'Gesture handling with react-native-gesture-handler provides native thread gesture recognition for smooth interactions', 'Animated API enables physics-based animations; Reanimated library runs animations on the UI thread for 60fps smoothness'],
      ['Network requests use fetch() or Axios; always handle offline scenarios with NetInfo to detect connectivity status', 'Image caching with react-native-fast-image prevents re-downloading images on every render, improving scroll performance', 'Camera access via react-native-camera or expo-camera; document scanning uses ML Kit or Vision Framework natively', 'SQLite (expo-sqlite) provides local relational storage; Realm is a full object database that works offline-first', 'Firebase Realtime Database and Firestore sync data across devices in real-time with built-in offline persistence', 'Biometric authentication (FaceID/TouchID) uses LocalAuthentication API — always provide a password fallback'],
      ['Automated testing with Detox (E2E) and Jest (unit) catch regressions before reaching users on device farms', 'Performance profiling with Flipper identifies JavaScript thread vs UI thread frame drops and memory leaks', 'Over-the-Air (OTA) updates via Expo Updates or CodePush push JavaScript bundle changes without App Store review', 'App Store Optimisation (ASO): keyword-rich title and description, quality screenshots, localization boost discovery', 'Monetisation models: freemium (free app + in-app purchases), subscription (StoreKit 2 / Billing Library 5), ads (AdMob)', 'Crashlytics (Firebase) captures crash reports with full stack traces and session context to speed up debugging'],
    ],
    [
      ['UI design in mobile focuses on touch targets (minimum 44×44pt), thumb-reachable zones, and gesture affordances', 'Typography scales: use 12pt minimum for body text; iOS defaults use San Francisco, Android uses Roboto system fonts', 'Safe Area insets prevent content from overlapping notches, status bars, and home indicator on modern devices', 'Dark mode support requires color schemes defined with useColorScheme() and Appearance API to flip palettes dynamically', 'Accessibility: use accessibilityLabel, accessibilityHint, and accessibilityRole to support screen readers (VoiceOver/TalkBack)', 'Loading skeletons (placeholder shimmer) provide better perceived performance than spinner indicators during data fetches'],
      ['Offline-first architecture stores data locally first, then syncs to the server when connectivity is restored', 'Background fetch allows apps to refresh content periodically even when not in the foreground (limited by OS)', 'Location services: foreground location is straightforward; always-on background tracking requires special permission justification', 'Push notification payloads carry a title, body, data object, and badge count — handle both foreground and background states', 'Deep links and Universal Links route users from emails, websites, or other apps directly to a specific in-app screen', 'App clips (iOS) and Instant Apps (Android) let users try lightweight app experiences without a full install'],
      ['Firebase App Distribution streamlines beta testing — invite testers by email without going through public app stores', 'Semantic versioning for apps: increment CFBundleVersion (iOS) / versionCode (Android) for every TestFlight/Play Console upload', 'Proguard/R8 minifies and obfuscates Android release builds, reducing APK size and making reverse engineering harder', 'App Store review guidelines prohibit misleading screenshots, hidden charges, or privacy policy violations — plan for 1-3 day reviews', 'Analytics (Mixpanel, Firebase Analytics) track user journeys, feature adoption, and funnel drop-offs with event logging', 'Internationalization (i18n) with i18next or react-native-localize loads the right language based on device locale settings'],
    ],
    [
      ['SwiftUI is Apple\'s declarative UI framework — views are structs conforming to the View protocol, not classes', 'State management in SwiftUI: @State for local, @Binding for child-to-parent, @ObservableObject/@Published for shared state', 'Combine framework provides reactive programming with Publishers and Subscribers for handling async events natively', 'URLSession handles network requests in Swift; async/await (Swift 5.5+) eliminates callback pyramids in async code', 'Core Data persists structured data locally with a managed object model, fetch requests, and automatic iCloud sync', 'Xcode previews (#Preview macro) render SwiftUI views instantly without launching the full simulator'],
      ['Kotlin Coroutines are lightweight threads: launch{} for fire-and-forget tasks, async{} + await() for concurrent results', 'Jetpack Compose replaces XML layouts with composable functions annotated with @Composable — entirely declarative', 'ViewModel (Jetpack) survives configuration changes (screen rotation) and exposes StateFlow/LiveData to composables', 'Room database provides an SQLite abstraction with compile-time query verification using @Entity, @Dao, @Database annotations', 'WorkManager schedules deferrable background tasks that persist across app restarts and device reboots reliably', 'Hilt (dependency injection) wires app components together without manual constructor chaining, improving testability'],
      ['Firebase Authentication supports email/password, Google, Apple, Facebook, phone OTP sign-in in both iOS and Android', 'Firestore security rules enforce data access at the database layer: allow read, write: if request.auth != null && resource.data.userId == request.auth.uid', 'Cloud Functions for Firebase run Node.js code on Google servers in response to Firestore events, Auth triggers, or HTTP calls', 'Remote Config lets you change app behaviour (feature flags, UI text, thresholds) without releasing an app update', 'Cloud Storage stores user-uploaded files (profile photos, documents) with Firebase Storage SDK and security rules', 'App Check verifies requests come from your actual app — blocks abuse from emulators, scripts, or reverse-engineered clients'],
    ],
  ],
  'Programming Languages': [
    [
      ['C is a compiled, statically-typed, procedural language developed at Bell Labs in 1972 — the parent of C++, Java, and Go', 'Every C program starts with a main() function: int main() { ... return 0; } — return 0 signals success to the OS', 'Variables must be declared with a type before use: int count = 0; float pi = 3.14; char letter = \'A\';', 'Pointers store memory addresses: int *ptr = &variable; *ptr dereferences (reads/writes) the value at that address', 'malloc() and free() manage heap memory manually — always free() what you malloc() to prevent memory leaks', 'Preprocessor directives (#include, #define, #ifdef) run before compilation to include headers and define constants'],
      ['C++ extends C with object-oriented features: classes, objects, inheritance, polymorphism, and templates', 'A class bundles data (fields) and behaviour (methods): class Dog { string name; void bark() { cout << "Woof!"; } };', 'Constructors initialise objects; destructors clean up resources — the Rule of Three: if you define one, define all three', 'References (int &ref = var) are aliases — unlike pointers they cannot be null or reassigned to another variable', 'The Standard Template Library (STL) provides vector, map, set, queue, stack, and algorithms like sort() and find()', 'Smart pointers (unique_ptr, shared_ptr) automatically manage heap memory, eliminating most manual delete calls'],
      ['Java is a platform-independent, compiled-to-bytecode language that runs on the JVM (Java Virtual Machine)', 'Everything in Java is inside a class — the entry point is public static void main(String[] args) { }', 'Primitive types (int, double, boolean, char) vs reference types (String, ArrayList, objects) have different storage semantics', 'The Java Collections Framework: ArrayList (dynamic array), HashMap (key-value), LinkedList, HashSet, TreeMap', 'Interfaces define contracts (what a class can do); abstract classes provide partial implementation (how it is done)', 'Java 8+ lambda expressions and streams: list.stream().filter(x -> x > 0).map(x -> x * 2).collect(Collectors.toList())'],
    ],
    [
      ['Python uses indentation (spaces/tabs) to define code blocks — no curly braces; consistency is mandatory', 'Python is dynamically typed: variables hold references to objects, and type is checked at runtime not compile time', 'List comprehensions provide concise syntax: squares = [x**2 for x in range(10) if x % 2 == 0]', 'Dictionaries are hash maps: person = {"name": "Alice", "age": 30}; access with person["name"] or person.get("name", default)', 'Functions are first-class: pass them as arguments (callbacks), return them from functions (closures), or store in variables', 'Modules and packages: import os; from pathlib import Path; create your own module by saving a .py file'],
      ['JavaScript runs in browsers (via the JS engine) and on servers (Node.js) — the only language native to the browser', 'Closures allow inner functions to access outer function variables even after the outer function has returned', 'Prototype chain: every JS object has an internal [[Prototype]] link — property lookup walks up the chain until it finds or returns undefined', 'The event loop processes async callbacks from the callback queue after the call stack is empty — explains JS\'s non-blocking nature', 'Spread (...) and rest (...params) operators: spread expands iterables; rest collects remaining arguments into an array', 'Optional chaining (?.) and nullish coalescing (??) safely access nested properties: user?.address?.city ?? "Unknown"'],
      ['TypeScript is a superset of JavaScript adding static typing, interfaces, generics, and compile-time error checking', 'Type annotations: let name: string; function greet(user: User): string { return `Hello ${user.name}`; }', 'Interfaces define object shapes: interface User { id: number; name: string; email?: string; }', 'Generics enable type-safe, reusable functions: function identity<T>(arg: T): T { return arg; }', 'Union types (string | number) and intersection types (TypeA & TypeB) express complex type constraints', 'tsconfig.json configures the TypeScript compiler: target (ES2020), strict mode, module resolution, and output directory'],
    ],
    [
      ['Go (Golang) is a statically typed, compiled language built by Google for cloud-scale concurrent services', 'Goroutines are lightweight threads launched with go funcName() — thousands can run concurrently with minimal memory overhead', 'Channels synchronise goroutine communication: ch := make(chan int); goroutines send (ch <- value) and receive (<-ch)', 'Go has no classes — structs + methods + interfaces replace OOP; interface satisfaction is implicit (duck typing)', 'Error handling is explicit: functions return (result, error); callers must check if err != nil before proceeding', 'go mod init module/path creates a module; go get adds dependencies; go build compiles to a static binary with no runtime dependency'],
      ['Rust guarantees memory safety without a garbage collector through its ownership + borrowing + lifetimes system', 'Each value has exactly one owner; when the owner goes out of scope, Rust automatically drops (frees) the value', 'Borrowing: &T is an immutable reference (multiple allowed); &mut T is a mutable reference (only one at a time)', 'The borrow checker enforces these rules at compile time — memory bugs like use-after-free are compile errors in Rust', 'Result<T, E> and Option<T> types force explicit error handling — ? operator propagates errors up the call stack cleanly', 'Cargo is Rust\'s build system and package manager: cargo new, cargo build, cargo test, cargo run, cargo publish'],
      ['SQL (Structured Query Language) is the standard language for interacting with relational databases like PostgreSQL and MySQL', 'Core clauses: SELECT columns FROM table WHERE condition GROUP BY field HAVING aggregateCondition ORDER BY field LIMIT n', 'Joins combine data from multiple tables: INNER JOIN returns matching rows; LEFT JOIN includes all left rows even without a match', 'Aggregate functions: COUNT(), SUM(), AVG(), MAX(), MIN() — used with GROUP BY to compute grouped statistics', 'Indexes speed up SELECT queries by creating a sorted data structure: CREATE INDEX idx_email ON users(email)', 'Transactions group statements atomically: BEGIN; UPDATE ...; UPDATE ...; COMMIT; — if any fails, ROLLBACK undoes all'],
    ],
    [
      ['Go\'s standard library includes packages for HTTP, JSON, file I/O, cryptography, and testing — reducing need for third-party libraries', 'net/http package: http.HandleFunc("/", handler); http.ListenAndServe(":8080", nil) creates a web server in 10 lines', 'JSON encoding/decoding: json.Marshal(struct) converts to bytes; json.Unmarshal(bytes, &struct) parses JSON', 'Goroutine patterns: worker pools limit concurrency; WaitGroups synchronise completion; Mutexes protect shared data', 'Context package propagates deadlines and cancellation signals across goroutine boundaries for clean shutdown', 'go test runs tests in *_test.go files; go test -race detects data races; go vet catches common code mistakes'],
      ['Regular expressions (regex) match patterns in strings: Python re module, JavaScript RegExp, Go regexp package all use similar syntax', 'Functional programming concepts: pure functions (no side effects), immutability, higher-order functions, function composition', 'Design patterns: Factory (create objects without specifying class), Observer (event subscription), Strategy (swappable algorithms)', 'Big-O notation measures algorithm efficiency: O(1) constant, O(log n) logarithmic, O(n) linear, O(n²) quadratic', 'Recursion: a function calls itself with a simpler input until it reaches a base case — must always have a base case to terminate', 'Memoization caches results of expensive function calls: Dynamic Programming uses it to solve overlapping subproblems'],
      ['Concurrency vs Parallelism: concurrency is about dealing with many things at once (structure); parallelism is doing them at once (execution)', 'Threading models: Python has GIL limiting true parallelism; Java uses OS threads; Go uses M:N scheduling with goroutines', 'Memory models define how threads/goroutines see each other\'s writes — Go\'s memory model requires explicit synchronisation', 'Dependency injection decouples object creation from usage, making code more testable and flexible', 'SOLID principles: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion', 'Code reviews, linters (ESLint, golangci-lint, pylint), and formatters (prettier, gofmt, black) enforce consistent quality standards'],
    ],
  ],
  'Data Structures & Algorithms': [
    [
      ['An Array is a fixed-size, contiguous block of memory where each element is accessed in O(1) by index', 'Dynamic Arrays (Python list, Java ArrayList, C++ vector) resize automatically — amortized O(1) append, O(n) worst-case', 'Two-pointer technique: place pointers at both ends and converge to solve pair-sum, palindrome, and container problems in O(n)', 'Sliding window technique: maintain a window of elements and slide it to avoid recomputing overlapping subarray computations', 'Prefix sums precompute cumulative totals: prefixSum[i] = prefixSum[i-1] + arr[i]; enables O(1) range sum queries', 'Kadane\'s Algorithm finds the maximum subarray sum in O(n): track current max and global max while iterating once'],
      ['A Linked List stores elements as nodes each containing data and a pointer to the next node — no contiguous memory required', 'Singly linked: each node points forward only; doubly linked: each node has prev and next pointers for O(1) removal', 'Fast & Slow pointer (Floyd\'s cycle detection): slow moves 1 step, fast moves 2 — they meet if a cycle exists', 'Reversing a linked list iteratively: maintain prev, current, next pointers and reassign links in a single O(n) pass', 'Finding middle of a linked list: slow/fast pointer technique stops slow at the middle when fast reaches the end', 'Common interview problems: merge two sorted lists, remove nth from end, find intersection of two lists'],
      ['Recursion breaks a problem into smaller identical sub-problems; every recursive function needs a base case to terminate', 'Call stack stores activation frames — deep recursion risks stack overflow; tail recursion can be optimised by compilers', 'Tree recursion generates branching call trees — Fibonacci naive recursion is O(2ⁿ) due to recomputing subproblems', 'Backtracking explores all possibilities and abandons (backtracks) paths that violate constraints — used in N-Queens, Sudoku', 'Divide and Conquer splits the problem (divide), solves sub-problems (conquer), combines results (merge) — e.g., Merge Sort', 'Master Theorem analyses D&C recurrences: T(n) = aT(n/b) + O(n^d) to determine O(n^d), O(n^d log n), or O(n^log_b(a))'],
    ],
    [
      ['A Stack is LIFO (Last In First Out) — push and pop happen at the same end; implemented with array or linked list', 'Stack applications: function call management, expression evaluation, undo/redo operations, DFS traversal', 'Balanced parentheses checker: push opening brackets; on closing bracket, check if top matches — empty stack at end means valid', 'Monotonic stack maintains elements in increasing or decreasing order — solves Next Greater Element in O(n) instead of O(n²)', 'A Queue is FIFO (First In First Out) — enqueue at rear, dequeue from front; implement with linked list for O(1) both ends', 'Deque (double-ended queue) supports O(1) insertion and deletion from both ends — useful for sliding window maximum'],
      ['Hash Tables map keys to values using a hash function: hash(key) → index in an array of buckets', 'Collision resolution: chaining uses linked lists at each bucket; open addressing (linear/quadratic probing) finds next empty slot', 'Load factor = (number of entries) / (number of buckets); rehashing maintains performance when load factor exceeds 0.75', 'Python dict, Java HashMap, JavaScript Map and Object are hash table implementations with amortized O(1) get/set', 'Counting frequency: for c in s: freq[c] = freq.get(c, 0) + 1 — then use freq dict to solve anagram, most frequent problems', 'Two-sum problem: iterate array storing seen numbers in a hash set — check if complement exists in O(n) total time'],
      ['Binary Search requires a sorted array and eliminates half the search space each step: O(log n) time complexity', 'Binary search template: lo=0, hi=len-1; while lo <= hi: mid=(lo+hi)//2; compare mid and shrink range accordingly', 'Finding boundaries: use binary search to find the first/last occurrence of a target in a sorted array with duplicates', 'Sorting algorithms complexity: Bubble/Selection/Insertion O(n²); Merge Sort O(n log n); Quick Sort O(n log n) average', 'Merge Sort is stable and consistent O(n log n); Quick Sort is in-place but O(n²) worst case with bad pivot selection', 'Counting Sort achieves O(n + k) for integer arrays within a known range — beats comparison-based sort\'s O(n log n) lower bound'],
    ],
    [
      ['A Tree is a hierarchical data structure: one root node, each node has children, no cycles, n-1 edges for n nodes', 'Binary Tree: each node has at most two children (left, right); Binary Search Tree (BST): left < root < right always', 'Tree traversals: Inorder (left-root-right) gives sorted output on BST; Preorder (root-left-right) clones tree; Postorder (left-right-root) deletes tree', 'Height of a tree: longest path from root to leaf; depth of a node: its distance from the root', 'Balanced BST: height is O(log n) guaranteeing O(log n) search; unbalanced degenerates to O(n) in worst case (sorted input)', 'AVL and Red-Black Trees self-balance via rotations after insertions/deletions to maintain O(log n) operations always'],
      ['BFS (Breadth-First Search) uses a queue to explore nodes level by level — finds shortest path in unweighted graphs', 'DFS (Depth-First Search) uses a stack (or recursion) to explore as deep as possible before backtracking', 'Level-order traversal (BFS on tree) processes nodes row by row — useful for finding tree height and connecting level pointers', 'Detecting cycles in directed graphs: use DFS with three states (white/unvisited, gray/in-stack, black/done)', 'Topological Sort orders nodes such that for every directed edge u→v, u appears before v — applicable to DAGs only', 'Dijkstra\'s algorithm finds shortest paths from source in weighted graphs with non-negative edges using a min-heap priority queue'],
      ['Dynamic Programming (DP) solves problems with overlapping subproblems and optimal substructure by storing solutions', 'Top-down (memoisation) adds a cache to recursive solutions: if memo[n] exists, return it; else compute and store', 'Bottom-up (tabulation) fills a DP table iteratively from base cases up to the final answer — avoids recursion stack overhead', 'Knapsack 0/1: for each item and capacity, dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])', 'Longest Common Subsequence: dp[i][j] = dp[i-1][j-1]+1 if chars match, else max(dp[i-1][j], dp[i][j-1])', 'Coin change (minimum coins): dp[amount] = min(dp[amount - coin] + 1 for each coin) — classic unbounded knapsack variant'],
    ],
    [
      ['Graph representations: adjacency matrix O(V²) space for dense graphs; adjacency list O(V+E) for sparse graphs', 'Union-Find (Disjoint Set Union): path compression + union by rank gives nearly O(1) per operation — ideal for Kruskal\'s MST', 'Minimum Spanning Tree: Kruskal sorts edges and adds cheapest non-cycle edge; Prim grows MST from a start node greedily', 'Floyd-Warshall computes all-pairs shortest paths in O(V³): dp[i][j][k] = min(dp[i][j][k-1], dp[i][k][k-1] + dp[k][j][k-1])', 'Bellman-Ford handles negative weight edges and detects negative cycles: relax all V-1 edges V-1 times', 'Bipartite graph check: BFS color nodes alternating two colors — if neighbours share a color, it\'s not bipartite'],
      ['Greedy algorithms make locally optimal choices at each step hoping for a global optimum — works when greedy choice property holds', 'Interval scheduling maximisation: sort by end time, greedily pick non-overlapping intervals — classic greedy proof by exchange', 'Huffman encoding: repeatedly merge two lowest-frequency nodes into one — builds optimal prefix-free binary codes', 'Activity selection, Fractional Knapsack, and Job Sequencing are canonical greedy problems with proven optimality', 'Greedy fails for 0/1 Knapsack — taking the locally best item first does not guarantee globally optimal weight selection', 'Amortized analysis averages cost over a sequence of operations: even if one operation is expensive, the average may be O(1)'],
      ['String algorithms: KMP (Knuth-Morris-Pratt) finds pattern occurrences in O(n+m) using a failure function (prefix table)', 'Rabin-Karp uses rolling hashes to search for a pattern in O(n) average case — efficient for multiple pattern search', 'Trie (prefix tree) stores strings character by character enabling O(m) search/insert where m = string length', 'Segment Tree answers range queries (sum, min, max) in O(log n) and updates in O(log n) — built on a full binary tree', 'Fenwick Tree (Binary Indexed Tree) is simpler than Segment Tree for prefix sum queries and point updates in O(log n)', 'Bit manipulation tricks: x & (x-1) clears lowest set bit; x & (-x) isolates lowest set bit; XOR of same values cancels to 0'],
    ],
  ],
  'Machine Learning': [
    [
      ['Machine Learning is a field where algorithms learn patterns from data without being explicitly programmed for each case', 'Supervised learning: model trains on labelled (input, output) pairs — Classification predicts categories, Regression predicts values', 'Unsupervised learning: model finds hidden patterns in unlabelled data — Clustering groups similar points, PCA reduces dimensions', 'The ML pipeline: data collection → preprocessing → feature engineering → model training → evaluation → deployment → monitoring', 'Train/validation/test split: typically 70/15/15 — train on training set, tune hyperparameters on validation, report final score on test', 'Overfitting: model memorises training data but fails on new data (high variance); Underfitting: model is too simple (high bias)'],
      ['Linear Regression models a continuous target as a weighted sum of features: ŷ = w₁x₁ + w₂x₂ + ... + b', 'Cost function (MSE = Σ(yᵢ - ŷᵢ)² / n) measures prediction error; minimised by gradient descent or closed-form solution', 'Gradient descent updates weights iteratively: w = w - α(∂L/∂w) where α is the learning rate controlling step size', 'Logistic Regression classifies by passing a linear combination through the sigmoid function: σ(z) = 1/(1+e⁻ᶻ)', 'Decision boundary in Logistic Regression is linear — predict class 1 if P(y=1|x) > 0.5, else class 0', 'Regularisation adds a penalty term to prevent overfitting: L1 (Lasso) shrinks some weights to zero; L2 (Ridge) shrinks all weights'],
      ['Feature engineering transforms raw data into informative inputs: normalisation, encoding categoricals, creating interaction terms', 'StandardScaler normalises features to zero mean and unit variance: x\' = (x - μ) / σ — required for gradient-based algorithms', 'One-hot encoding converts categorical variables into binary columns: {"red","blue"} → [1,0] and [0,1]', 'Missing value strategies: drop rows/columns with many NaNs, fill with mean/median/mode, or use model-based imputation', 'Feature selection reduces dimensionality: correlation filtering, mutual information, recursive feature elimination (RFE)', 'Train-test data leakage: fitting scalers/encoders on the full dataset before splitting contaminates test evaluation — always fit only on train'],
    ],
    [
      ['Decision Trees split data on the feature and threshold that maximises information gain (entropy reduction) or minimises Gini impurity', 'Gini impurity: G = 1 - Σ pᵢ²; Information gain: IG = H(parent) - weighted_avg(H(children)) — both measure split quality', 'Pruning reduces overfitting by removing leaf nodes that provide little predictive power (post-pruning) or stopping early (pre-pruning)', 'Random Forests build many decision trees on random data subsets (bagging) and random feature subsets — averaging reduces variance', 'Gradient Boosting (XGBoost, LightGBM) trains trees sequentially, each correcting the residual errors of the previous ensemble', 'Feature importance in tree models: average reduction in impurity each feature causes across all trees in the ensemble'],
      ['Support Vector Machines find the maximum-margin hyperplane separating classes: maximise 2/||w|| subject to correct classification', 'Support vectors are the data points closest to the decision boundary — the margin depends only on these points', 'The kernel trick maps data to higher dimensions implicitly: RBF kernel K(xᵢ,xⱼ) = exp(-γ||xᵢ-xⱼ||²) handles non-linear boundaries', 'Soft-margin SVM allows misclassification with penalty C — high C: narrow margin, few errors; low C: wide margin, more tolerance', 'SVMs are effective in high-dimensional spaces and with clear margin separation — computationally expensive for large datasets', 'Multi-class classification with SVM uses one-vs-rest or one-vs-one strategy to extend binary SVM classifiers'],
      ['K-Means Clustering: initialise K centroids; assign each point to nearest centroid; recompute centroids; repeat until convergence', 'Choosing K: Elbow method plots inertia vs K — pick the K where improvement rate flattens; Silhouette score measures cluster quality', 'DBSCAN clusters points based on density: core points have ≥ minPts in ε-radius neighbourhood; noise points belong to no cluster', 'Hierarchical clustering builds a dendrogram by merging (agglomerative) or splitting (divisive) clusters iteratively', 'PCA (Principal Component Analysis) finds orthogonal directions of maximum variance: project data onto top-k eigenvectors', 'Dimensionality reduction trade-off: fewer features speed up training and reduce overfitting, but may lose discriminative information'],
    ],
    [
      ['Neural networks stack layers of artificial neurons: input layer → hidden layers → output layer — each connection has a learnable weight', 'Activation functions introduce non-linearity: ReLU (max(0,x)) is the default; Sigmoid for binary output; Softmax for multi-class', 'Backpropagation uses the chain rule to compute ∂Loss/∂w for every weight by propagating the error gradient from output to input', 'Mini-batch gradient descent splits training data into batches (32-256 samples) — balances computational efficiency and convergence stability', 'Dropout randomly sets a fraction of neuron activations to zero during training — a simple but powerful regularisation technique', 'Batch Normalisation normalises activations at each layer, accelerating training and allowing higher learning rates'],
      ['Convolutional Neural Networks (CNNs) apply learnable filters across the spatial dimensions of images, sharing weights across positions', 'Convolutional layer: filter slides over input; element-wise multiplication + sum gives feature map detecting edges, textures, objects', 'Pooling (Max/Average) downsamples feature maps, reducing spatial dimensions and providing translation invariance', 'Transfer learning: take a pre-trained network (ResNet, VGG, MobileNet) trained on ImageNet; fine-tune the final layers for your task', 'Data augmentation (random flip, rotation, crop, color jitter) synthetically increases training set diversity to reduce overfitting', 'Common CNN architectures: LeNet-5 (1998, digits), AlexNet (2012, ImageNet breakthrough), ResNet (2015, skip connections)'],
      ['Recurrent Neural Networks (RNNs) process sequential data by maintaining a hidden state that captures context from previous steps', 'Vanilla RNNs suffer from vanishing gradients for long sequences — LSTM and GRU gating mechanisms address this limitation', 'LSTM gates: forget gate (what to discard), input gate (what to store), output gate (what to expose) — controlled by sigmoid layers', 'Transformer architecture (2017): self-attention mechanism computes relationships between all token pairs regardless of distance', 'Self-attention: Q (query), K (key), V (value) matrices; Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V — parallel over sequence length', 'BERT (bidirectional encoder) for NLP tasks; GPT (autoregressive decoder) for text generation; both use the Transformer backbone'],
    ],
    [
      ['NLP (Natural Language Processing) bridges human language and computers — tasks include classification, translation, summarisation, Q&A', 'Text preprocessing: tokenisation (split to words/subwords), lowercasing, removing stop words, stemming or lemmatisation', 'Bag-of-Words represents text as word frequency vectors — loses word order but works surprisingly well for simple classification', 'TF-IDF (Term Frequency × Inverse Document Frequency) upweights rare but informative words and downweights common ones', 'Word2Vec and GloVe embed words as dense vectors where semantic similarity corresponds to geometric proximity', 'Subword tokenisation (BPE, WordPiece) handles out-of-vocabulary words by breaking them into known subword units'],
      ['Time series forecasting: AR (autoregressive), MA (moving average), ARIMA (combined), SARIMA (seasonal ARIMA) classical models', 'Stationarity: time series whose statistical properties (mean, variance, autocorrelation) do not change over time — required for ARIMA', 'Augmented Dickey-Fuller test checks for unit root; differencing (xt - xt-1) removes trends; log transform stabilises variance', 'LSTM networks capture long-range dependencies in time series better than classical ARIMA models for complex non-linear patterns', 'Prophet (Facebook) decomposes time series into trend + seasonality + holidays — robust to missing data and outliers', 'Evaluation metrics: RMSE (penalises large errors), MAE (robust to outliers), MAPE (percentage-based; fails if actuals near zero)'],
      ['MLOps bridges ML development and production operations: version control for data, code, and models', 'ML pipelines automate the workflow: data ingestion → preprocessing → training → evaluation → registry → serving', 'Model registries (MLflow, Weights & Biases) track experiments, log parameters/metrics, store artefacts, and compare runs', 'Model serving: REST API (Flask/FastAPI wrapping model), batch inference (Spark jobs), streaming inference (Kafka)', 'Data drift: input data distribution shifts over time — monitor with statistical tests; trigger retraining when drift detected', 'A/B testing evaluates model variants in production: route X% of traffic to new model; compare KPIs with statistical significance'],
    ],
  ],
  'Artificial Intelligence': [
    [
      ['AI is the simulation of human intelligence in machines — reasoning, learning, problem-solving, perception, and language understanding', 'Symbolic AI (GOFAI) uses hand-crafted rules and logic; connectionist AI uses neural networks to learn rules from data', 'The Turing Test (1950) proposed by Alan Turing: if a human judge cannot distinguish a machine from a human in conversation, it passes', 'AI problem types: search (find a path), optimisation (minimise cost), classification, generation, and planning', 'State space search: define states, initial state, goal states, and actions (transitions) — then search for a solution path', 'Completeness (always finds a solution if one exists) and Optimality (finds the best solution) are key properties of search algorithms'],
      ['Uninformed (blind) search strategies: BFS (guarantees shortest path, high memory), DFS (low memory, not optimal), IDDFS (combines both)', 'Informed search uses a heuristic h(n) estimating cost from n to goal — A* (A-star) uses f(n) = g(n) + h(n)', 'A* is optimal if the heuristic is admissible (never overestimates actual cost to goal) — Manhattan distance is admissible for grids', 'Greedy best-first search uses only h(n) — fast but not optimal; may miss better paths that start expensively', 'Adversarial search (game trees): Minimax algorithm assumes opponent plays optimally — evaluates all future game states recursively', 'Alpha-Beta Pruning eliminates branches that cannot affect the Minimax decision, reducing search from O(b^d) to O(b^(d/2))'],
      ['Computer Vision enables machines to interpret visual data: image classification, object detection, segmentation, pose estimation', 'Image classification assigns a single label to the entire image — CNN features abstract from edges to textures to objects', 'Object detection (YOLO, SSD, Faster R-CNN) both classifies and localises multiple objects with bounding boxes in one pass', 'Image segmentation: semantic assigns each pixel a class label; instance segmentation distinguishes individual object instances', 'Face recognition pipeline: detection → alignment → embedding extraction → distance comparison in embedding space', 'Edge detection (Sobel, Canny) finds intensity gradients; Hough Transform detects lines and circles analytically in images'],
    ],
    [
      ['Reinforcement Learning (RL): an agent takes actions in an environment, receives rewards, and learns to maximise cumulative reward', 'Markov Decision Process (MDP) formalises RL: states S, actions A, transition function P(s\'|s,a), reward R, discount γ', 'Policy π(s) → a maps states to actions; Value function V(s) estimates expected cumulative reward from state s under policy π', 'Q-Learning (model-free): Q(s,a) ← Q(s,a) + α[r + γ·max_a\'Q(s\',a\') - Q(s,a)] — converges to optimal Q-values', 'Exploration vs Exploitation dilemma: ε-greedy policy takes random action with probability ε, greedy action otherwise', 'Deep Q-Networks (DQN): use a neural network to approximate Q(s,a) — experience replay and target networks stabilise training'],
      ['Generative AI creates new content (text, images, audio, code) indistinguishable from human-generated content', 'Generative Adversarial Networks (GANs): Generator creates fake data; Discriminator distinguishes real from fake — adversarial training', 'Variational Autoencoders (VAEs): encode input to a latent distribution; sample from it and decode — enables smooth interpolation', 'Diffusion models (Stable Diffusion, DALL-E): forward process adds noise; reverse process learns to denoise — state-of-the-art image gen', 'Large Language Models (LLMs) like GPT-4: trained on trillions of tokens to predict next token; emergent abilities at scale', 'Prompt engineering: few-shot examples, chain-of-thought (think step by step), and ReAct (Reasoning+Acting) improve LLM accuracy'],
      ['Knowledge Graphs store facts as (subject, predicate, object) triples: (Einstein, bornIn, Germany) — queryable with SPARQL', 'Ontologies define concepts and relationships formally: TBox (terminology) + ABox (assertions) — OWL is the W3C standard', 'Semantic Web vision: web pages expose structured data (JSON-LD, RDFa) enabling machines to reason across the web', 'Rule-based reasoning: Prolog uses Horn clauses to derive new facts from existing ones through unification and backtracking', 'Knowledge base question answering: parse natural language query → convert to SPARQL → execute → return answer in NL', 'Neo4j graph database stores and queries knowledge graphs efficiently using the Cypher query language'],
    ],
    [
      ['Speech recognition (ASR) converts audio waveforms to text: raw audio → MFCC features → acoustic model → language model', 'MFCC (Mel-Frequency Cepstral Coefficients) extract perceptually relevant frequency features from audio frames', 'Hidden Markov Models (HMMs) were dominant ASR models before deep learning; now end-to-end models (Whisper, DeepSpeech) dominate', 'Text-to-Speech (TTS): text → phonemes → acoustic features → audio waveform — WaveNet and Tacotron achieve near-human quality', 'Speaker diarisation identifies who spoke when in multi-speaker audio — crucial for meeting transcription and subtitling', 'Wake word detection (Hey Siri, OK Google) runs on-device with tiny neural networks to preserve battery and privacy'],
      ['AI Ethics: fairness, accountability, transparency, and privacy (FATP) must guide AI system design and deployment', 'Algorithmic bias originates from biased training data, biased problem framing, or biased evaluation metrics', 'Demographic parity: equal positive prediction rates across groups; equal opportunity: equal true positive rates — choose based on context', 'Model interpretability: LIME explains individual predictions locally; SHAP computes each feature\'s Shapley value contribution', 'Differential privacy adds mathematically calibrated noise to outputs to protect individual records in aggregate statistics', 'Responsible AI frameworks (Google, Microsoft, EU AI Act) classify AI systems by risk level and impose obligations accordingly'],
      ['Genetic Algorithms mimic evolution: initialise population → evaluate fitness → select parents → crossover → mutate → repeat', 'Selection strategies: roulette wheel (proportional to fitness), tournament (compete k random individuals), rank-based selection', 'Crossover combines two parent chromosomes at a random cut point to produce offspring — single-point, two-point, uniform crossover', 'Mutation randomly alters genes with small probability — prevents premature convergence to local optima', 'Genetic Algorithms are suitable for NP-hard optimisation problems like scheduling, routing, and neural architecture search', 'Simulated Annealing starts with high "temperature" (accepts worse solutions) and cools — balances exploration and exploitation'],
    ],
  ],
  'Data Science': [
    [
      ['Data Science combines statistics, programming, domain knowledge, and communication to extract insights from data', 'The data science lifecycle: define problem → collect data → explore → clean → model → evaluate → deploy → monitor → iterate', 'Exploratory Data Analysis (EDA): compute summary statistics, plot distributions, check correlations, identify outliers', 'Pandas DataFrame is the core data structure: rows are observations, columns are features — read CSV with pd.read_csv()', 'df.describe() shows count, mean, std, min, quartiles, max for each numeric column — quick statistical overview', 'df.info() reveals data types and null counts; df.value_counts() shows category frequencies; df.corr() shows correlations'],
      ['NumPy provides n-dimensional arrays with vectorised operations: 100x faster than Python lists for numerical computation', 'Vectorisation replaces explicit for-loops with array operations: arr * 2 multiplies all elements simultaneously in C speed', 'Broadcasting: operations on arrays with different shapes — NumPy automatically stretches the smaller array to match larger', 'np.where(condition, x, y) is the vectorised if-else — np.argmax() finds index of maximum; np.argsort() returns sorted indices', 'Random number generation: np.random.seed(42) ensures reproducibility; np.random.randn() samples from standard normal', 'Linear algebra: np.dot(A, B) matrix multiplication; np.linalg.inv() inverse; np.linalg.eig() eigenvalues/vectors'],
      ['Matplotlib creates static visualisations: plt.plot() (line), plt.scatter() (points), plt.bar() (bars), plt.hist() (distributions)', 'Seaborn wraps Matplotlib with statistical plot types: sns.heatmap(), sns.boxplot(), sns.pairplot(), sns.violinplot()', 'Always label axes and add titles: plt.xlabel(), plt.ylabel(), plt.title(), plt.legend() — unlabeled plots are unreadable', 'Plotly creates interactive charts rendered in browsers — ideal for dashboards; go.Figure() + traces + layout pattern', 'Colour palettes: use perceptually uniform (viridis, plasma) for sequential data; diverging (RdBu) for positive/negative; qualitative for categories', 'Figure sizing: plt.figure(figsize=(10, 6)) — use width:height ratio of ~1.6:1 (golden ratio) for balanced charts'],
    ],
    [
      ['Statistics core concepts: population (all data) vs sample (subset); parameter (population measure) vs statistic (sample measure)', 'Probability distributions: Normal (bell curve), Binomial (counts of success), Poisson (rare events per time), Uniform (equal probability)', 'Central Limit Theorem: regardless of population distribution, the sample mean distribution approaches Normal as sample size grows', 'Hypothesis testing: state H₀ (null) and H₁ (alternative) → choose test statistic → compute p-value → reject H₀ if p < α (0.05)', 'Type I error (false positive): reject H₀ when it is true — controlled by significance level α; Type II (false negative): fail to reject false H₀', 'Confidence intervals: 95% CI means if we repeated sampling 100 times, 95 of those intervals would contain the true parameter'],
      ['SQL window functions perform calculations across related rows without collapsing them: ROW_NUMBER(), RANK(), LAG(), LEAD()', 'PARTITION BY divides rows into groups for window functions; ORDER BY defines the order within each partition', 'CTEs (Common Table Expressions) with WITH clause improve readability of complex multi-step queries', 'CASE WHEN ... THEN ... ELSE ... END implements conditional logic within SELECT, WHERE, and ORDER BY clauses', 'Subqueries in WHERE clause: SELECT name FROM employees WHERE dept_id IN (SELECT id FROM departments WHERE budget > 1M)', 'EXPLAIN/EXPLAIN ANALYZE shows query execution plan — identify full table scans and add indexes to speed up slow queries'],
      ['Data cleaning handles real-world messiness: duplicates, wrong types, inconsistent categories, outliers, missing values', 'Outlier detection: IQR method flags values outside [Q1 - 1.5×IQR, Q3 + 1.5×IQR]; Z-score flags values beyond ±3σ', 'Imputation strategies: mean/median for numerical (median is robust to outliers); mode for categorical; KNN for multivariate patterns', 'String standardisation: strip whitespace, lowercase, regex replace, map variations — "NY", "New York", "new york" → "New York"', 'Date parsing: pd.to_datetime() converts strings; dt accessor enables .year, .month, .day, .dayofweek, .quarter extraction', 'Data type casting: ensure numeric columns are float/int, categoricals are category dtype (saves memory vs object)'],
    ],
    [
      ['Business Intelligence translates raw data into actionable insights for non-technical decision-makers through dashboards', 'Tableau connects to databases, CSVs, APIs — drag dimensions and measures onto shelves to build visualisations rapidly', 'KPIs (Key Performance Indicators) quantify progress toward business goals — they must be Specific, Measurable, and Time-bound', 'Funnel analysis tracks user journey through stages: awareness → acquisition → activation → revenue → retention → referral (AARRR)', 'Cohort analysis groups users by a shared characteristic (signup month) and tracks metrics over time to understand retention', 'A/B testing (also called split testing) randomly assigns users to control vs treatment to measure the causal effect of a change'],
      ['Big Data is characterised by the 5 Vs: Volume (scale), Velocity (speed), Variety (structure), Veracity (quality), Value (insights)', 'Hadoop HDFS stores data across a cluster of commodity machines with redundancy; MapReduce processes it in parallel', 'Apache Spark is 100× faster than Hadoop MapReduce by keeping data in-memory — uses RDDs, DataFrames, and Datasets', 'PySpark DataFrames have a Pandas-like API: spark.read.csv(), df.filter(), df.groupBy().agg(), df.write.parquet()', 'Parquet is a columnar storage format — queries reading specific columns are fast because unneeded columns are skipped entirely', 'Data lakehouse architecture combines the raw storage of data lakes with the ACID transactions and governance of data warehouses'],
      ['Data storytelling turns analysis into decisions: structure narrative as situation → complication → resolution', 'Choose chart type by message: comparison (bar), trend (line), part-of-whole (pie/treemap), distribution (histogram), relationship (scatter)', 'Declutter dashboards: remove grid lines, legends when labels suffice, 3D effects, and gratuitous colour — every element must earn its place', 'Annotation: draw attention to the key insight directly on the chart — a single sentence label is worth a thousand-word caption', 'Executive summary first: lead with the conclusion and headline number; provide supporting charts for those who want depth', 'Reproducibility: record every transformation in code (Jupyter notebooks), version control the notebook, and share the data source'],
    ],
  ],
  'Cybersecurity': [
    [
      ['Cybersecurity protects systems, networks, and data from digital attacks, damage, or unauthorised access', 'CIA Triad: Confidentiality (only authorised access), Integrity (data unchanged), Availability (systems accessible when needed)', 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application — attacks target any layer', 'IP addresses identify devices on a network; ports identify services (HTTP=80, HTTPS=443, SSH=22, FTP=21, DNS=53)', 'TCP three-way handshake: SYN → SYN-ACK → ACK establishes a connection before data flows', 'Firewalls filter traffic by IP/port rules; stateful firewalls track connection state; WAFs (Web Application Firewalls) inspect HTTP'],
      ['Threat actors range from script kiddies (low skill, public tools) to nation-states (sophisticated, well-funded APT groups)', 'Attack lifecycle (Kill Chain): Reconnaissance → Weaponisation → Delivery → Exploitation → Installation → C2 → Actions', 'MITRE ATT&CK framework catalogs tactics, techniques, and procedures (TTPs) used by real-world adversaries', 'Social engineering exploits human psychology rather than technical flaws — the weakest link is often the human', 'Phishing emails trick users into clicking malicious links or attachments; spear phishing targets specific individuals', 'OSINT (Open Source Intelligence) gathers public information — LinkedIn, job postings, DNS records — to profile targets'],
      ['Network scanning with Nmap: nmap -sV -p- 192.168.1.0/24 discovers open ports and running services on a subnet', 'Wireshark captures and analyses network packets in real time — identify protocols, credentials, and suspicious traffic', 'Vulnerability scanners (Nessus, OpenVAS) identify known CVEs on target systems by comparing banners against vulnerability databases', 'CVE (Common Vulnerabilities and Exposures) is a list of publicly disclosed security flaws with a standardised identifier', 'CVSS (Common Vulnerability Scoring System) rates severity 0–10: critical (9-10), high (7-8.9), medium (4-7), low (0-3.9)', 'Penetration testing follows a scope: define target and rules of engagement → recon → scan → exploit → report → remediate'],
    ],
    [
      ['Symmetric encryption uses the same key for encrypt and decrypt (AES-256); much faster than asymmetric but requires secure key exchange', 'Asymmetric encryption uses a public key to encrypt and a private key to decrypt (RSA, ECC) — enables secure key exchange', 'Diffie-Hellman key exchange allows two parties to derive a shared secret over an untrusted channel without transmitting it', 'Digital signatures: sender signs message hash with their private key; recipient verifies with sender\'s public key — ensures authenticity', 'TLS (Transport Layer Security) secures HTTPS connections: handshake negotiates cipher suite, exchanges certificates, derives session key', 'Hashing algorithms (SHA-256, SHA-3) produce a fixed-size digest — a one-way function; any input change produces a completely different hash'],
      ['OWASP Top 10 lists the most critical web application security risks updated every 3-4 years based on real-world prevalence', 'SQL Injection: attacker injects SQL code via user input — use parameterised queries (prepared statements) to prevent', 'XSS (Cross-Site Scripting): inject malicious JavaScript into pages viewed by other users — sanitise output and use CSP headers', 'CSRF (Cross-Site Request Forgery): tricks authenticated users into submitting unintended requests — prevent with CSRF tokens', 'IDOR (Insecure Direct Object Reference): expose object IDs in URLs without authorisation checks — always verify user owns resource', 'Security headers: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options in every response'],
      ['Linux file permissions: rwxr-xr-x = owner(read+write+execute), group(read+execute), others(read+execute) — chmod 755', 'sudo grants temporary root privileges — principle of least privilege: grant only permissions actually needed for the task', 'Log files (/var/log/auth.log, /var/log/syslog) record login attempts, service events, and system errors — monitor them', 'cron jobs schedule commands: 0 2 * * * /backup.sh runs backup.sh at 2:00 AM every day — check for malicious cron entries', 'Netstat / ss commands show active network connections and listening ports — identify unexpected outbound connections', 'Fail2ban monitors log files and temporarily bans IPs that exhibit brute-force login patterns automatically'],
    ],
    [
      ['Malware categories: virus (attaches to files), worm (self-propagates), trojan (disguised), ransomware (encrypts for ransom)', 'Static analysis examines malware without running it: file hashing, string extraction (strings binary), PE header analysis', 'Dynamic analysis runs malware in a controlled sandbox (Cuckoo, Any.run) and records system calls, network connections, file changes', 'Obfuscation techniques: base64 encoding, XOR encryption, packing (UPX) — make static analysis harder by hiding strings', 'Indicators of Compromise (IoCs): malicious IP addresses, domain names, file hashes, registry keys — used to detect infections', 'YARA rules describe malware characteristics in text patterns: used by AV engines and SIEMs to detect known malware families'],
      ['SIEM (Security Information and Event Management) aggregates and correlates logs from across the infrastructure to detect threats', 'Incident response phases: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned', 'Digital forensics preserves evidence: bit-for-bit disk image (dd command); hash the image to prove integrity; work on the copy', 'Chain of custody documents every person who handled evidence — admissibility in legal proceedings depends on maintaining it', 'Memory forensics (Volatility framework) analyses RAM dumps to find running processes, network connections, and encryption keys', 'Timeline analysis reconstructs what happened: correlate file creation/modification times, log entries, and network captures'],
      ['Cloud security shared responsibility model: cloud provider secures infrastructure; customer secures what they put in the cloud', 'IAM best practices: enable MFA, use roles instead of long-term access keys, follow least-privilege, rotate credentials regularly', 'VPC security: place databases in private subnets with no public IP; restrict security groups to minimum required ports', 'Encryption at rest (AWS KMS, Azure Key Vault) and in transit (TLS) must both be enabled for sensitive data compliance', 'Container security: scan images for CVEs (Trivy, Snyk), run as non-root, use read-only filesystems, sign images with Cosign', 'CompTIA Security+ covers 6 domains: Threats/Attacks/Vulnerabilities, Technologies, Architecture, Identity, Risk, Cryptography'],
    ],
  ],
  'Cloud Computing': [
    [
      ['Cloud Computing delivers on-demand IT resources (compute, storage, networking) over the internet with pay-as-you-go pricing', 'Service models: IaaS (you manage OS up), PaaS (you manage application code up), SaaS (fully managed — just log in and use)', 'Deployment models: Public cloud (shared AWS/Azure/GCP), Private cloud (on-premises), Hybrid cloud (mixed), Multi-cloud (multiple providers)', 'AWS global infrastructure: 33 Regions, each with 3+ Availability Zones — AZs are separate data centres isolated from failures', 'Core AWS services: EC2 (virtual machines), S3 (object storage), RDS (managed databases), Lambda (serverless), VPC (networking)', 'Pricing models: On-Demand (hourly, no commitment), Reserved (1-3 year commitment, up to 72% discount), Spot (excess capacity, 90% discount)'],
      ['EC2 instance types: t3 (burstable general purpose), c6i (compute-optimised), r6i (memory-optimised), p4 (GPU for ML workloads)', 'Security Groups act as virtual firewalls for EC2 instances: stateful — inbound rules automatically allow the response traffic', 'Elastic Load Balancer (ALB for HTTP, NLB for TCP) distributes traffic across multiple EC2 instances in multiple AZs', 'Auto Scaling adjusts instance count based on CloudWatch metrics: scale out (add) when CPU > 70%; scale in (remove) when CPU < 30%', 'AMI (Amazon Machine Image) is a snapshot of a configured EC2 instance used to launch identical copies quickly', 'User Data scripts run at EC2 launch to install packages, pull code, and configure the instance automatically'],
      ['S3 is object storage with unlimited capacity: objects stored in buckets; each object has a key (path), value (bytes), and metadata', 'S3 storage classes: Standard (frequent access), IA (infrequent), Glacier Instant (archive, ms retrieval), Glacier Flexible (hours)', 'S3 bucket policies and ACLs control access; block all public access by default — never open buckets publicly unless needed', 'S3 versioning keeps all versions of every object — enables recovery from accidental deletion or overwrites', 'S3 Transfer Acceleration uses CloudFront edge locations to speed up uploads from distant locations significantly', 'Lifecycle policies automatically transition objects to cheaper storage classes or delete them after a specified number of days'],
    ],
    [
      ['Microsoft Azure: Entra ID (Active Directory) manages identity; Resource Groups organise related resources; Subscriptions control billing', 'Azure VM Scale Sets automatically create and scale identical VMs — equivalent to AWS Auto Scaling Groups', 'Azure Blob Storage: hot (frequent), cool (infrequent), archive (rarely accessed) — similar to S3 storage classes', 'Azure SQL Database is a fully managed PaaS database — automatic backups, patching, and high availability built in', 'Azure App Service runs web applications and APIs on a managed PaaS platform — supports .NET, Node.js, Python, Java, PHP', 'Azure Kubernetes Service (AKS) runs containerised workloads — Azure manages the control plane; you manage nodes'],
      ['Google Cloud Platform: Projects group resources; IAM controls access; Billing is per-project with budget alerts', 'Compute Engine (GCE) = VMs; App Engine = PaaS; Cloud Run = serverless containers; GKE = Kubernetes — pick based on control needs', 'BigQuery is a serverless data warehouse: no infrastructure to manage — query petabytes of data with standard SQL in seconds', 'Cloud Pub/Sub is a messaging service for event-driven architectures — producers publish messages; subscribers receive asynchronously', 'Cloud Spanner is a globally distributed, strongly consistent relational database — combines SQL semantics with horizontal scale', 'Vertex AI provides a managed ML platform: data labelling, AutoML, custom training, model registry, and serving endpoints'],
      ['Kubernetes (K8s) is a container orchestration system: manages deployment, scaling, networking, and self-healing of containers', 'Kubernetes objects: Pod (1+ containers sharing network), Deployment (desired state + rolling updates), Service (stable network endpoint)', 'kubectl apply -f deployment.yaml — declarative configuration management via YAML manifests describing the desired state', 'Rolling updates: Kubernetes gradually replaces old Pods with new ones, maintaining availability during deployments with no downtime', 'ConfigMaps store non-sensitive configuration; Secrets store sensitive data base64-encoded — mount both as env vars or volumes', 'Horizontal Pod Autoscaler (HPA) scales Pods based on CPU/memory metrics; Cluster Autoscaler adds/removes nodes as needed'],
    ],
    [
      ['Serverless: write functions, configure triggers — cloud provider manages all servers, scaling, and availability automatically', 'AWS Lambda executes code in response to events (HTTP, S3 upload, DynamoDB change) — charged per 100ms of execution time', 'Lambda cold starts: function container must be initialised before first invocation — provisioned concurrency eliminates this delay', 'API Gateway + Lambda = serverless REST API: define routes, attach Lambda handlers, configure throttling and API keys', 'AWS Step Functions orchestrate multi-step Lambda workflows with branching, retry logic, and error handling visually', 'Event-driven architecture: systems communicate through events — decoupled producers and consumers scale independently'],
      ['Terraform uses HashiCorp Configuration Language (HCL) to define infrastructure declaratively in .tf files', 'Terraform workflow: terraform init (download providers) → plan (preview changes) → apply (create resources) → destroy (delete)', 'State file (terraform.tfstate) tracks actual infrastructure — store remotely in S3 + DynamoDB for team collaboration and locking', 'Terraform modules encapsulate reusable infrastructure patterns — publish to Terraform Registry for community sharing', 'Resource dependencies: Terraform builds a dependency graph and creates resources in the correct order automatically', 'GitOps with Terraform: store IaC in Git; use CI/CD pipeline to run plan on PR and apply on merge to main branch'],
      ['CDN (Content Delivery Network) caches static assets at edge locations close to users, reducing latency and origin load', 'CloudFront (AWS), Azure CDN, and Cloud CDN cache images, CSS, JS, videos — configure TTL (time-to-live) per path pattern', 'Cache-Control headers control browser and CDN caching: max-age=86400 caches for 24 hours; no-cache forces revalidation', 'Multi-region active-active architecture serves users from the nearest region with automatic failover if one region fails', 'Route 53 latency-based routing directs users to the AWS region with lowest latency — weighted routing enables canary deployments', 'Disaster Recovery strategies: Backup/Restore (cheapest), Pilot Light (minimal always-on), Warm Standby, Multi-Site Active/Active'],
    ],
  ],
  'DevOps': [
    [
      ['DevOps combines development and operations, emphasising collaboration, automation, and continuous delivery of value', 'Key principles: CALMS — Culture (collaboration), Automation (eliminate manual work), Lean (reduce waste), Measurement, Sharing', 'Docker packages applications and all dependencies into portable containers that run identically on any machine', 'A container is a lightweight, isolated process sharing the OS kernel — far less overhead than virtual machines', 'Dockerfile instructions: FROM (base image), RUN (execute commands), COPY (add files), ENV (set variables), CMD (default command)', 'docker build -t myapp:1.0 . builds an image; docker run -p 8080:80 myapp:1.0 starts a container mapping host port 8080 to container port 80'],
      ['Docker Compose orchestrates multi-container applications with a docker-compose.yml defining services, networks, and volumes', 'Volumes persist data beyond container lifecycle: docker volume create mydata — mount with -v mydata:/app/data', 'Multi-stage Dockerfile builds: first stage compiles code; second stage copies only the binary — produces minimal production images', 'Docker networking: bridge (default, containers communicate by name), host (shares host network), overlay (multi-host with Swarm)', 'Container registries store images: Docker Hub (public), AWS ECR, Google Artifact Registry, GitHub Container Registry (private)', 'Docker best practices: one process per container, use .dockerignore, pin base image versions, scan images for vulnerabilities'],
      ['CI (Continuous Integration): developers merge code frequently; every push triggers automated build and test pipeline', 'CD (Continuous Delivery): every passing build is deployed to staging automatically; production deployment is a one-click action', 'CD (Continuous Deployment): every passing build is deployed to production automatically — requires high test coverage and confidence', 'GitHub Actions: define workflows in .github/workflows/ci.yml with triggers (push, PR), jobs, and steps (actions)', 'Workflow example: on push → checkout code → install deps → run linter → run tests → build Docker image → push to registry', 'Pipeline stages: lint → unit test → integration test → security scan → build → deploy to staging → smoke test → deploy to prod'],
    ],
    [
      ['Ansible is an agentless configuration management tool: push-based, uses SSH to execute tasks defined in YAML playbooks', 'Inventory file lists target hosts grouped by role: [webservers] host1.example.com; [databases] db1.example.com', 'Playbook structure: name, hosts, become (privilege escalation), and tasks (modules like apt, copy, template, service, user)', 'Ansible modules: apt (install packages), file (manage files), template (Jinja2 templates), service (start/stop), command (run shell)', 'Variables: define in vars: section, host_vars/, group_vars/ directories, or pass with -e at runtime for environment-specific values', 'Idempotency: running a playbook multiple times produces the same result — tasks check current state before making changes'],
      ['Prometheus scrapes metrics endpoints (HTTP /metrics) and stores them as time series with labels for multi-dimensional querying', 'PromQL query language: rate(http_requests_total{status="200"}[5m]) — rate of successful requests over 5-minute window', 'Alertmanager routes alerts from Prometheus to PagerDuty, Slack, email based on rules and silences during maintenance', 'Grafana visualises Prometheus data: connect as data source → build dashboards → set alert thresholds on panels', 'Four Golden Signals (Google SRE): Latency, Traffic, Errors, Saturation — the minimum metrics required to understand service health', 'Distributed tracing (Jaeger, Zipkin) tracks requests across microservices — attach trace ID to logs for correlated debugging'],
      ['The ELK Stack: Elasticsearch (full-text search and storage), Logstash (ingest and transform), Kibana (visualise)', 'Filebeat is a lightweight log shipper — runs on each server, reads log files, and ships them to Logstash or directly to Elasticsearch', 'Logstash pipeline: input (filebeat/syslog) → filter (grok parse, mutate, drop) → output (elasticsearch)', 'Grok patterns parse unstructured log lines into structured fields: %{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}', 'Kibana Discover: explore raw logs; Visualize: build charts; Dashboard: combine charts; Alerting: trigger on query results', 'Structured logging (JSON format) is machine-readable: {"level":"error","msg":"DB connection failed","timestamp":"2024-01-15T10:30:00Z"}'],
    ],
    [
      ['Git is a distributed VCS: every developer has the complete history locally — work offline, then push when ready', 'Git workflow: git add (stage changes) → git commit -m "message" → git push origin feature/branch to share changes', 'Branching strategies: Gitflow (feature/develop/main/release/hotfix), GitHub Flow (feature/main simple), Trunk-based (merge to main daily)', 'git rebase replays commits on top of another branch — rewrites history for cleaner linear history vs git merge (preserves history)', 'git bisect binary searches commit history to find the exact commit that introduced a bug — invaluable for regressions', 'Pull requests enforce code review before merging — require minimum approvals, passing CI, and no merge conflicts'],
      ['SRE (Site Reliability Engineering) applies software engineering principles to operations problems at scale', 'SLI (Service Level Indicator): a measurable metric (request latency, availability); SLO: the target (99.9% success rate)', 'Error budget = 100% - SLO target; if remaining error budget is low, slow feature releases and focus on reliability', 'Toil is manual, repetitive, automatable operational work — SREs track toil percentage and target < 50% of their work time', 'Blameless post-mortems: focus on systems and processes, not individuals — timeline, contributing factors, action items', 'Chaos Engineering (Netflix Chaos Monkey): intentionally inject failures in production to validate system resilience assumptions'],
      ['Jenkins Pipeline as Code with Jenkinsfile: defines stages (Build, Test, Deploy) in Groovy DSL checked into source control', 'Jenkins shared libraries allow reusable pipeline code across multiple projects — define in vars/ directory and import with @Library', 'Blue-Green deployments maintain two identical production environments — switch traffic from blue (old) to green (new) instantly', 'Canary deployments route a small percentage (1-5%) of traffic to the new version — monitor errors before full rollout', 'Feature flags decouple deployment from release — code is deployed but feature toggled off; enable for specific users or groups', 'DORA metrics measure DevOps performance: Deployment Frequency, Lead Time for Changes, Change Failure Rate, Time to Restore'],
    ],
  ],
  'UI/UX Design': [
    [
      ['UX (User Experience) encompasses how users feel when interacting with a product; UI (User Interface) is the visual and interactive layer', 'User-centred design principle: design for the actual user, not for yourself or your client — test with real users frequently', 'Design thinking process: Empathise → Define → Ideate → Prototype → Test — not linear; iterate between phases', 'A user persona is a fictional but data-driven representation of a key user segment — includes goals, frustrations, and behaviours', 'User journey maps visualise the sequence of steps and emotions a user goes through to accomplish a goal', 'Jobs-to-be-Done (JTBD) framework: users "hire" products to get jobs done — focus on the outcome, not product features'],
      ['Figma is a browser-based, collaborative design tool — real-time multi-user editing like Google Docs for design files', 'Frames define the canvas boundary for a screen: select device preset (iPhone 14, 1440px Desktop) or set custom dimensions', 'Auto Layout makes frames respond to content changes: direction (horizontal/vertical), spacing, padding, resizing behaviour', 'Components are reusable design elements: create once, use everywhere — edit the main component and all instances update', 'Variants group related component states (button: default/hover/active/disabled) into a single component set for easy use', 'Styles (colour, typography, effect) centralise design tokens — update the style and all instances referencing it update instantly'],
      ['Wireframes are low-fidelity structural sketches that focus on layout and content hierarchy without colour or detailed visuals', 'Low-fidelity wireframes use boxes, lines, and placeholder text — fast to create and easy to change early in the process', 'Information Architecture (IA) defines the structure, organisation, and navigation of a website or app', 'Card sorting (users group content into categories) and tree testing (users find content in a tree structure) validate IA decisions', 'Site maps visualise the hierarchical structure of pages and their relationships — plan navigation before building anything', 'User flows diagram the steps a user takes to complete a specific task — identify all paths including error and edge cases'],
    ],
    [
      ['Typography hierarchy: use font size, weight, and colour to guide the eye — large/bold/high-contrast for headings, smaller/lighter for body', 'Font pairing rule: pair a display font (personality) with a readable body font (utility) — usually one sans-serif + one serif', 'Line height (leading) for body text: 1.4–1.6× the font size improves readability — tight for headings, looser for paragraphs', 'Colour theory: primary colours mix to form secondary; complementary colours (opposite on wheel) create contrast and energy', 'Colour accessibility: maintain 4.5:1 contrast ratio for normal text, 3:1 for large text — check with WebAIM Contrast Checker', 'The 60-30-10 rule: 60% dominant neutral, 30% secondary colour, 10% accent for a balanced, visually pleasing palette'],
      ['Mobile-first design starts with the most constrained screen (320px) and progressively enhances for larger viewports', 'Touch targets must be ≥44×44pt (Apple HIG) or 48×48dp (Material Design) — fingers are imprecise pointing devices', 'Gesture affordances: swipe (delete/navigate), pinch (zoom), long-press (context menu) — indicate gestures with visual cues', 'Bottom navigation bar puts primary destinations within thumb reach — ideal for 3-5 top-level sections in mobile apps', 'Navigation patterns: tabs (lateral movement), stack (drill down and back), modal (temporary focus), drawer (supplementary links)', 'Empty states should be helpful, not just a blank screen — explain what goes here and provide a call-to-action to fill it'],
      ['Design systems are collections of reusable components and guidelines ensuring visual and functional consistency at scale', 'Design tokens are the atomic values (colour, spacing, typography) — stored in variables and shared between design tools and code', 'Component documentation should include: purpose, when to use/not use, props/variants, code snippets, and accessibility notes', 'Storybook documents React/Vue/Angular components in isolation — a living style guide automatically reflecting the actual code', 'Naming conventions matter: Button/Primary, Button/Secondary, Button/Destructive — mirrors the component\'s usage, not its appearance', 'Design system adoption: engineer buy-in requires great documentation, timely updates, and a clear contribution process'],
    ],
    [
      ['Usability testing observes real users completing specific tasks — reveals problems that stakeholders and designers never anticipated', 'Moderated testing: facilitator guides participant and probes with follow-up questions; unmoderated: participant completes tasks independently', 'Thinking aloud protocol: ask participants to narrate their thoughts while interacting — reveals mental models and points of confusion', 'System Usability Scale (SUS): 10 questions rated 1-5; score 68+ is considered acceptable; 85+ is excellent usability', 'Heatmaps (Hotjar, Crazy Egg) show where users click, move, and scroll on a page — identify what attracts and what is missed', 'A/B testing compares two design variations with real users — change only one variable at a time for interpretable results'],
      ['Conversion Rate Optimisation (CRO) improves the percentage of visitors who complete a desired action on a landing page', 'Above-the-fold content must communicate the value proposition and primary CTA immediately — users decide in seconds', 'Psychological principles in UX: social proof (testimonials, numbers), scarcity (limited time), anchoring (show original price), reciprocity', 'Form design: use single-column layout, inline validation, clear error messages, optional field labels, and autofill support', 'CTA (Call-to-Action) buttons: use action-oriented copy ("Start Free Trial"), high contrast, and clear visual prominence', 'Trust signals: SSL badge, recognisable payment logos, money-back guarantee, and real customer reviews increase conversion'],
      ['Motion design uses animation to communicate state transitions, feedback, and relationships between elements', 'The 12 principles of animation (Disney) apply to UI: ease in/out, anticipation, follow-through, and squash/stretch', 'Figma Smart Animate matches layers by name and type to create smooth transitions between frames — used for prototyping motion', 'Micro-interactions: small animations that respond to user actions — button press ripple, form validation shake, loading spinner', 'Duration guidelines: UI transitions 200-500ms; entering elements ease-out (starts fast); exiting elements ease-in (starts slow)', 'Accessibility for motion: respect prefers-reduced-motion CSS media query — always provide a non-animated fallback for vestibular disorders'],
    ],
  ],
  'Database Management': [
    [
      ['A database is an organised collection of structured information managed by a DBMS (Database Management System)', 'Relational databases store data in tables (rows and columns) with defined schemas and enforce relationships via foreign keys', 'ACID properties ensure reliable transactions: Atomicity (all-or-nothing), Consistency, Isolation, Durability', 'PRIMARY KEY uniquely identifies each row — must be NOT NULL and unique; FOREIGN KEY references another table\'s primary key', 'Normalisation organises tables to reduce redundancy: 1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency)', 'ER (Entity-Relationship) diagrams model entities, attributes, and relationships before building the actual database schema'],
      ['MongoDB stores data as BSON documents in collections — flexible schema allows different fields in different documents', 'Document structure: { _id: ObjectId, name: "Alice", age: 30, address: { city: "NYC", zip: "10001" } } — nested objects allowed', 'CRUD operations: db.users.insertOne({}), db.users.find({age:{$gt:25}}), db.users.updateOne({},{$set:{}}), db.users.deleteOne({})', 'Aggregation pipeline chains stages: $match (filter) → $group (aggregate) → $sort → $limit → $project (shape output)', 'Indexes in MongoDB: createIndex({email:1}) for ascending; compound indexes; text indexes for full-text search', 'Schema design patterns: embedded documents for one-to-few relationships; references (ObjectId) for one-to-many relationships'],
      ['PostgreSQL is an advanced open-source RDBMS with full SQL compliance, JSON support, and powerful extension ecosystem', 'CREATE TABLE syntax: id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, email TEXT UNIQUE, created_at TIMESTAMPTZ DEFAULT NOW()', 'PostgreSQL JSON/JSONB columns: store and query semi-structured data alongside structured relational data in the same table', 'Table inheritance and partitioning: partition large tables by range (date) or list (category) to improve query performance', 'EXPLAIN ANALYZE shows actual query execution plan, row estimates vs actual, and timing — the essential performance debugging tool', 'pg_stat_statements extension tracks slow queries — identify queries consuming most total time for optimisation priority'],
    ],
    [
      ['SQL SELECT statement: SELECT col1, col2 FROM table WHERE condition ORDER BY col LIMIT n OFFSET m', 'JOIN types: INNER JOIN (matching rows only), LEFT JOIN (all left + matching right), RIGHT JOIN, FULL OUTER JOIN (all rows both sides)', 'Aggregate functions with GROUP BY: SELECT dept, COUNT(*), AVG(salary) FROM employees GROUP BY dept HAVING AVG(salary) > 50000', 'Subqueries in FROM clause (derived tables): SELECT * FROM (SELECT user_id, COUNT(*) as cnt FROM orders GROUP BY user_id) t WHERE cnt > 5', 'Common Table Expressions (CTE): WITH active_users AS (SELECT * FROM users WHERE last_login > NOW() - INTERVAL \'30 days\') SELECT * FROM active_users', 'Window functions: SELECT name, salary, RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as dept_rank FROM employees'],
      ['B-tree indexes: the default PostgreSQL/MySQL index type — balanced tree supporting =, <, >, BETWEEN, LIKE \'prefix%\' queries', 'Composite index column order matters: create index on (dept, salary) supports WHERE dept = ? AND salary > ? but not salary alone', 'Index selectivity: an index on a boolean column (true/false) is rarely useful — high cardinality columns (email, id) benefit most', 'Covering index: index that contains all columns needed by a query — avoids returning to the main table (heap) for data', 'Partial index: create index on users(email) WHERE is_active = true — smaller index only on relevant rows', 'VACUUM in PostgreSQL reclaims storage from dead tuples left by updates and deletes — AUTOVACUUM runs this automatically'],
      ['Redis is an in-memory key-value store: sub-millisecond latency for session caching, leaderboards, rate limiting, pub/sub', 'Redis data types: String (SET/GET), Hash (HSET/HGET), List (LPUSH/LRANGE), Set (SADD/SMEMBERS), Sorted Set (ZADD/ZRANGE)', 'Expiration: SET session:userId "data" EX 3600 — automatically delete keys after 3600 seconds (TTL-based session management)', 'Redis Pub/Sub: PUBLISH channel message on publisher; SUBSCRIBE channel on subscribers — real-time messaging backbone', 'Redis persistence: RDB (snapshots to disk) and AOF (append-only log of writes) — combine both for durability without speed loss', 'Redis Cluster shards data across multiple nodes — consistent hashing with 16384 hash slots distributes keys automatically'],
    ],
    [
      ['Database replication: primary handles writes; one or more replicas replicate changes and serve reads — improves read throughput', 'Synchronous replication: primary waits for replica acknowledgment before committing — zero data loss but higher write latency', 'Asynchronous replication: primary commits immediately and sends changes to replicas after — lower latency but small replication lag', 'PostgreSQL streaming replication: standby continuously receives WAL (Write-Ahead Log) records and replays them in order', 'Failover: if the primary fails, promote a replica to become the new primary — use Patroni or repmgr to automate this process', 'Read replicas offload reporting queries and analytics workloads from the primary, preventing them from impacting write performance'],
      ['Graph databases model data as nodes (entities) and edges (relationships) — ideal when relationships are as important as data', 'Neo4j uses the Cypher query language: MATCH (u:User)-[:FOLLOWS]->(f:User) RETURN f.name — pattern matching on the graph', 'Graph algorithms: shortest path (BFS/Dijkstra), community detection (Louvain), centrality (PageRank) — built into Neo4j Graph Data Science', 'Use cases: social networks, recommendation engines, fraud detection, knowledge graphs, identity and access management', 'Property graph model: nodes and edges can both have properties — richer than RDF triples but specific to graph databases', 'When to use graph DB vs relational: use graph when queries involve multi-hop traversals (friends of friends, path finding)'],
      ['ORM (Object-Relational Mapper) maps database tables to programming language classes — eliminates hand-written SQL for CRUD', 'Mongoose schema: const UserSchema = new Schema({ name: String, email: { type: String, unique: true }, role: { type: String, enum: [\'student\',\'mentor\'] } })', 'Prisma schema defines models in a type-safe DSL: model User { id Int @id @default(autoincrement()) email String @unique }', 'N+1 query problem: querying 100 users and then fetching each user\'s orders separately = 101 queries — use eager loading instead', 'Eager loading: Mongoose .populate(\'orders\'), Prisma include: { orders: true } — fetch related data in a single JOIN query', 'Database migrations version-control schema changes: create migration → apply to dev → test → apply to staging → apply to production'],
    ],
  ],
  'Aptitude & Interview Preparation': [
    [
      ['Quantitative aptitude tests numerical reasoning ability — critical for campus placements, bank exams, and tech company screening', 'Percentage: X% of Y = (X/100) × Y; percentage change = ((new - old) / old) × 100; mark a 20% profit on CP means SP = 1.2 × CP', 'Ratio and Proportion: if A:B = 3:5 and total = 800, then A = (3/8)×800 = 300; cross-multiplication solves proportion problems', 'Time and Work: if A completes a job in n days, A\'s one-day work = 1/n; A and B together = 1/n + 1/m per day', 'Time, Speed, Distance: Distance = Speed × Time; relative speed when moving in same direction = |S1 - S2|; opposite direction = S1 + S2', 'Simple Interest = P×R×T/100; Compound Interest A = P(1 + R/100)^T; difference CI-SI for 2 years = P(R/100)²'],
      ['Logical reasoning tests ability to identify patterns, draw conclusions, and think analytically under time pressure', 'Number series: find the pattern (difference, ratio, square, prime) — e.g., 2, 6, 12, 20, 30, ... (differences: 4, 6, 8, 10 — next is 42)', 'Letter series: A, D, G, J, ... (skip 2 letters between each) — next is M; combine number and letter series for alphanumeric patterns', 'Seating arrangement: fix one person\'s position; use relative directions (to the left of, opposite to) to place others one by one', 'Blood relations: draw a family tree; note gender clues (son/daughter, brother/sister); work through statements systematically', 'Logical deduction (syllogisms): All A are B; Some B are C — does it follow that Some A are C? Draw Venn diagrams to verify'],
      ['Verbal ability tests English comprehension, grammar, and vocabulary — a major component of most aptitude tests', 'Reading comprehension strategy: skim passage for gist → read questions → re-read relevant paragraphs → eliminate wrong options', 'Para-jumble: find the opening sentence (no pronoun reference, introduces topic) and closing sentence → link remaining logically', 'Error spotting: look for subject-verb agreement, tense consistency, pronoun-antecedent agreement, misplaced modifiers', 'Vocabulary building: learn word roots (bene- = good, mal- = bad, -ology = study of) to deduce meanings of unfamiliar words', 'Idioms and phrases: "break the ice" (initiate conversation), "barking up the wrong tree" (on the wrong track) — memorise 50 common ones'],
    ],
    [
      ['A strong resume is a single page, ATS-optimised, and tailored to each job description — a generic resume rarely passes screening', 'Use the XYZ formula: "Accomplished X as measured by Y by doing Z" — quantify achievements wherever possible', 'Action verbs lead each bullet: Designed, Built, Optimised, Led, Reduced, Increased, Deployed — avoid passive voice', 'Technical skills section: list languages, frameworks, tools, and platforms — match keywords from job descriptions exactly', 'Projects section is crucial for freshers: include GitHub link, one-sentence description, tech stack, and key metric (e.g., "10K users")', 'LinkedIn optimisation: custom URL, professional photo, headline with keywords, detailed About section, endorsements, and 500+ connections'],
      ['The STAR method structures behavioural interview answers: Situation → Task → Action → Result — keep under 2 minutes', 'Common behavioural questions: "Tell me about a time you handled conflict", "Describe a failure and what you learned", "A time you led a team"', '"Tell me about yourself" = 3-4 minute professional summary: background → key skills → recent achievements → why this role', 'Questions to ask interviewers: team\'s biggest technical challenge, success metrics for the role, onboarding process, growth opportunities', 'Research the company: products, recent news, engineering blog, tech stack (StackShare, LinkedIn), culture (Glassdoor, Blind)', 'Salary research: use Glassdoor, Levels.fyi, LinkedIn Salary, and local market data — know your BATNA (Best Alternative To Negotiated Agreement)'],
      ['Coding interviews assess problem-solving: clarify constraints → brainstorm approaches → discuss trade-offs → code → test edge cases', 'The 4-step interview framework: understand (repeat in own words) → plan (algorithm + complexity) → code (clean + readable) → verify (trace through examples)', 'Big-O analysis: describe time and space complexity for each solution — interviewers always ask about this', 'Start with a brute-force approach: O(n²) solution is better than no solution — then optimise to O(n log n) or O(n)', 'Edge cases to consider: empty input, single element, all duplicates, negative numbers, very large/small values, and sorted input', 'Practice platforms: LeetCode (focus on Top 150 Interview Questions), HackerRank, Codeforces, NeetCode roadmap'],
    ],
    [
      ['System design interviews assess ability to architect scalable, reliable distributed systems — expect 45-60 minute open-ended questions', 'Framework: Requirements clarification → Estimates (QPS, storage, bandwidth) → High-level design → Deep dive → Trade-offs', 'Functional requirements: what the system does; Non-functional: scale (10M users), latency (<200ms p99), availability (99.99%)', 'Calculate scale: 10M DAU × 10 requests/day = 100M requests/day = ~1200 QPS; 1KB per request = 100GB/day data written', 'Load balancer distributes traffic across multiple servers — Round Robin, Least Connections, or IP Hash strategies', 'Database choice: SQL (ACID, relations, complex queries), NoSQL (scale, flexible schema, denormalised), NewSQL (both)'],
      ['Caching layers: client cache (browser), CDN (static assets), API gateway cache, application cache (Redis), database cache (buffer pool)', 'Cache strategies: Cache-Aside (application manages cache), Write-Through (write to cache and DB simultaneously), Write-Back (cache first, async DB)', 'Cache eviction policies: LRU (Least Recently Used) is the most common default — evicts least recently accessed item when full', 'Message queues (Kafka, RabbitMQ, AWS SQS) decouple producers and consumers — buffer spikes, enable async processing', 'Kafka concepts: topics (channels), partitions (parallelism), consumer groups (each group gets all messages), offset (read position)', 'Database sharding splits data across multiple servers by a shard key — improves write throughput but complicates cross-shard queries'],
      ['HR rounds assess cultural fit, communication skills, and career intent — not just technical ability', 'Salary negotiation: never give the first number; respond to "What are your expectations?" with "What\'s the budgeted range for this role?"', 'Negotiating an offer: thank them for the offer, confirm your excitement, then ask for 10-15% above the offered number with justification', 'Counter-offer ethics: if you accept an offer and receive a counter-offer from your current employer, seriously consider attrition risk to relationships', 'Ask about the full compensation package: base salary, annual bonus, equity (RSUs, stock options), benefits, and learning allowance', 'After offer acceptance: send a thank-you email, notify other companies in your pipeline promptly, and negotiate a start date with buffer time'],
    ],
  ],
  'Blockchain & Web3': [
    [
      ['Blockchain is a distributed, immutable ledger of transactions maintained by a network of nodes without a central authority', 'A block contains: a header (previous block hash, Merkle root, timestamp, nonce), and a list of validated transactions', 'Hashing: SHA-256 produces a fixed 256-bit digest — any input change produces a completely different hash (avalanche effect)', 'The Merkle Tree structure in each block: all transaction hashes are paired and hashed up to a single Merkle root — enables fast verification', 'Proof of Work (PoW): miners hash the block header repeatedly varying the nonce until the hash starts with N zeros — computationally expensive', 'Proof of Stake (PoS) selects validators weighted by staked cryptocurrency — energy-efficient alternative to PoW; used by Ethereum post-merge'],
      ['Ethereum is a programmable blockchain: deploy code (smart contracts) that executes deterministically on all nodes in the network', 'EVM (Ethereum Virtual Machine) is a sandboxed runtime that executes smart contract bytecode on every Ethereum node', 'Gas is the unit measuring computation: every EVM opcode costs gas; gas fee = gas used × gas price (in Gwei); prevents infinite loops', 'Accounts: Externally Owned Accounts (EOAs) controlled by private keys; Contract Accounts controlled by deployed code', 'Transactions change blockchain state: ETH transfer, contract deployment, or contract function call — all must be signed by an EOA', 'Block explorers (Etherscan) let anyone inspect transactions, addresses, contract code, and token transfers on the public chain'],
      ['Solidity is Ethereum\'s primary smart contract language — strongly typed, compiled to EVM bytecode, inspired by JavaScript/C++', 'Solidity contract anatomy: pragma version, state variables, events, modifiers, constructor, and functions (public/private/internal/external)', 'State variables persist on the blockchain between function calls; local variables exist only within a function execution', 'msg.sender is the address calling the current function; msg.value is ETH (in wei) sent with the call; block.timestamp is current time', 'Events log data cheaply on the blockchain; front-end apps listen for events to update UI reactively without polling', 'Mappings: mapping(address => uint) public balances — hash map stored on-chain; access by key is O(1) but cannot be iterated'],
    ],
    [
      ['Web3.js and Ethers.js are JavaScript libraries that connect browser dApps to Ethereum nodes via JSON-RPC', 'MetaMask is a browser extension wallet: injects window.ethereum into the page — dApps request connection, then sign transactions', 'ethers.js connection: const provider = new ethers.BrowserProvider(window.ethereum); const signer = await provider.getSigner()', 'Contract interaction: const contract = new ethers.Contract(address, abi, signer); await contract.transfer(to, amount)', 'ABI (Application Binary Interface) describes a contract\'s functions and events — generated by the Solidity compiler', 'Reading on-chain state is free (call); writing state requires a signed transaction and gas payment — distinguish view vs write functions'],
      ['DeFi (Decentralised Finance) recreates financial services (lending, trading, yield farming) using smart contracts without intermediaries', 'Automated Market Maker (AMM): Uniswap uses the constant product formula x×y=k to price token swaps algorithmically', 'Liquidity pools: LPs deposit equal value of two tokens, receive LP tokens representing their share, and earn a portion of swap fees', 'Lending protocols (Aave, Compound): supply assets to earn interest; borrow against collateral — overcollateralised to manage liquidation risk', 'Flash loans: borrow any amount, use it within one transaction, repay with fee — no collateral needed because it is atomic', 'Slippage: large trades on AMMs move the price; set a maximum acceptable slippage percentage to protect against front-running bots'],
      ['NFTs (Non-Fungible Tokens) use ERC-721 standard: each token has a unique ID and is individually ownable and transferable', 'ERC-721 key functions: mint (create), ownerOf (who owns token ID), transferFrom, approve, and tokenURI (metadata link)', 'Token metadata: tokenURI points to a JSON file with name, description, image, and attributes — stored on IPFS for decentralisation', 'ERC-1155 is a multi-token standard: one contract manages both fungible (currencies) and non-fungible (unique items) tokens efficiently', 'Royalties: EIP-2981 is the standard for on-chain royalty info — marketplaces (OpenSea, Blur) read this to pay creators on secondary sales', 'NFT marketplaces aggregate listings off-chain for efficiency; settlement (ownership transfer) happens on-chain when a sale executes'],
    ],
    [
      ['Common Solidity vulnerabilities: reentrancy, integer overflow (pre-0.8), access control flaws, front-running, and oracle manipulation', 'Reentrancy attack: malicious contract calls back into the victim before the first execution completes — drain funds via recursive calls', 'Check-Effects-Interactions pattern prevents reentrancy: update state (balance = 0) before external calls (transfer())', 'OpenZeppelin provides battle-tested, audited contract implementations: Ownable, ReentrancyGuard, ERC20, ERC721, AccessControl', 'Smart contract audits: manual code review + automated tools (Slither, MythX, Certora formal verification) before mainnet deployment', 'Bug bounty programmes (Immunefi, HackerOne) incentivise security researchers to responsibly disclose vulnerabilities pre-exploit'],
      ['DAOs (Decentralised Autonomous Organisations) are entities governed by token holders through on-chain proposals and voting', 'Governance tokens grant voting rights: 1 token = 1 vote (plutocratic) or quadratic voting (diminishing returns for large holders)', 'Proposal lifecycle: creation (post a description + calldata) → voting period (token holders vote yes/no/abstain) → execution (if quorum and majority met)', 'Timelock contracts delay execution: even if a malicious proposal passes, users have time to exit before it takes effect', 'Multi-signature wallets (Gnosis Safe): require M of N signers to execute a transaction — secure treasury management for DAOs', 'On-chain governance is transparent and censorship-resistant; off-chain governance (Snapshot) is cheaper but relies on social consensus'],
      ['IPFS (InterPlanetary File System) is a peer-to-peer, content-addressed storage network — content is identified by its hash (CID)', 'Content addressing: same file always gets the same CID regardless of where it is stored — integrity is cryptographically guaranteed', 'Pinning ensures IPFS content persists: use Pinata or web3.storage to pin NFT metadata so it stays accessible over time', 'Solana is a high-performance blockchain: 65,000+ TPS, 400ms block time, sub-cent fees — uses Proof of History + PoS consensus', 'Solana Accounts model: programs (code) and accounts (state) are separate — programs are stateless, read/write data from accounts', 'Anchor framework for Solana programs: IDL (Interface Definition Language) auto-generates client bindings — like ABI in Ethereum'],
    ],
  ],
};

// ─── COURSE DATA PER CATEGORY ─────────────────────────────────────────────────
const CATEGORIES = [
  'Web Development', 'App Development', 'Programming Languages',
  'Data Structures & Algorithms', 'Machine Learning', 'Artificial Intelligence',
  'Data Science', 'Cybersecurity', 'Cloud Computing', 'DevOps',
  'UI/UX Design', 'Database Management', 'Aptitude & Interview Preparation', 'Blockchain & Web3',
];

const COURSE_TEMPLATES = {
  'Web Development': [
    { title: 'HTML5 & CSS3 Masterclass', desc: 'Master web page structure with semantic HTML5 elements, CSS layouts, flexbox, grid, and responsive design fundamentals.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Modern JavaScript (ES6+)', desc: 'Deep dive into asynchronous programming, closures, APIs, classes, modules, and modern JS syntax from ES6 through ES2024.', level: 'Beginner', duration: '5 weeks' },
    { title: 'React.js Complete Guide', desc: 'Build production React apps with hooks, context, custom state management, optimisation techniques, and React 19 features.', level: 'Intermediate', duration: '6 weeks' },
    { title: 'Node.js & Express.js Backends', desc: 'Build scalable REST APIs, implement JWT authentication, MongoDB integration, error handling, and deploy backend apps.', level: 'Intermediate', duration: '6 weeks' },
    { title: 'Next.js 14 Developer Path', desc: 'Master App Router, Server Components, SSR, SSG, ISR, metadata, and full-stack features of the Next.js 14 ecosystem.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Tailwind CSS Essentials', desc: 'Build modern, responsive UIs using Tailwind utility classes, custom design tokens, dark mode, and CSS animations.', level: 'Beginner', duration: '3 weeks' },
    { title: 'MERN Stack Production App', desc: 'Create, test, and deploy a full-stack application with MongoDB, Express, React, and Node.js, including CI/CD pipelines.', level: 'Advanced', duration: '8 weeks' },
    { title: 'GraphQL API Design', desc: 'Build modern GraphQL APIs: schema design, resolvers, mutations, subscriptions, DataLoader, and Apollo Server integration.', level: 'Advanced', duration: '4 weeks' },
    { title: 'Web Performance & SEO', desc: 'Optimise Core Web Vitals, implement semantic HTML, structured data, accessibility standards, and Lighthouse-based auditing.', level: 'Intermediate', duration: '4 weeks' },
  ],
  'App Development': [
    { title: 'React Native for iOS and Android', desc: 'Build native mobile apps with React Native: navigation, state management, device APIs, and publishing to both app stores.', level: 'Intermediate', duration: '8 weeks' },
    { title: 'Flutter & Dart: Zero to Hero', desc: 'Build fast, native-compiled apps for mobile, web, and desktop using Google Flutter\'s rich widget ecosystem.', level: 'Beginner', duration: '8 weeks' },
    { title: 'SwiftUI for iOS App Development', desc: 'Master Swift syntax, SwiftUI views, state management, Core Data, and publishing apps to the Apple App Store.', level: 'Beginner', duration: '6 weeks' },
    { title: 'Kotlin & Jetpack Compose Android', desc: 'Build modern Android apps using Kotlin, Jetpack Compose, ViewModel, Room, and Google Play deployment.', level: 'Intermediate', duration: '7 weeks' },
    { title: 'Mobile UX Design Principles', desc: 'Design thumb-friendly, gesture-driven, accessible mobile experiences with established Android and iOS design patterns.', level: 'Beginner', duration: '3 weeks' },
    { title: 'React Native State & Push Notifications', desc: 'Implement Redux Toolkit, Zustand, background state, push notifications, and geolocation in React Native apps.', level: 'Advanced', duration: '5 weeks' },
    { title: 'Android Performance Optimisation', desc: 'Profile CPU, memory, and battery usage in Android, fix memory leaks, implement offline caching, and optimise rendering.', level: 'Advanced', duration: '5 weeks' },
    { title: 'Ionic Framework: Web to Mobile', desc: 'Use HTML, CSS, and JavaScript to package enterprise hybrid mobile apps for Android and iOS using Capacitor.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Firebase for Mobile Backends', desc: 'Integrate Firebase Auth, Firestore, Cloud Functions, FCM push notifications, Crashlytics, and Remote Config.', level: 'Beginner', duration: '4 weeks' },
  ],
  'Programming Languages': [
    { title: 'C Programming for Beginners', desc: 'Learn memory management, pointers, arrays, structs, file I/O, and the compilation process in the C language.', level: 'Beginner', duration: '6 weeks' },
    { title: 'Object-Oriented Programming with C++', desc: 'Master OOP principles, templates, the STL containers and algorithms, and smart pointers in modern C++20.', level: 'Intermediate', duration: '6 weeks' },
    { title: 'Java SE Programming Guide', desc: 'Learn core Java, JVM internals, the Collections Framework, generics, functional interfaces, and lambdas.', level: 'Beginner', duration: '8 weeks' },
    { title: 'Python Fundamentals & Scripting', desc: 'Master Python data types, comprehensions, decorators, file I/O, web scraping, and writing reusable modules.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Advanced JavaScript Deep Dive', desc: 'Master prototype chains, the event loop, V8 compilation, memory allocation, closures, and browser APIs.', level: 'Advanced', duration: '5 weeks' },
    { title: 'Go Lang: Building Web Services', desc: 'Learn Go syntax, goroutines, channels, standard library, and build high-performance HTTP microservices.', level: 'Intermediate', duration: '6 weeks' },
    { title: 'Rust Systems Programming', desc: 'Understand ownership, borrow checker, lifetimes, macros, and write memory-safe, high-performance native code.', level: 'Advanced', duration: '7 weeks' },
    { title: 'TypeScript for Scale', desc: 'Learn interfaces, generics, mapped types, utility types, and compile React and Node.js projects with TypeScript.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'SQL & Database Querying Bootcamp', desc: 'Master SELECT, JOINs, aggregations, subqueries, window functions, stored procedures, and query optimisation.', level: 'Beginner', duration: '4 weeks' },
  ],
  'Data Structures & Algorithms': [
    { title: 'Arrays, Linked Lists & Recursion', desc: 'Master array manipulation, two-pointer patterns, linked list operations, and recursive problem-solving strategies.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Stacks, Queues & Hash Tables', desc: 'Implement and apply stacks, queues, deques, hash maps, and hash sets for efficient lookups and counting problems.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Trees, BST & AVL Trees', desc: 'Learn tree traversals, binary search trees, self-balancing AVL trees, and heap data structures.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'Graph Algorithms & Traversals', desc: 'Master BFS, DFS, cycle detection, topological sort, Dijkstra\'s shortest path, and minimum spanning tree algorithms.', level: 'Intermediate', duration: '6 weeks' },
    { title: 'Sorting & Searching Techniques', desc: 'Understand comparison and non-comparison sorting algorithms, binary search variants, and their complexity trade-offs.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Dynamic Programming Masterclass', desc: 'Learn memoisation, tabulation, Knapsack, LCS, edit distance, and identify DP patterns from LeetCode problems.', level: 'Advanced', duration: '8 weeks' },
    { title: 'Greedy Algorithms & Divide & Conquer', desc: 'Master interval scheduling, Huffman encoding, quick select, binary search, and matrix multiplication algorithms.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'Advanced Graphs: Dijkstra, Kruskal, Prim', desc: 'Implement shortest path algorithms, MST construction, network flow, and Union-Find with path compression.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Coding Interview DSA Prep', desc: 'Solve LeetCode-style problems with patterns: sliding window, fast/slow pointers, monotonic stack, and segment trees.', level: 'Advanced', duration: '8 weeks' },
  ],
  'Machine Learning': [
    { title: 'Linear & Logistic Regression Models', desc: 'Understand gradient descent, cost functions, regularisation, and apply regression to real classification problems.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Decision Trees & Random Forests', desc: 'Learn entropy, information gain, pruning, bagging, and ensemble methods including XGBoost and LightGBM.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Unsupervised Learning & Clustering', desc: 'Master K-Means, DBSCAN, hierarchical clustering, PCA, t-SNE, and dimensionality reduction techniques.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Support Vector Machines (SVM)', desc: 'Understand hyperplane margins, soft-margin SVMs, kernel tricks, and apply SVMs to image and text classification.', level: 'Advanced', duration: '4 weeks' },
    { title: 'Neural Networks & Deep Learning', desc: 'Build neural networks from scratch: forward pass, backpropagation, activation functions, and training optimisation.', level: 'Advanced', duration: '6 weeks' },
    { title: 'ML Pipeline & Feature Engineering', desc: 'Master data preprocessing, feature selection, cross-validation pipelines, and scikit-learn\'s transformer API.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'Natural Language Processing NLP', desc: 'Learn tokenisation, TF-IDF, word embeddings, sequence models, and fine-tune transformers for NLP tasks.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Time Series Forecasting with ML', desc: 'Analyse trends, seasonality, ARIMA models, and apply LSTM and Prophet to real-world forecasting problems.', level: 'Advanced', duration: '5 weeks' },
    { title: 'MLOps: Deploying Models to Production', desc: 'Package models with FastAPI, containerise with Docker, track experiments with MLflow, and monitor data drift.', level: 'Advanced', duration: '6 weeks' },
  ],
  'Artificial Intelligence': [
    { title: 'Introduction to AI & Search Systems', desc: 'Study heuristics, BFS, DFS, A* pathfinding, minimax game trees, and alpha-beta pruning algorithms.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Computer Vision & OpenCV', desc: 'Process images with filters, edge detection, face recognition, object detection using YOLO, and live camera streams.', level: 'Intermediate', duration: '6 weeks' },
    { title: 'Reinforcement Learning Basics', desc: 'Learn Markov Decision Processes, Q-Learning, policy gradients, and train agents to play Atari games with DQN.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Generative AI & LLM Foundations', desc: 'Explore transformer architecture, self-attention, prompt engineering, and fine-tuning open-source LLMs.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'AI Ethics, Bias & Governance', desc: 'Analyse algorithmic fairness, model interpretability (SHAP, LIME), differential privacy, and EU AI Act requirements.', level: 'Beginner', duration: '3 weeks' },
    { title: 'Knowledge Graphs & Logic Reasoning', desc: 'Build ontologies, query knowledge graphs with SPARQL, implement rule inference, and integrate with Neo4j.', level: 'Advanced', duration: '5 weeks' },
    { title: 'Speech Recognition & Synthesis', desc: 'Process audio with MFCC features, train ASR models, and build TTS pipelines using Whisper and Tacotron2.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Genetic Algorithms & Optimisation', desc: 'Implement evolutionary cycles: selection, crossover, mutation, and solve scheduling and routing problems with GA.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'AI for Robotics Controls', desc: 'Study kinematics, sensor fusion, Kalman filtering, path planning, and feedback control for autonomous robots.', level: 'Advanced', duration: '7 weeks' },
  ],
  'Data Science': [
    { title: 'Python for Data Analysis (Pandas & NumPy)', desc: 'Master DataFrame operations, array computation, merging, groupby, reshaping, and data wrangling with Pandas and NumPy.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Data Visualisation with Matplotlib & Seaborn', desc: 'Create publication-quality charts: histograms, scatter plots, heatmaps, pair plots, and interactive Plotly dashboards.', level: 'Beginner', duration: '3 weeks' },
    { title: 'Statistics & Probability for Analytics', desc: 'Study distributions, hypothesis testing, confidence intervals, ANOVA, and probability theory for data-driven decisions.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'SQL for Data Science & Reports', desc: 'Write advanced aggregations, window functions, CTEs, query optimisation, and integrate SQL with Python analysis.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Data Cleaning & Preprocessing', desc: 'Handle missing values, outliers, inconsistent formats, feature scaling, encoding, and build robust preprocessing pipelines.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Big Data Processing with PySpark', desc: 'Process distributed data with Spark DataFrames, SQL, streaming, and Parquet storage on cluster environments.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Business Intelligence with Tableau', desc: 'Build interactive dashboards, create calculated fields, connect to databases, and publish analytical reports.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Data Storytelling & Reporting', desc: 'Translate analytical findings into clear narratives, choose effective chart types, and build executive-ready reports.', level: 'Beginner', duration: '3 weeks' },
    { title: 'R Programming for Statistical Studies', desc: 'Learn R vectors, data frames, ggplot2 visualisation, statistical modelling, and reproducible research with R Markdown.', level: 'Intermediate', duration: '5 weeks' },
  ],
  'Cybersecurity': [
    { title: 'Introduction to Cybersecurity & Networks', desc: 'Learn the OSI model, TCP/IP, ports, firewalls, packet sniffing with Wireshark, and the CIA triad foundations.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Ethical Hacking: Network Scanning', desc: 'Perform reconnaissance, map networks with Nmap, identify services, and understand penetration testing methodology.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'Cryptography & Data Protection', desc: 'Study symmetric/asymmetric encryption, hashing, TLS, digital signatures, and implement cryptographic protocols.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'Web Application Hacking & OWASP Top 10', desc: 'Find and exploit SQL injection, XSS, IDOR, CSRF vulnerabilities in controlled labs and implement mitigations.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Linux Command Line for Security', desc: 'Master file permissions, user management, log analysis, shell scripting, and network diagnostics on Linux.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Malware Analysis & Reverse Engineering', desc: 'Perform static and dynamic malware analysis, use Ghidra for reverse engineering, and identify indicators of compromise.', level: 'Advanced', duration: '7 weeks' },
    { title: 'Incident Response & Digital Forensics', desc: 'Investigate security incidents, preserve evidence, analyse disk and memory forensics, and write incident reports.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'Cloud Security & IAM Controls', desc: 'Configure VPC security, IAM roles, key rotation, container security, and monitor threats in AWS and Azure environments.', level: 'Advanced', duration: '6 weeks' },
    { title: 'CompTIA Security+ Exam Preparation', desc: 'A comprehensive study guide covering all six Security+ domains: threats, architecture, tools, identity, risk, and cryptography.', level: 'Intermediate', duration: '8 weeks' },
  ],
  'Cloud Computing': [
    { title: 'AWS Cloud Practitioner Essentials', desc: 'Learn core AWS services: EC2, S3, VPC, IAM, RDS, and the Well-Architected Framework for the CCP exam.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Microsoft Azure Core Infrastructure', desc: 'Study Azure VMs, Blob Storage, Active Directory, networking, and resource management for AZ-900 certification.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Google Cloud Platform (GCP) Essentials', desc: 'Learn Compute Engine, Cloud Storage, BigQuery, GKE, and GCP networking for the Associate Cloud Engineer exam.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'Serverless Functions: AWS Lambda', desc: 'Build event-driven applications with Lambda, API Gateway, Step Functions, EventBridge, and S3 triggers.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Kubernetes Container Orchestration', desc: 'Deploy, scale, and manage containerised workloads: Pods, Deployments, Services, Ingress, Helm, and HPA.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Cloud Architecture & Multi-Zone Design', desc: 'Design highly available, fault-tolerant systems with multi-AZ deployments, load balancing, and disaster recovery.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Infrastructure as Code with Terraform', desc: 'Define, plan, and provision cloud infrastructure using HCL, Terraform modules, remote state, and CI/CD integration.', level: 'Advanced', duration: '5 weeks' },
    { title: 'Cloud Storage & CDN Configuration', desc: 'Optimise content delivery with CloudFront, configure cache headers, S3 lifecycle policies, and global edge networks.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Hybrid Cloud & VPN Tunnels', desc: 'Connect on-premises infrastructure to public cloud with VPN tunnels, Direct Connect, and hybrid DNS configurations.', level: 'Advanced', duration: '6 weeks' },
  ],
  'DevOps': [
    { title: 'Docker Containers: Build & Ship', desc: 'Write Dockerfiles, build multi-stage images, use Docker Compose, and implement container security best practices.', level: 'Beginner', duration: '4 weeks' },
    { title: 'CI/CD Pipelines with GitHub Actions', desc: 'Build automated workflows: lint, test, build Docker images, and deploy to AWS/Azure on every commit push.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Ansible Configuration Management', desc: 'Write idempotent playbooks, manage inventories, use roles, Ansible Vault for secrets, and automate server setup.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'Linux Administration for DevOps', desc: 'Manage systemd services, configure networking, write bash scripts, manage users, and troubleshoot Linux servers.', level: 'Beginner', duration: '5 weeks' },
    { title: 'Monitoring with Prometheus & Grafana', desc: 'Scrape metrics, write PromQL queries, build Grafana dashboards, configure alerts, and apply the four golden signals.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'Jenkins Pipeline Masterclass', desc: 'Write declarative Jenkinsfiles, configure agents, manage credentials, integrate webhooks, and deploy artefacts.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Git Version Control Advanced', desc: 'Master interactive rebase, cherry-pick, bisect, hooks, branching strategies, and monorepo management with Git.', level: 'Beginner', duration: '3 weeks' },
    { title: 'Log Management: ELK Stack', desc: 'Index logs in Elasticsearch, transform them with Logstash, ship with Filebeat/Beats, and visualise in Kibana.', level: 'Advanced', duration: '5 weeks' },
    { title: 'Site Reliability Engineering Foundations', desc: 'Learn SLIs, SLOs, error budgets, chaos engineering, blameless postmortems, and toil reduction principles.', level: 'Advanced', duration: '6 weeks' },
  ],
  'UI/UX Design': [
    { title: 'Figma Web & Mobile Prototyping', desc: 'Master Figma frames, Auto Layout, components, variants, interactive prototyping, and handoff to developers.', level: 'Beginner', duration: '5 weeks' },
    { title: 'UX Research & User Personas', desc: 'Conduct user interviews, analyse survey data, build personas, create empathy maps, and journey maps.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Wireframing & Information Architecture', desc: 'Build low-fidelity wireframes, design site maps, define navigation trees, and validate IA with card sorting.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Typography, Grid Systems & Color Theory', desc: 'Apply typographic hierarchy, 8pt grids, colour palettes, contrast ratios, and accessibility guidelines in designs.', level: 'Beginner', duration: '3 weeks' },
    { title: 'Mobile UI Patterns & Interaction Design', desc: 'Learn platform-specific patterns, gesture affordances, touch targets, bottom navigation, and modal flows.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Design Systems Creation & Scaling', desc: 'Build component libraries, define design tokens, write documentation, and maintain a scalable design system.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Usability Testing & Feedback Loops', desc: 'Plan and run moderated usability tests, analyse heatmaps, interpret SUS scores, and apply findings to iterations.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Landing Page Conversion UX', desc: 'Design high-converting landing pages: above-the-fold messaging, CTA placement, trust signals, and A/B testing.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Animation & Micro-interactions in Figma', desc: 'Create Smart Animate transitions, hover effects, scroll animations, toggle loops, and motion design principles.', level: 'Advanced', duration: '4 weeks' },
  ],
  'Database Management': [
    { title: 'SQL Fundamentals & Relational Schema', desc: 'Design normalised schemas, define primary/foreign keys, write SELECT queries, and understand ACID transactions.', level: 'Beginner', duration: '4 weeks' },
    { title: 'MongoDB Atlas: NoSQL Documents', desc: 'Create collections, design document schemas, write aggregation pipelines, and manage Atlas clusters.', level: 'Beginner', duration: '4 weeks' },
    { title: 'PostgreSQL Database Administration', desc: 'Configure connections, optimise queries, set up streaming replication, backup with pg_dump, and write triggers.', level: 'Intermediate', duration: '6 weeks' },
    { title: 'SQL Joins, Subqueries & Indexes', desc: 'Master INNER, LEFT, and FULL JOINs, correlated subqueries, CTEs, B-tree indexes, and EXPLAIN plans.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'Redis: Caching & Key-Value Operations', desc: 'Configure Redis, use strings, hashes, sorted sets, set expiry, implement pub/sub, and design cache strategies.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Database Security & Role Controls', desc: 'Configure user roles, encrypt sensitive columns, prevent SQL injection, set up SSL, and audit database access.', level: 'Advanced', duration: '5 weeks' },
    { title: 'Graph Databases with Neo4j', desc: 'Model data as graphs, write Cypher queries, run graph algorithms, and build recommendation engines with Neo4j.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Database Replication & Sharding', desc: 'Design read replicas, configure streaming replication, shard MongoDB with range and hash strategies, and handle failover.', level: 'Advanced', duration: '6 weeks' },
    { title: 'ORM with Mongoose & Prisma', desc: 'Define Mongoose schemas and Prisma models, handle migrations, avoid N+1 queries, and integrate with Node.js backends.', level: 'Intermediate', duration: '4 weeks' },
  ],
  'Aptitude & Interview Preparation': [
    { title: 'Quantitative Aptitude Foundations', desc: 'Master percentages, ratios, time-work, SI/CI, profit-loss, and number systems for campus placement tests.', level: 'Beginner', duration: '6 weeks' },
    { title: 'Logical Reasoning & Puzzle Solving', desc: 'Solve seating arrangements, syllogisms, blood relations, direction problems, and series pattern questions.', level: 'Beginner', duration: '5 weeks' },
    { title: 'Resume Building & LinkedIn SEO', desc: 'Write achievement-focused bullets (XYZ formula), optimise LinkedIn for recruiter discovery, and structure your portfolio.', level: 'Beginner', duration: '3 weeks' },
    { title: 'Behavioural Interviews (STAR Method)', desc: 'Structure behavioural answers, prepare stories for leadership, conflict, failure, and teamwork questions.', level: 'Beginner', duration: '3 weeks' },
    { title: 'System Design Fundamentals', desc: 'Design scalable APIs, choose database types, plan caching layers, load balancers, and CDN configurations.', level: 'Intermediate', duration: '6 weeks' },
    { title: 'Advanced System Design: Message Queues', desc: 'Deep dive into Kafka, RabbitMQ, event sourcing, CQRS, and designing fault-tolerant distributed systems.', level: 'Advanced', duration: '6 weeks' },
    { title: 'Coding Interview Whiteboard Practice', desc: 'Practice talking through algorithms, writing clean code on whiteboards, and handling interviewer follow-up questions.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'Data Interpretation: Graphs & Tables', desc: 'Analyse bar charts, line graphs, pie charts, and data tables to answer DI questions quickly and accurately.', level: 'Beginner', duration: '4 weeks' },
    { title: 'HR Round & Salary Negotiation', desc: 'Handle offer negotiations, understand total compensation, ask the right questions, and manage counter-offers.', level: 'Beginner', duration: '3 weeks' },
  ],
  'Blockchain & Web3': [
    { title: 'Blockchain Basics & Cryptography', desc: 'Understand distributed ledgers, Merkle trees, Proof of Work vs Stake, wallets, and public-private key cryptography.', level: 'Beginner', duration: '4 weeks' },
    { title: 'Ethereum & Solidity Smart Contracts', desc: 'Write, test, and deploy Solidity contracts: state variables, functions, events, mappings, and gas optimisation.', level: 'Intermediate', duration: '6 weeks' },
    { title: 'Web3.js & Ethers.js Integration', desc: 'Connect React dApps to Ethereum: MetaMask integration, contract calls, event listening, and transaction signing.', level: 'Intermediate', duration: '5 weeks' },
    { title: 'DeFi Protocol Architecture', desc: 'Study AMMs, liquidity pools, lending protocols (Aave/Compound), flash loans, and DeFi security risks.', level: 'Advanced', duration: '6 weeks' },
    { title: 'NFT Minting Contracts (ERC-721/ERC-1155)', desc: 'Build NFT collections: write ERC-721 contracts, generate metadata, deploy to testnet, and list on OpenSea.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Solidity Security & Smart Contract Audits', desc: 'Identify reentrancy, overflow, access control flaws; use Slither, Mythx, and OpenZeppelin security patterns.', level: 'Advanced', duration: '6 weeks' },
    { title: 'DAO Governance & Multi-Sig Wallets', desc: 'Build on-chain governance systems, voting contracts, token delegation, timelocks, and Gnosis Safe multi-sig.', level: 'Advanced', duration: '5 weeks' },
    { title: 'IPFS Storage & Decentralised Web', desc: 'Store NFT metadata and web assets on IPFS, pin with Pinata, host decentralised sites, and integrate with contracts.', level: 'Intermediate', duration: '4 weeks' },
    { title: 'Rust & Solana Smart Programs', desc: 'Learn Solana accounts model, write Anchor programs, deploy programs, handle PDAs, and run integration tests.', level: 'Advanced', duration: '6 weeks' },
  ],
};

// ─── MENTOR DEFINITIONS (10 mentors) ──────────────────────────────────────────
const MENTOR_DATA = [
  {
    name: 'Dr. Sarah Jenkins',
    email: 'sarah@learnplus.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
    bio: 'Ph.D. in Computer Science from MIT with 12 years of teaching and industry experience. Former principal engineer at a Fortune 500 tech company specialising in distributed systems and cloud-native architecture.',
    skills: ['React', 'Node.js', 'TypeScript', 'Docker', 'Kubernetes', 'AWS'],
    expertise: ['Web Development'],
    socialLinks: { website: 'https://sarahjenkins.dev', linkedin: 'https://linkedin.com/in/sarahjenkins', github: 'https://github.com/sarahj' },
  },
  {
    name: 'Prof. Alex Mercer',
    email: 'alex@learnplus.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    bio: 'Senior ML researcher and AI consultant with publications in NeurIPS and ICML. Previously an AI engineer at a leading search company working on large-scale recommendation systems.',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'SQL', 'Spark'],
    expertise: ['Machine Learning', 'Artificial Intelligence'],
    socialLinks: { linkedin: 'https://linkedin.com/in/alexmercer', github: 'https://github.com/alexm', twitter: 'https://twitter.com/alexm_ai' },
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya@learnplus.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1573496799515-eebbb63814f2?w=150&auto=format&fit=crop',
    bio: 'Certified Ethical Hacker (CEH) and CISSP with a Ph.D. in Information Security. Led incident response teams at a global bank and consulted on red team exercises for government agencies.',
    skills: ['Penetration Testing', 'Forensics', 'Cryptography', 'Linux', 'Network Security', 'SIEM'],
    expertise: ['Cybersecurity'],
    socialLinks: { linkedin: 'https://linkedin.com/in/priyasec', twitter: 'https://twitter.com/priyacyber' },
  },
  {
    name: 'Mr. James Williams',
    email: 'james@learnplus.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop',
    bio: 'Lead mobile developer and UX designer with 10 years of experience shipping apps for iOS and Android. Passionate about accessible, delightful user experiences on small screens.',
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Figma', 'Firebase'],
    expertise: ['App Development'],
    socialLinks: { github: 'https://github.com/jwilliamsdev', linkedin: 'https://linkedin.com/in/jameswilliamsux' },
  },
  {
    name: 'Dr. Emily Chen',
    email: 'emily@learnplus.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop',
    bio: 'Ph.D. in Computer Science specialising in algorithm design and competitive programming. Two-time ACM-ICPC World Finals participant and programming olympiad coach for university teams.',
    skills: ['C++', 'Java', 'Python', 'Algorithm Design', 'Competitive Programming', 'TypeScript'],
    expertise: ['Programming Languages'],
    socialLinks: { github: 'https://github.com/emilychen', linkedin: 'https://linkedin.com/in/emilychencs' },
  },
  {
    name: 'Prof. Michael Brown',
    email: 'michael@learnplus.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
    bio: 'Blockchain researcher and Web3 entrepreneur with 7 years in DeFi protocol design. Smart contract auditor and co-founder of a blockchain infrastructure startup focused on Layer 2 solutions.',
    skills: ['Solidity', 'Rust', 'Ethereum', 'Solana', 'Web3.js', 'Ethers.js', 'IPFS'],
    expertise: ['Blockchain & Web3', 'Data Structures & Algorithms'],
    socialLinks: { github: 'https://github.com/michaelbrown', twitter: 'https://twitter.com/mbrown_web3' },
  },
  {
    name: 'Ms. Rachel Green',
    email: 'rachel@learnplus.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    bio: 'Career coach and placement consultant with 500+ students placed at top tech firms globally. Previously a Google recruiter and FAANG interview preparation specialist with a focus on soft skills.',
    skills: ['Interview Coaching', 'Resume Writing', 'System Design', 'Quantitative Aptitude', 'Communication'],
    expertise: ['Aptitude & Interview Preparation'],
    socialLinks: { linkedin: 'https://linkedin.com/in/rachelgreen', website: 'https://rachelgreen.coach' },
  },
  {
    name: 'Dr. Carlos Reyes',
    email: 'carlos@learnplus.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop',
    bio: 'Database architect and DevOps practitioner with expertise in large-scale data systems. Contributed to open-source PostgreSQL extensions and designed data pipelines processing billions of daily events.',
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Kafka', 'Docker', 'Ansible', 'Python'],
    expertise: ['Database Management', 'Data Science'],
    socialLinks: { github: 'https://github.com/carlosreyes', linkedin: 'https://linkedin.com/in/carlosreyes' },
  },
  {
    name: 'Mr. David Miller',
    email: 'david@learnplus.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    bio: 'Lead Cloud Infrastructure Engineer with 10 years of experience designing and managing AWS and Azure environments. Kubernetes certified administrator (CKA) and DevOps promoter.',
    skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'Docker', 'Jenkins', 'Linux'],
    expertise: ['Cloud Computing', 'DevOps'],
    socialLinks: { github: 'https://github.com/davidmillerdev', linkedin: 'https://linkedin.com/in/davidmiller' },
  },
  {
    name: 'Ms. Elena Rostova',
    email: 'elena@learnplus.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop',
    bio: 'Senior Product Designer with 8 years of design agency and startup experience. Specialises in design systems, high-fidelity interactive prototyping, Figma workflows, and cognitive-based UX research.',
    skills: ['Figma', 'Sketch', 'UI Design', 'UX Research', 'Prototyping', 'Wireframing', 'Typography'],
    expertise: ['UI/UX Design'],
    socialLinks: { linkedin: 'https://linkedin.com/in/elenarostova', website: 'https://elenadesign.co' },
  },
];

// ─── ASSIGN MENTORS TO CATEGORIES (Balanced among 10 mentors) ────────────────
const CATEGORY_MENTOR_MAP = {
  'Web Development': 'sarah@learnplus.com',
  'App Development': 'james@learnplus.com',
  'Programming Languages': 'emily@learnplus.com',
  'Data Structures & Algorithms': 'michael@learnplus.com',
  'Machine Learning': 'alex@learnplus.com',
  'Artificial Intelligence': 'alex@learnplus.com',
  'Data Science': 'carlos@learnplus.com',
  'Cybersecurity': 'priya@learnplus.com',
  'Cloud Computing': 'david@learnplus.com',
  'DevOps': 'david@learnplus.com',
  'UI/UX Design': 'elena@learnplus.com',
  'Database Management': 'carlos@learnplus.com',
  'Aptitude & Interview Preparation': 'rachel@learnplus.com',
  'Blockchain & Web3': 'michael@learnplus.com',
};

// ─── SPECIFIC COURSE THUMBNAIL GETTER ─────────────────────────────────────────
const getThumbnailForCourse = (title, category) => {
  const t = title.toLowerCase();
  
  if (t.includes('html5') || t.includes('html & css') || t.includes('css3')) 
    return 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop';
  if (t.includes('tailwind')) 
    return 'https://blog.nashtechglobal.com/wp-content/uploads/2025/08/O-que-e-Tailwind-CSS-e-por-que-ele-virou-tendencia-no-front-end_-Programadores-Depre-Programacao-e-Tecnologia.jpeg';
  if (t.includes('react native')) 
    return 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop';
  if (t.includes('react.js') || t.includes('react js') || t.includes('react stack')) 
    return 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop';
  if (t.includes('next.js') || t.includes('nextjs')) 
    return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop';
  if (t.includes('node.js') || t.includes('express.js') || t.includes('backend')) 
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop';
  if (t.includes('mern')) 
    return 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop';
  if (t.includes('graphql')) 
    return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop';
  if (t.includes('seo') || t.includes('performance')) 
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop';
  if (t.includes('javascript') || t.includes('js')) 
    return 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop';
    
  if (t.includes('flutter')) 
    return 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop';
  if (t.includes('swiftui') || t.includes('ios')) 
    return 'https://images.unsplash.com/photo-1568952433726-3896e3881c65?w=800&auto=format&fit=crop';
  if (t.includes('kotlin') || t.includes('android')) 
    return 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop';
  if (t.includes('firebase')) 
    return 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=800&auto=format&fit=crop';
  if (t.includes('ionic')) 
    return 'https://images.unsplash.com/photo-1551836022-4196f3f2e739?w=800&auto=format&fit=crop';
  if (t.includes('mobile ux') || t.includes('mobile-first')) 
    return 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop';

  if (t.includes('c programming')) 
    return 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop';
  if (t.includes('c++') || t.includes('cpp') || t.includes('object-oriented')) 
    return 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop';
  if (t.includes('java')) 
    return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop';
  if (t.includes('python')) 
    return 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=800&auto=format&fit=crop';
  if (t.includes('go lang') || t.includes('golang') || t.includes('go ')) 
    return 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop';
  if (t.includes('rust')) 
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop';
  if (t.includes('typescript')) 
    return 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop';
  if (t.includes('sql') || t.includes('querying') || t.includes('relational') || t.includes('postgresql') || t.includes('postgres')) 
    return 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop';

  if (t.includes('dynamic programming') || t.includes('dp')) 
    return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop';
  if (t.includes('graph') || t.includes('mst') || t.includes('dijkstra')) 
    return 'https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800&auto=format&fit=crop';
  if (t.includes('dsa') || t.includes('data structures') || t.includes('algorithms') || t.includes('sorting') || t.includes('searching') || t.includes('stack') || t.includes('queue') || t.includes('tree') || t.includes('array')) 
    return 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&auto=format&fit=crop';

  if (t.includes('regression') || t.includes('decision trees') || t.includes('random forests') || t.includes('clustering') || t.includes('svm') || t.includes('machine learning') || t.includes('ml')) 
    return 'https://images.unsplash.com/photo-1527430253228-e93688616381?w=800&auto=format&fit=crop';
  if (t.includes('deep learning') || t.includes('neural networks') || t.includes('neural')) 
    return 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&auto=format&fit=crop';
  if (t.includes('nlp') || t.includes('natural language')) 
    return 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop';
  if (t.includes('forecasting') || t.includes('time series')) 
    return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop';
  if (t.includes('mlops')) 
    return 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop';

  if (t.includes('generative ai') || t.includes('llm') || t.includes('transformer')) 
    return 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop';
  if (t.includes('computer vision') || t.includes('opencv') || t.includes('images')) 
    return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop';
  if (t.includes('reinforcement')) 
    return 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop';
  if (t.includes('robotics')) 
    return 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop';
  if (t.includes('speech recognition') || t.includes('speech')) 
    return 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&auto=format&fit=crop';
  if (t.includes('ai ') || t.includes('artificial intelligence') || t.includes('search systems')) 
    return 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop';

  if (t.includes('pandas') || t.includes('numpy') || t.includes('data analysis')) 
    return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop';
  if (t.includes('visualisation') || t.includes('seaborn') || t.includes('matplotlib') || t.includes('plotly')) 
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop';
  if (t.includes('statistics') || t.includes('probability')) 
    return 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop';
  if (t.includes('tableau') || t.includes('bi ') || t.includes('business intelligence')) 
    return 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&auto=format&fit=crop';
  if (t.includes('big data') || t.includes('spark') || t.includes('pyspark')) 
    return 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&auto=format&fit=crop';
  if (t.includes('data science') || t.includes('r programming') || t.includes('cleaning') || t.includes('storytelling')) 
    return 'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=800&auto=format&fit=crop';

  if (t.includes('cryptography') || t.includes('data protection')) 
    return 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&auto=format&fit=crop';
  if (t.includes('ethical hacking') || t.includes('scanning') || t.includes('penetration')) 
    return 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&auto=format&fit=crop';
  if (t.includes('malware') || t.includes('reverse engineering')) 
    return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop';
  if (t.includes('incident response') || t.includes('forensics')) 
    return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop';
  if (t.includes('cybersecurity') || t.includes('networks') || t.includes('comptia') || t.includes('security+')) 
    return 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop';

  if (t.includes('aws') || t.includes('amazon')) 
    return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop';
  if (t.includes('azure')) 
    return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop';
  if (t.includes('gcp') || t.includes('google cloud')) 
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop';
  if (t.includes('kubernetes')) 
    return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop';
  if (t.includes('terraform')) 
    return 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=800&auto=format&fit=crop';
  if (t.includes('serverless') || t.includes('lambda')) 
    return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop';
  if (t.includes('cloud')) 
    return 'https://images.unsplash.com/photo-1606765962248-7ff407b51667?w=800&auto=format&fit=crop';

  if (t.includes('docker') || t.includes('containers')) 
    return 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop';
  if (t.includes('ci/cd') || t.includes('github actions') || t.includes('jenkins')) 
    return 'https://images.unsplash.com/photo-1617042375876-a13e36732a04?w=800&auto=format&fit=crop';
  if (t.includes('ansible')) 
    return 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop';
  if (t.includes('prometheus') || t.includes('grafana') || t.includes('monitoring')) 
    return 'https://images.unsplash.com/photo-1547586696-ea80fcd9b838?w=800&auto=format&fit=crop';
  if (t.includes('git ') || t.includes('version control')) 
    return 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&auto=format&fit=crop';
  if (t.includes('elk stack') || t.includes('log management')) 
    return 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop';
  if (t.includes('devops') || t.includes('sre') || t.includes('reliability') || t.includes('linux administration')) 
    return 'https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?w=800&auto=format&fit=crop';

  if (t.includes('figma') || t.includes('prototyping')) 
    return 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop';
  if (t.includes('ux research') || t.includes('personas') || t.includes('usability')) 
    return 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=800&auto=format&fit=crop';
  if (t.includes('wireframing') || t.includes('information architecture')) 
    return 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&auto=format&fit=crop';
  if (t.includes('design systems') || t.includes('color theory') || t.includes('typography') || t.includes('grid')) 
    return 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop';
  if (t.includes('ui/ux') || t.includes('ui ') || t.includes('interaction') || t.includes('landing page')) 
    return 'https://images.unsplash.com/photo-158655146-9f40138edfeb?w=800&auto=format&fit=crop';

  if (t.includes('mongodb') || t.includes('nosql')) 
    return 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop';
  if (t.includes('redis') || t.includes('caching')) 
    return 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&auto=format&fit=crop';
  if (t.includes('neo4j') || t.includes('graph database')) 
    return 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&auto=format&fit=crop';
  if (t.includes('database') || t.includes('replication') || t.includes('sharding') || t.includes('orm') || t.includes('mongoose') || t.includes('prisma')) 
    return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop';

  if (t.includes('aptitude') || t.includes('quantitative') || t.includes('logical reasoning') || t.includes('puzzle')) 
    return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop';
  if (t.includes('system design')) 
    return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop';
  if (t.includes('interview') || t.includes('resume') || t.includes('behavioural') || t.includes('hr round') || t.includes('salary')) 
    return 'https://images.unsplash.com/photo-1551836022-8b2858c9c69b?w=800&auto=format&fit=crop';

  if (t.includes('solidity') || t.includes('smart contracts') || t.includes('nft') || t.includes('defi')) 
    return 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=800&auto=format&fit=crop';
  if (t.includes('blockchain') || t.includes('web3') || t.includes('dapps') || t.includes('ipfs') || t.includes('solana') || t.includes('cryptography')) 
    return 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop';

  return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop'; // default fallback
};

// ─── SPECIFIC COURSE VIDEO GETTER ─────────────────────────────────────────────
// Returns an array of possible YouTube video IDs for syllabus sections,
// and also provides per-course deterministic crash video selection.
const getVideosByTitle = (title, category) => {
  const t = (title || '').toLowerCase();

  // Keep your existing category/title mapping of *candidates*.
  // We then rotate/pick based on the course title so different course titles
  // get different crash videos (instead of always using [0]).
  let candidates = null;

  const pick = (arr) => {
    candidates = arr;
    return candidates;
  };

  if (t.includes('react native')) return pick(['JKccS9k56_I&t=281s']);
  if (t.includes('react')) return pick(['0-S5a0eXPoc']);
  if (t.includes('html') || t.includes('css')) return pick(['HBqWsrqK89U']);
  if( t.includes('tailwind')) return pick(['BTyDQRil9s4']);
  if (t.includes('next.js') || t.includes('nextjs')) return pick(['XsVGeLbMxLk']);
  if (t.includes('javascript') || t.includes('js')) return pick(['VlPiVmYuoqw']);
  if (t.includes('node') || t.includes('express')) return pick(['PCcMF1xTQO0']);
  if (t.includes('mern')) return pick(['cOcsecRATdc']);
  if (t.includes('graphql')) return pick(['Hu80zSSSpAo']);
  if (t.includes('seo') || t.includes('performance')) return pick(['tqL5OOTycMo']);

  if (t.includes('flutter')) return pick(['56xvk6OHTpM']);
  if (t.includes('swift') || t.includes('ios')) return pick(['II7WcnHVG4U']);
  if (t.includes('kotlin') || t.includes('android')) return pick(['dzUc9vrsldM']);
  if (t.includes('firebase')) return pick(['fgdpvwEWJ9M']);
  if (t.includes('ionic')) return pick(['kR-Bms4r4ec']);

  if (t.includes('c programming')) return pick(['irqbmMNs2Bo']);
  if (t.includes('c++') || t.includes('cpp')) return pick(['ZzaPdXTrSb8']);
  if (t.includes('java')) return pick(['eIrMbAQSU34']);
  if (t.includes('python')) return pick(['UrsmFxEIp5k&t=29738s']);
  if (t.includes('go lang') || t.includes('golang')) return pick(['yZgwW6Yuc_E']);
  if (t.includes('rust')) return pick(['Jcbh07P0jHU']);
  if (t.includes('typescript')) return pick(['kvP6hDXWy88']);
  if (t.includes('sql') || t.includes('query')) return pick(['yE6tIle64tU']);

  if (t.includes('dynamic programming') || t.includes('dp')) return pick(['oBt53YbR9Kk']);
  if (
    t.includes('dsa') ||
    t.includes('structures') ||
    t.includes('algorithms') ||
    t.includes('graphs') ||
    t.includes('sorting') ||
    t.includes('stack') ||
    t.includes('tree')
  ) {
    return pick(['GRxzQXBwA-U', '4_HOnhB64Dg']);
  }

  if (t.includes('neural') || t.includes('deep learning')) return pick(['d2kxUVwWWwU&t=869s']);
  if (t.includes('machine learning') || t.includes('ml') || t.includes('regression')) return pick(['AzblgZNoBWw']);
  if (t.includes('generative ai') || t.includes('llm')) return pick(['0xm0VZNjIsg']);
  if (t.includes('computer vision') || t.includes('opencv')) return pick(['yQu_3e7MAr0']);
  if (t.includes('ethics')) return pick(['qikz6PasTQg']);
  if (t.includes('ai ') || t.includes('artificial')) return pick(['D1eL1EnxXXQ']);

  if (t.includes('pandas') || t.includes('numpy') || t.includes('data analysis')) return pick(['GPVsHOlRBBI']);
  if (t.includes('visualisation') || t.includes('visual')) return pick(['kM_eVEEWfnE']);
  if (t.includes('tableau')) return pick(['GbszEsOY3wo']);
  if (t.includes('statistics') || t.includes('probability')) return pick(['H52cgidTwXE']);
  if (t.includes('spark') || t.includes('big data')) return pick(['H5SHmiKTFsM']);
  if (t.includes('data science') || t.includes('r programming')) return pick(['ckdHNu4kfL0']);

  if (t.includes('cybersecurity') || t.includes('network')) return pick(['lpa8uy4DyMo']);
  if (t.includes('cryptography')) return pick(['C7vmouDOJYM']);
  if (t.includes('ethical hacking') || t.includes('scanning') || t.includes('penetration')) return pick(['fNzpcB7ODxQ']);
  if (t.includes('linux')) return pick(['e01GGTKmtpc']);
  if (t.includes('malware') || t.includes('reverse')) return pick(['8_E23W_3cBE']);

  if (t.includes('aws') || t.includes('amazon')) return pick(['N4sJj-SxX00']);
  if (t.includes('azure')) return pick(['iy_5g5lYY7s']);
  if (t.includes('gcp') || t.includes('google cloud')) return pick(['lvZk_sc8u5I']);
  if (t.includes('kubernetes')) return pick(['7GaJr7frB1o']);
  if (t.includes('terraform')) return pick(['S9mohJI_R34']);

  if (t.includes('docker')) return pick(['exmSJpJvIPs']);
  if (t.includes('git')) return pick(['Ez8F0nW6S-w']);
  if (t.includes('jenkins')) return pick(['XaSdKR2fOU4']);
  if (t.includes('prometheus') || t.includes('monitoring')) return pick(['i-_n7ee_u2E']);
  if (t.includes('devops') || t.includes('ansible') || t.includes('sre')) return pick(['Tq0vZU7Hp_M', '4GwafiGsTUM']);

  if (t.includes('figma')) return pick(['1SNZRCVNizg']);
  if (t.includes('ux') || t.includes('ui') || t.includes('design') || t.includes('wireframing') || t.includes('typography')) {
    return pick(['truRwcI7-kg', 'c9Wg6Cb_YlU']);
  }

  if (t.includes('postgresql') || t.includes('postgres')) return pick(['qw--VYLpxG4']);
  if (t.includes('mongodb') || t.includes('nosql')) return pick(['c2M-rlkkT5o']);
  if (t.includes('redis')) return pick(['Vx2zPMPvmug']);
  if (t.includes('database') || t.includes('relational') || t.includes('schema') || t.includes('neo4j') || t.includes('orm')) {
    return pick(['NdeeSEknp58', '_IgbB24scLI']);
  }

  if (t.includes('aptitude') || t.includes('quantitative') || t.includes('reasoning')) return pick(['d2HgA_s42cU', '6mUxR-ON4Iw']);
  if (t.includes('system design')) return pick(['Vnm-ycSfJx4']);
  if (t.includes('interview') || t.includes('resume') || t.includes('negotiation') || t.includes('behavioural')) {
    return pick(['eyI5WkbSckI', 'KZehm-meGMg']);
  }

  if (t.includes('solidity') || t.includes('smart contracts') || t.includes('ethereum')) return pick(['AYpftDFiIgk']);
  if (t.includes('blockchain') || t.includes('web3') || t.includes('defi') || t.includes('nft') || t.includes('dapps')) {
    return pick(['CgXQC4dbGUE', 'Wn_Kb3MR_cU']);
  }

  // Fallback using category
  const cat = (category || '').toLowerCase();
  if (cat.includes('web')) return pick(['F4zr1aMevB4', 'Q33KBiDriJY']);
  if (cat.includes('app') || cat.includes('mobile')) return pick(['BCSlZIUj18Y', 'uEhmQd0Z1CA']);
  if (cat.includes('language')) return pick(['XnSasPR2KJI', '427pAhy9dI8']);
  if (cat.includes('structure') || cat.includes('algorithm')) return pick(['4_HOnhB64Dg&t=1s', 'm3fg2PRY1u4&list=PLqM7alHXFySGwOTADxwHrgH8m_XpgrB-k']);
  if (cat.includes('machine') || cat.includes('learning')) return pick(['LvC68w9JS4Y', 'i_LwzRVP7bg']);
  if (cat.includes('intelligence') || cat.includes('ai')) return pick(['D1eL1EnxXXQ&t=98s', 'y39OlGrVFD8']);
  if (cat.includes('science')) return pick(['HrRA67O-QXI&t=2098s', 'KZgd2UiapE0']);
  if (cat.includes('cyber') || cat.includes('security')) return pick(['9HOpanT0GRs', 'WO7wP3QaJ_g']);
  if (cat.includes('cloud')) return pick(['FUcTTV8GQg8', 'E-bNlmja0j8']);
  if (cat.includes('devops')) return pick(['YzwD02ImKY4', 'JHoy3lDZOfY']);
  if (cat.includes('design') || cat.includes('ux') || cat.includes('ui')) return pick(['truRwcI7-kg&t=14s', '7m9OJRRPsZ8']);
  if (cat.includes('database')) return pick(['KWkm1Gip4j4', 'pPqazMTzNOM']);
  if (cat.includes('aptitude') || cat.includes('interview')) return pick(['rRABH8uiGDU', 'zIm_k9j0C50']);
  if (cat.includes('blockchain') || cat.includes('web3')) return pick(['zi0iR3UN-u0', 'BDCT6TYLYdI']);

 
};

// ─── SYLLABUS GENERATOR (Generates real YouTube video urls) ───────────────────
const generateSyllabus = (category, courseTitle) => {
  const pool = THEORY_POOLS[category] || THEORY_POOLS['Web Development'];
  const totalWeeks = 4;
  const syllabus = [];

  const weekTitles = [
    'Foundations & Core Concepts',
    'Intermediate Techniques & Patterns',
    'Advanced Applications & Best Practices',
    'Projects, Integration & Real-World Scenarios',
  ];

  const lessonTitles = [
    ['Introduction & Core Theory', 'Key Concepts In-Depth', 'Practical Exercises & Problem Solving'],
    ['Advanced Patterns & Methods', 'Implementation Details', 'Case Studies & Applications'],
    ['Professional Techniques', 'Optimisation Strategies', 'Code Review & Refactoring'],
    ['Capstone Project Planning', 'Project Build & Implementation', 'Final Review & Best Practices'],
  ];

  const videoIds = getVideosByTitle(courseTitle, category);

  for (let w = 0; w < totalWeeks; w++) {
    const weekPool = pool[w] || pool[pool.length - 1];
    const lessons = [];

    for (let l = 0; l < 3; l++) {
      const theoryData = weekPool[l] || weekPool[weekPool.length - 1];
      const videoId = videoIds[(w * 3 + l) % videoIds.length];
      const startSec = (w * 3 + l) * 240; // separate sections of the tutorial video
      const videoUrl = `https://www.youtube.com/embed/${videoId}?start=${startSec}`;
      
      lessons.push({
        title: lessonTitles[w][l],
        duration: `${12 + l * 5} mins`,
        description: `Comprehensive study of ${courseTitle.toLowerCase()} focusing on practical and theoretical aspects.`,
        theoryContent: theoryData,
        videoUrl,
        order: l,
      });
    }

    syllabus.push({
      week: w + 1,
      title: `Week ${w + 1}: ${weekTitles[w]}`,
      description: `This week builds on previous knowledge to explore ${courseTitle} with increasing depth and practical application.`,
      lessons,
    });
  }

  return syllabus;
};

// ─── MAIN SEED FUNCTION ───────────────────────────────────────────────────────
const seedData = async () => {
  try {
    await connectDB();

    // Clear all collections
    console.log('🗑️  Clearing existing records...');
    await User.deleteMany();
    await Course.deleteMany();
    await Blog.deleteMany();
    await Enrollment.deleteMany();
    await Certificate.deleteMany();

    // ── Create Mentors ─────────────────────────────────────────────────────
    console.log('👨‍🏫  Seeding 10 mentor accounts...');
    const mentorUserMap = {};

    for (const m of MENTOR_DATA) {
      const created = await User.create({ ...m, role: 'mentor' });
      mentorUserMap[m.email] = created;
    }
    console.log('   ✅  Mentors created');

    // ── Create Demo Student ────────────────────────────────────────────────
    console.log('🎓  Seeding demo student account...');
    const studentUser = await User.create({
      name: 'Jane Doe',
      email: 'student@learnplus.com',
      password: 'password123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop',
      bio: 'CS student passionate about full-stack development and data analytics. Love building side projects and contributing to open source.',
      skills: ['HTML', 'CSS', 'Basic JavaScript'],
    });

    // ── Create Courses ──────────────────────────────────────────────────────
    console.log('📚  Seeding courses (~126 total across 14 categories)...');
    const allCourseIds = [];
    const mentorCourseMap = {}; // email → [courseIds]

    for (const category of CATEGORIES) {
      const templates = COURSE_TEMPLATES[category];
      if (!templates) continue;

      const mentorEmail = CATEGORY_MENTOR_MAP[category];
      const mentorDoc = mentorUserMap[mentorEmail];
      if (!mentorDoc) continue;

      const thumbnails = CATEGORY_THUMBNAILS[category] || [];

      for (let i = 0; i < templates.length; i++) {
        const temp = templates[i];
        const thumbnail = getThumbnailForCourse(temp.title, category);
        const syllabus = generateSyllabus(category, temp.title);

        const course = new Course({
          title: temp.title,
          description: `${temp.desc} This comprehensive free course is structured for ${temp.level.toLowerCase()} learners and includes detailed theory, practical exercises, and real-world projects. Each week builds on the previous, providing a structured path from fundamentals to advanced implementation.`,
          shortDescription: temp.desc,
          thumbnail,
          category,
          level: temp.level,
          duration: temp.duration,
          mentor: mentorDoc._id,
          syllabus,
          // Course-level unique crash course video (choose one of the category-matched video IDs)
          crashCourse: {
            videoUrl: `https://www.youtube.com/embed/${getVideosByTitle(temp.title, category)[0]}?start=0`,
            title: `${temp.title} Crash Course`,
          },
          learningOutcomes: [

            `Gain solid understanding of ${temp.title} core principles and architecture`,
            `Apply practical ${category.toLowerCase()} skills to real-world projects`,
            `Follow industry best practices and professional coding standards`,
            `Diagnose and resolve common errors using systematic debugging techniques`,
          ],
          prerequisites: [
            'Basic understanding of computing concepts and workflows',
            'A code editor (VS Code recommended) installed on your machine',
            'Dedication to practise concepts between lessons',
          ],
          tags: [category, temp.level, temp.title.split(' ')[0]],
          isFree: true,
          isPublished: true,
          isFeatured: i === 0,
          totalEnrolled: Math.floor(Math.random() * 500) + 50,
          averageRating: Math.round((4.0 + Math.random() * 1.0) * 10) / 10,
        });

        course.ratings = [
          {
            user: studentUser._id,
            rating: Math.floor(Math.random() * 2) + 4,
            review: 'Excellent explanations! The structured theory slides made every concept clear and easy to follow. Highly recommend.',
          },
        ];

        await course.save();
        allCourseIds.push(course._id);

        if (!mentorCourseMap[mentorEmail]) mentorCourseMap[mentorEmail] = [];
        mentorCourseMap[mentorEmail].push(course._id);
      }
    }

    // Update mentor createdCourses arrays
    for (const email of Object.keys(mentorCourseMap)) {
      await User.findByIdAndUpdate(mentorUserMap[email]._id, {
        createdCourses: mentorCourseMap[email],
      });
    }
    console.log(`   ✅  ${allCourseIds.length} courses created`);

    // ── Enroll Student in 3 Courses ────────────────────────────────────────
    console.log('📝  Enrolling demo student in 3 courses...');
    const enrolledIds = [allCourseIds[0], allCourseIds[10], allCourseIds[20]];

    for (const cId of enrolledIds) {
      const isCompleted = cId === enrolledIds[2];
      const completedLessons = isCompleted
        ? Array.from({ length: 12 }, () => ({ lessonId: new mongoose.Types.ObjectId() }))
        : [{ lessonId: new mongoose.Types.ObjectId() }, { lessonId: new mongoose.Types.ObjectId() }];

      const enr = await Enrollment.create({
        student: studentUser._id,
        course: cId,
        progress: isCompleted ? 100 : 30,
        completedLessons,
        completedAt: isCompleted ? new Date() : null,
        certificateIssued: isCompleted,
      });

      await User.findByIdAndUpdate(studentUser._id, { $push: { enrolledCourses: cId } });
      await Course.findByIdAndUpdate(cId, { $push: { enrolledStudents: studentUser._id }, $inc: { totalEnrolled: 1 } });

      if (isCompleted) {
        const cert = await Certificate.create({
          certificateId: `LP-${Date.now()}-9902`,
          student: studentUser._id,
          course: cId,
        });
        await User.findByIdAndUpdate(studentUser._id, { $push: { certificates: cert._id } });
      }
    }

    // ── Seed Blogs ─────────────────────────────────────────────────────────
    console.log('✍️   Seeding blog posts...');
    const blogsData = [
      // ── Web Development ──────────────────────────────────────────────────────
      {
        title: 'The Future of Web Development in 2026',
        excerpt: 'AI-assisted coding, edge rendering, WebAssembly, and headless CMS are reshaping how we build for the web.',
        content: 'As we look at the trajectory of web engineering in 2026, several forces are reshaping the ecosystem. AI copilots have moved from novelty to indispensable tool — GitHub Copilot, Cursor, and Claude are embedded into daily workflows. Edge runtimes now handle personalisation and auth at the CDN layer, eliminating round trips to origin servers. WebAssembly lets C++ and Rust binaries run at near-native speed inside the browser sandbox. Meanwhile, RSC (React Server Components) and Next.js App Router have blurred the client-server boundary. Developers must embrace these paradigm shifts to remain competitive.',
        category: 'Web Development',
        author: mentorUserMap['sarah@learnplus.com']._id,
        tags: ['Web Dev', 'AI', 'Edge', 'Wasm'],
        thumbnail: (CATEGORY_THUMBNAILS['Web Development'] && CATEGORY_THUMBNAILS['Web Development'][0]) || undefined,
      },
      {
        title: 'React vs Vue vs Svelte: Which Framework Should You Learn in 2026?',
        excerpt: 'A practical, opinionated comparison of the three dominant frontend frameworks — ecosystem, performance, and career value.',
        content: 'React still commands the largest job market share thanks to Meta\'s stewardship and the enormous component ecosystem. Vue 3\'s Composition API closed the ergonomics gap significantly and is especially popular in Asia-Pacific enterprises. Svelte — and its meta-framework SvelteKit — compiles components away entirely, producing zero-runtime overhead output that loads faster than any virtual-DOM solution. For a beginner, React remains the safest bet for employability. For a performance-obsessed side project, Svelte is thrilling. Vue 3 sits in an excellent middle ground. The good news: all three share Vite as their preferred build tool, so switching between them is more approachable than ever.',
        category: 'Web Development',
        author: mentorUserMap['sarah@learnplus.com']._id,
        tags: ['React', 'Vue', 'Svelte', 'Frontend'],
      },

      // ── App Development ───────────────────────────────────────────────────────
      {
        title: 'Flutter vs React Native in 2026: The Definitive Comparison',
        excerpt: 'Dart-powered Flutter and JavaScript-driven React Native both ship cross-platform apps — but the trade-offs have shifted dramatically.',
        content: 'Flutter 3.x now compiles to WASM for web targets, bringing near-native browser performance on top of its already solid iOS and Android story. Its widget-everything philosophy means pixel-perfect parity across platforms with no platform-specific layout quirks. React Native\'s New Architecture (Fabric + JSI) has closed the performance gap considerably and the JavaScript skill transfer is a massive advantage for web teams. For greenfield projects where visual consistency matters, Flutter is exceptional. When your team already writes React, React Native\'s ecosystem and code reuse make it the pragmatic choice.',
        category: 'App Development',
        author: mentorUserMap['priya@learnplus.com']._id,
        tags: ['Flutter', 'React Native', 'Mobile', 'Cross-Platform'],
      },
      {
        title: 'Building Your First Firebase-Powered Mobile App',
        excerpt: 'Realtime database, auth, cloud functions, and hosting — Firebase gives indie developers a full backend without a single server to manage.',
        content: 'Firebase Authentication handles email/password, Google, and Apple sign-in in under 50 lines. Firestore\'s real-time listeners push document updates to all connected clients instantly — no WebSocket boilerplate required. Cloud Functions let you run server-side business logic on trigger events (document writes, auth events, HTTP calls) without provisioning infrastructure. Firebase Hosting deploys your Flutter or React Native web build to a global CDN with a single command. The generous free Spark plan covers most indie apps indefinitely. This guide walks through scaffolding a complete task-manager app using every one of these services.',
        category: 'App Development',
        author: mentorUserMap['priya@learnplus.com']._id,
        tags: ['Firebase', 'Mobile', 'Backend', 'NoSQL'],
      },

      // ── Programming Languages ────────────────────────────────────────────────
      {
        title: 'Why TypeScript Wins at Scale',
        excerpt: 'Static typing, compile-time errors, and interfaces prevent production bugs in large JavaScript codebases.',
        content: 'When a codebase grows past 10,000 lines of plain JavaScript, tracking variable mutations and function signatures becomes fragile. TypeScript steps in with compile-time validation. Defining interface shapes and union types allows the TypeScript compiler to flag type errors before code ever reaches CI. Teams that adopt TypeScript consistently report fewer runtime exceptions, faster onboarding for new engineers, and more confident refactoring. The investment in types pays dividends at every scale.',
        category: 'Programming Languages',
        author: mentorUserMap['emily@learnplus.com']._id,
        tags: ['TypeScript', 'JavaScript', 'NodeJS'],
      },
      {
        title: 'Python in 2026: Why It Still Dominates AI, Data, and Scripting',
        excerpt: 'From ML pipelines to CLI tools and web APIs, Python\'s versatility and rich ecosystem keep it at the top of every developer survey.',
        content: 'Python\'s dominance in 2026 is no accident. The ML and data science communities built their ecosystems in Python — NumPy, Pandas, TensorFlow, PyTorch, and Scikit-Learn all have Python as their primary interface. FastAPI has made Python viable for high-performance REST APIs, outperforming many Node.js frameworks in benchmark throughput. Type hints and tools like mypy and Pyright bring optional static analysis that catches bugs early without abandoning Python\'s expressive dynamism. Whether you\'re scripting cloud automation, training a neural network, or building a REST service, Python is the most productive first choice.',
        category: 'Programming Languages',
        author: mentorUserMap['emily@learnplus.com']._id,
        tags: ['Python', 'AI', 'Data Science', 'FastAPI'],
      },

      // ── Data Structures & Algorithms ─────────────────────────────────────────
      {
        title: 'Dynamic Programming Demystified: From Fibonacci to Knapsack',
        excerpt: 'Understand memoisation vs tabulation, state definition, and transition functions with worked examples across classic DP problems.',
        content: 'Dynamic programming terrifies most developers at first because it requires thinking in overlapping subproblems rather than procedural steps. The key insight is that any DP problem has two components: a state definition (what do I need to know at each step?) and a transition function (how do I get from smaller states to the current state?). Top-down memoisation starts recursive and caches results; bottom-up tabulation fills an array iteratively. The Fibonacci sequence is the gateway. The 0-1 knapsack problem demonstrates 2D DP. Longest Common Subsequence introduces string DP. Mastering these three archetypes unlocks 80% of competitive-programming DP questions.',
        category: 'Data Structures & Algorithms',
        author: mentorUserMap['alex@learnplus.com']._id,
        tags: ['DP', 'Algorithms', 'Competitive Programming', 'DSA'],
      },
      {
        title: 'Graph Algorithms Every Developer Should Know',
        excerpt: 'BFS, DFS, Dijkstra, Bellman-Ford, and Floyd-Warshall — learn when to apply each and why it matters for system design.',
        content: 'Graphs model almost every real-world relationship: social networks, road maps, dependency graphs, and recommendation systems. Breadth-first search gives shortest paths in unweighted graphs and powers level-order tree traversals. Depth-first search underpins cycle detection, topological sorting, and connected-components discovery. Dijkstra\'s algorithm finds shortest paths in non-negative weighted graphs in O((V+E) log V) using a priority queue. Bellman-Ford handles negative edges and detects negative cycles. Floyd-Warshall solves all-pairs shortest paths in dense graphs. Understanding when each applies is as important as knowing the implementation.',
        category: 'Data Structures & Algorithms',
        author: mentorUserMap['alex@learnplus.com']._id,
        tags: ['Graphs', 'BFS', 'DFS', 'Dijkstra', 'DSA'],
      },

      // ── Machine Learning ─────────────────────────────────────────────────────
      {
        title: 'Mastering ML Without Heavy Math',
        excerpt: 'How to transition into machine learning using visualisation tools, Python packages, and practical pipelines.',
        content: 'Many developers avoid machine learning because of multi-variable calculus equations. But modern libraries like Scikit-Learn and PyTorch abstract away much of the manual mathematics. By understanding data shapes, feature scaling, training splits, and model scoring, you can deliver effective ML models without deriving equations from scratch. The key is to start with intuition — understand what a model is trying to do geometrically — then layer in the mathematics as needed. This guide outlines that practical roadmap from zero to deployed model.',
        category: 'Machine Learning',
        author: mentorUserMap['alex@learnplus.com']._id,
        tags: ['ML', 'AI', 'Career', 'Python'],
      },
      {
        title: 'Feature Engineering: The Skill That Separates Good Models from Great Ones',
        excerpt: 'Raw data rarely tells the full story. Learn how to transform, encode, and create features that dramatically improve model accuracy.',
        content: 'A sophisticated algorithm on poor features will always lose to a simple algorithm on excellent features. Feature engineering is the craft of transforming raw data into representations that expose underlying patterns to a model. Key techniques include: encoding categorical variables with one-hot or target encoding; creating interaction features from numeric columns; binning continuous variables into meaningful ranges; extracting date parts (day of week, hour, quarter) from timestamps; and using domain knowledge to construct ratio features. Proper handling of missing values — median imputation for numeric, mode for categorical — prevents silent data leakage. A well-engineered feature set consistently beats hyperparameter tuning for closing the accuracy gap.',
        category: 'Machine Learning',
        author: mentorUserMap['elena@learnplus.com']._id,
        tags: ['Feature Engineering', 'ML', 'Data Preprocessing', 'Scikit-Learn'],
      },

      // ── Artificial Intelligence ───────────────────────────────────────────────
      {
        title: 'How Large Language Models Actually Work',
        excerpt: 'Tokens, attention, transformers, and RLHF — a plain-English explanation of the architecture powering ChatGPT and Gemini.',
        content: 'LLMs begin by tokenising text into sub-word units. These tokens are mapped to high-dimensional embedding vectors. The Transformer architecture — introduced in the 2017 "Attention Is All You Need" paper — stacks self-attention layers that let each token attend to every other token in context. Multi-head attention allows the model to track multiple relationships simultaneously. After pretraining on enormous text corpora using next-token prediction, models are fine-tuned with instruction data and then aligned with Reinforcement Learning from Human Feedback (RLHF) to follow instructions helpfully and safely. Understanding this pipeline demystifies why LLMs excel at language tasks but struggle with precise arithmetic.',
        category: 'Artificial Intelligence',
        author: mentorUserMap['elena@learnplus.com']._id,
        tags: ['LLM', 'Transformers', 'GPT', 'RLHF', 'AI'],
      },
      {
        title: 'Building an AI Chatbot with LangChain and a Vector Database',
        excerpt: 'Retrieval-Augmented Generation (RAG) gives your chatbot long-term memory and access to private company documents.',
        content: 'RAG solves the context-window limitation of LLMs by fetching relevant document chunks at query time. The architecture is: embed your documents into vectors using an embedding model (e.g., OpenAI text-embedding-3-small or a local SentenceTransformer); store vectors in a vector database like Pinecone, Chroma, or Weaviate; at query time, embed the user question and retrieve the top-k similar chunks; inject those chunks as context into your LLM prompt. LangChain provides high-level abstractions for chains, retrievers, memory, and tool use that make wiring these pieces together straightforward. This article walks through building a complete document-QA chatbot in under 200 lines.',
        category: 'Artificial Intelligence',
        author: mentorUserMap['elena@learnplus.com']._id,
        tags: ['RAG', 'LangChain', 'Vector DB', 'Chatbot', 'AI'],
      },

      // ── Data Science ──────────────────────────────────────────────────────────
      {
        title: 'Exploratory Data Analysis: The Step Most Beginners Skip',
        excerpt: 'Before you train a single model, thorough EDA reveals data quality issues, distributions, correlations, and outliers that define your strategy.',
        content: 'Exploratory Data Analysis (EDA) is the practice of summarising and visualising a dataset before any modelling. A robust EDA workflow covers: shape inspection (df.shape, df.dtypes); null value analysis; univariate distributions via histograms and box plots; bivariate correlations via heatmaps and scatter matrices; and outlier detection using IQR fences or z-scores. Pandas Profiling and ydata-profiling can auto-generate a comprehensive HTML report in one line. The insights gathered — skewed distributions requiring log-transform, correlated predictors that invite multicollinearity, target class imbalance demanding oversampling — directly inform every downstream modelling decision.',
        category: 'Data Science',
        author: mentorUserMap['rachel@learnplus.com']._id,
        tags: ['EDA', 'Data Science', 'Pandas', 'Visualisation'],
      },

      // ── Cybersecurity ─────────────────────────────────────────────────────────
      {
        title: 'OWASP Top 10 Explained for Developers',
        excerpt: 'SQL injection, broken auth, SSRF, insecure design — understand the ten most critical web application security risks and how to prevent them.',
        content: 'The OWASP Top 10 is the industry-standard awareness document for web application security. A01: Broken Access Control — the most prevalent risk, occurring when users can act outside their intended permissions. A02: Cryptographic Failures — sensitive data exposed through weak or missing encryption. A03: Injection — SQL, LDAP, OS command injection from untrusted data sent to an interpreter. A04: Insecure Design — missing security controls at the architectural level. A05: Security Misconfiguration — default credentials, unnecessary features enabled, verbose error messages. Understanding each category empowers developers to make secure-by-default decisions rather than patching vulnerabilities after deployment.',
        category: 'Cybersecurity',
        author: mentorUserMap['michael@learnplus.com']._id,
        tags: ['OWASP', 'Security', 'Web Security', 'Penetration Testing'],
      },
      {
        title: 'Zero Trust Architecture: Why "Never Trust, Always Verify" Is the New Perimeter',
        excerpt: 'Traditional perimeter security assumes internal traffic is safe. Zero Trust eliminates that assumption with identity-aware, least-privilege access at every layer.',
        content: 'The collapse of the traditional network perimeter — accelerated by cloud, remote work, and SaaS proliferation — made Zero Trust not just fashionable but necessary. The Zero Trust model operates on three principles: verify explicitly (authenticate and authorise every request using all available signals including identity, location, device health, and workload); use least-privilege access (limit users and services to the minimum required permissions); assume breach (operate as if attackers are already inside the network). Implementation typically involves: an identity provider (Okta, Azure AD) enforcing MFA; micro-segmentation of network traffic; continuous monitoring with a SIEM; and device compliance checks before granting access.',
        category: 'Cybersecurity',
        author: mentorUserMap['michael@learnplus.com']._id,
        tags: ['Zero Trust', 'Security Architecture', 'IAM', 'Cloud Security'],
      },

      // ── Cloud Computing ───────────────────────────────────────────────────────
      {
        title: 'A Beginner\'s Guide to Cloud VPCs',
        excerpt: 'Understand subnets, internet gateways, security groups, and NAT gateways to build secure cloud networks.',
        content: 'Deploying applications on AWS or Azure requires a secure network container called a VPC (Virtual Private Cloud). Placing databases in private subnets without public IPs isolates them from internet scanners. Route tables direct traffic: public subnets route to an Internet Gateway; private subnets use a NAT Gateway for outbound-only internet access. Security groups act as stateful firewalls at the instance level — allow only the ports your application actually needs. Understanding these constructs is foundational for any cloud practitioner.',
        category: 'Cloud Computing',
        author: mentorUserMap['david@learnplus.com']._id,
        tags: ['AWS', 'Cloud', 'VPC', 'Networking'],
      },

      // ── DevOps ────────────────────────────────────────────────────────────────
      {
        title: 'CI/CD Pipelines from Scratch with GitHub Actions',
        excerpt: 'Automate build, test, lint, and deploy workflows using GitHub Actions YAML — zero infrastructure to manage.',
        content: 'A CI/CD pipeline removes manual steps between a code commit and a production deployment. GitHub Actions triggers workflows on push, pull_request, or schedule events. A typical pipeline: checkout code → install dependencies → run linters → run unit tests → build a Docker image → push to a container registry → deploy to Kubernetes via kubectl or Helm. Secrets (API keys, registry credentials) are stored encrypted in GitHub\'s secrets store and injected as environment variables. Matrix strategies let you test across multiple Node.js or Python versions in parallel. This article builds a complete MERN stack pipeline from scratch, step by step.',
        category: 'DevOps',
        author: mentorUserMap['david@learnplus.com']._id,
        tags: ['CI/CD', 'GitHub Actions', 'Docker', 'DevOps'],
      },

      // ── UI/UX Design ──────────────────────────────────────────────────────────
      {
        title: 'Figma Auto Layout: The Designer\'s Superpower',
        excerpt: 'Master settings, padding values, space distribution, and constraints for dynamic, responsive mockups.',
        content: 'Modern designers cannot afford to create static, fixed-size mockups. Figma\'s Auto Layout feature lets frames and components resize dynamically based on their content — just like CSS Flexbox. Configure the direction (horizontal or vertical), set padding and gap values, and watch your designs respond to content changes automatically. Combined with components and variants, Auto Layout unlocks design systems that scale gracefully from mobile to wide desktop viewports without maintaining multiple static frames per screen size.',
        category: 'UI/UX Design',
        author: mentorUserMap['james@learnplus.com']._id,
        tags: ['Figma', 'UI/UX', 'Design Systems', 'Responsive'],
      },

      // ── Database Management ───────────────────────────────────────────────────
      {
        title: 'SQL vs NoSQL: Choosing the Right Database for Your Project',
        excerpt: 'Relational integrity vs horizontal scalability — understanding the trade-offs helps you pick the right store for each use case.',
        content: 'SQL databases (PostgreSQL, MySQL) enforce schema, ACID transactions, and relational integrity through foreign keys. They excel at complex queries with joins, aggregations, and transactional workloads — banking, e-commerce checkouts, and CRM systems. NoSQL databases sacrifice some relational features for horizontal scalability and flexible schemas. Document stores (MongoDB) suit hierarchical data with variable shape. Key-value stores (Redis) provide sub-millisecond reads for caching and session management. Wide-column stores (Cassandra) deliver massive write throughput across nodes. Time-series databases (InfluxDB) are optimised for append-heavy metric data. The answer is rarely one-or-the-other — modern architectures combine multiple stores.',
        category: 'Database Management',
        author: mentorUserMap['elena@learnplus.com']._id,
        tags: ['SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'Databases'],
      },

      // ── Aptitude & Interview Preparation ──────────────────────────────────────
      {
        title: '10 System Design Concepts Every Senior Engineer Interview Expects You to Know',
        excerpt: 'Load balancers, caching layers, database sharding, message queues — the vocabulary and mental models that unlock senior engineering interviews.',
        content: 'System design interviews assess your ability to architect scalable, reliable, and maintainable systems. The ten concepts that appear most frequently: 1) Load Balancing — distributing traffic across servers using round-robin, least-connections, or IP-hash strategies. 2) Horizontal vs Vertical Scaling. 3) Caching — Redis/Memcached for session and query caching; CDN for static assets; cache invalidation strategies (TTL, write-through, write-behind). 4) Database Replication — primary-replica setups for read scaling. 5) Database Sharding — partitioning data across nodes by hash or range. 6) Message Queues — Kafka and RabbitMQ for async task processing and event streaming. 7) API Gateways. 8) CAP Theorem — Consistency, Availability, Partition Tolerance trade-offs. 9) Rate Limiting. 10) Consistent Hashing for distributed cache nodes. Knowing these deeply turns system design from intimidating to methodical.',
        category: 'Aptitude & Interview Preparation',
        author: mentorUserMap['sarah@learnplus.com']._id,
        tags: ['System Design', 'Interview Prep', 'Architecture', 'Scalability'],
      },
    ];

    for (const b of blogsData) await Blog.create(b);

    console.log('\n══════════════════════════════════════════════════════════');
    console.log('   🌱  Database seeding complete!');
    console.log('══════════════════════════════════════════════════════════');
    console.log('\n   Demo Credentials:');
    console.log('   Student:  student@learnplus.com  / password123');
    console.log('   Mentor 1: sarah@learnplus.com    / password123');
    console.log('   Mentor 2: alex@learnplus.com     / password123');
    console.log('   Mentor 3: priya@learnplus.com    / password123');
    console.log('   Mentor 4: james@learnplus.com    / password123');
    console.log('   Mentor 5: emily@learnplus.com    / password123');
    console.log('   Mentor 6: michael@learnplus.com  / password123');
    console.log('   Mentor 7: rachel@learnplus.com   / password123');
    console.log('   Mentor 8: carlos@learnplus.com   / password123');
    console.log('   Mentor 9: david@learnplus.com    / password123');
    console.log('   Mentor 10: elena@learnplus.com   / password123');
    console.log('══════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌  Seeder error: ${error.stack}`);
    process.exit(1);
  }
};

seedData();
