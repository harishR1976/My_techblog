export const MOCK_ARTICLES = [
  {
    _id: 'mock-1',
    title: 'Architecting Scalable Microservices with Node.js, Docker and Kubernetes',
    slug: 'architecting-scalable-microservices-nodejs-docker-kubernetes',
    shortDescription:
      'A comprehensive guide to breaking monolithic bottlenecks, building fault-tolerant communication pipelines, and orchestrating container workloads at scale.',
    summary:
      'A comprehensive guide to breaking monolithic bottlenecks, building fault-tolerant communication pipelines, and orchestrating container workloads at scale.',
    category: 'Technology',
    author: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'Principal Cloud Architect',
    },
    featuredImage:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    publishAt: '2026-11-08T09:00:00.000Z',
    createdAt: '2026-11-08T09:00:00.000Z',
    readingTime: 6,
    views: 4820,
    isFeatured: true,
    status: 'published',
    tags: ['Node.js', 'Docker', 'Kubernetes', 'Architecture', 'Microservices'],
    metaTitle: 'Architecting Scalable Microservices with Node.js & Docker (2026)',
    metaDescription:
      'Learn how to architect high-throughput microservices using Node.js, event-driven pipelines, and automated container orchestration with Kubernetes.',
    content: `
      <h2>The Shift From Monolith to Distributed Microservices</h2>
      <p>Modern cloud systems demand resilience, elasticity, and autonomous deployment cadences. In traditional monolithic architectures, scaling an isolated bottleneck often means vertically scaling the entire application stack, introducing unnecessary infrastructural overhead and single points of failure.</p>
      
      <p>By decomposing business domains into bounded contexts, development teams gain the velocity to release independent services, decouple failure domains, and optimize compute resources precisely where needed.</p>

      <div class="article-callout">
        <strong>Pro Tip:</strong> Never decompose a monolith simply for the sake of microservices. Ensure your operational maturity, telemetry, and service contracts are well-defined before splitting.
      </div>

      <h2>Key Architectural Patterns for Resilient Services</h2>
      <p>Building microservices requires fundamentally rethinking how distributed processes exchange data and coordinate work without cascading timeouts:</p>

      <ul>
        <li><strong>API Gateway Aggregation:</strong> Centralize authentication, rate limiting, and request routing to shield backend services.</li>
        <li><strong>Event-Driven Asynchrony:</strong> Use Kafka or RabbitMQ event streams rather than synchronous HTTP whenever eventual consistency is acceptable.</li>
        <li><strong>Circuit Breakers:</strong> Wrap external RPC calls to fail fast when downstream services become degraded.</li>
      </ul>

      <h3>Inter-Service Communication and Payload Contracts</h3>
      <p>Below is a production-grade pattern for implementing an resilient retry-aware HTTP client with backoff in Node.js:</p>

      <pre><code class="language-javascript">import axios from 'axios';

export async function fetchWithExponentialBackoff(url, retries = 3, delay = 1000) {
  try {
    const response = await axios.get(url, { timeout: 3500 });
    return response.data;
  } catch (error) {
    if (retries === 0) {
      throw new Error(\`Failed to fetch \${url} after retries: \${error.message}\`);
    }
    console.warn(\`Transient failure on \${url}, retrying in \${delay}ms...\`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchWithExponentialBackoff(url, retries - 1, delay * 2);
  }
}</code></pre>

      <h2>Benchmarking Microservice Transport Protocols</h2>
      <p>Choosing between REST, GraphQL, and gRPC depends heavily on payload sizes, serialized structure, and network latency requirements:</p>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Protocol</th>
              <th>Serialization</th>
              <th>Throughput (req/sec)</th>
              <th>Ideal Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>REST / JSON</td>
              <td>Text / UTF-8</td>
              <td>12,400</td>
              <td>Public developer APIs and web clients</td>
            </tr>
            <tr>
              <td>gRPC / HTTP/2</td>
              <td>Protocol Buffers (Binary)</td>
              <td>38,900</td>
              <td>High-frequency east-west microservice traffic</td>
            </tr>
            <tr>
              <td>GraphQL</td>
              <td>Text / JSON</td>
              <td>10,200</td>
              <td>Complex client queries with granular field selection</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Container Orchestration and Health Checks</h2>
      <p>When running in Kubernetes, ensuring accurate <code>livenessProbe</code> and <code>readinessProbe</code> configurations prevents traffic from being routed to unready containers during scaling events.</p>

      <blockquote>
        "Reliability is not a feature you add at the end of a sprint; it is an invariant built into every service boundary and network hop."
      </blockquote>

      <p>By leveraging declarative infrastructure and continuous monitoring, teams can maintain five-nines uptime even during zero-downtime rolling upgrades.</p>
    `,
  },
  {
    _id: 'mock-2',
    title: 'The Modern Frontend Landscape: React Server Components, Streaming & Suspense',
    slug: 'modern-frontend-react-server-components-streaming-suspense',
    shortDescription:
      'Understanding server-side component streaming, zero-bundle overheads, and how client boundaries reshape web application performance.',
    summary:
      'Understanding server-side component streaming, zero-bundle overheads, and how client boundaries reshape web application performance.',
    category: 'Web Development',
    author: {
      name: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      role: 'Staff Frontend Engineer',
    },
    featuredImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    publishAt: '2026-11-09T14:30:00.000Z',
    createdAt: '2026-11-09T14:30:00.000Z',
    readingTime: 5,
    views: 3940,
    isFeatured: true,
    status: 'published',
    tags: ['React', 'Next.js', 'Frontend', 'Performance', 'JavaScript'],
    metaTitle: 'React Server Components & Streaming Architecture (2026)',
    metaDescription:
      'A deep dive into React Server Components, progressive hydration, Suspense boundaries, and zero-client-bundle architecture.',
    content: `
      <h2>The Evolution of Component Execution</h2>
      <p>For years, frontend developers faced a fundamental tension: ship rich client-side interactivity at the expense of massive JavaScript bundles, or stick to traditional SSR where full hydration delays time-to-interactive.</p>

      <p>React Server Components (RSC) fundamentally shift this paradigm by executing components on the server while serializing rendered UI trees into a streaming JSON-like protocol that the browser can progressively paint without hydration penalties.</p>

      <h2>Key Advantages of Server Components</h2>
      <ul>
        <li><strong>Zero Client Bundle Size:</strong> Heavy parsing libraries, markdown compilers, and database connectors remain strictly on the server.</li>
        <li><strong>Direct Data Access:</strong> Query databases and microservices directly within the component function without intermediate REST endpoints.</li>
        <li><strong>Automatic Code Splitting:</strong> Client components imported inside server trees are dynamically code-split without manual <code>React.lazy</code> boilerplate.</li>
      </ul>

      <h3>Streaming UI with Suspense Boundaries</h3>
      <p>Progressive rendering allows high-latency data queries to stream in parallel while rendering the shell immediately:</p>

      <pre><code class="language-jsx">import { Suspense } from 'react';
import UserProfile from './UserProfile';
import ActivityFeedSkeleton from './ActivityFeedSkeleton';
import ActivityFeed from './ActivityFeed';

export default function DashboardPage() {
  return (
    &lt;main className="dashboard-layout"&gt;
      &lt;UserProfile /&gt;
      &lt;Suspense fallback={&lt;ActivityFeedSkeleton /&gt;}&gt;
        &lt;ActivityFeed /&gt;
      &lt;/Suspense&gt;
    &lt;/main&gt;
  );
}</code></pre>

      <h2>Mental Model: The "use client" Boundary</h2>
      <p>One common misunderstanding is that <code>'use client'</code> means a component runs exclusively in the browser. In reality, it marks the boundary where React can include client interactivity, event handlers, and state hooks such as <code>useState</code> and <code>useEffect</code>.</p>
    `,
  },
  {
    _id: 'mock-3',
    title: 'Practical Artificial Intelligence: Fine-Tuning LLMs for Domain-Specific Tasks',
    slug: 'practical-ai-fine-tuning-llms-domain-specific-tasks',
    shortDescription:
      'How to curate clean training corpora, apply Low-Rank Adaptation (LoRA), and evaluate loss curves when customizing foundational models.',
    summary:
      'How to curate clean training corpora, apply Low-Rank Adaptation (LoRA), and evaluate loss curves when customizing foundational models.',
    category: 'Artificial Intelligence',
    author: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      role: 'Machine Learning Researcher',
    },
    featuredImage:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
    publishAt: '2026-11-07T11:15:00.000Z',
    createdAt: '2026-11-07T11:15:00.000Z',
    readingTime: 7,
    views: 5210,
    isFeatured: true,
    status: 'published',
    tags: ['AI', 'LLM', 'Machine Learning', 'Python', 'LoRA'],
    metaTitle: 'Practical LLM Fine-Tuning with LoRA & PEFT (2026)',
    metaDescription:
      'Step-by-step walkthrough of dataset curation, PEFT parameter reduction, quantization, and real-world evaluation benchmarks.',
    content: `
      <h2>Why Foundational Models Need Domain Alignment</h2>
      <p>While general-purpose language models exhibit impressive broad reasoning, production enterprise tasks in medicine, law, and systems engineering demand strict adherence to terminology, safety boundaries, and structured JSON outputs.</p>

      <h2>Parameter-Efficient Fine-Tuning (PEFT)</h2>
      <p>Training all 70 billion parameters of a foundational model is cost-prohibitive for most engineering teams. Low-Rank Adaptation (LoRA) freezes the original weights and injects trainable rank-decomposition matrices into each transformer layer, reducing trainable parameters by over 99%.</p>

      <pre><code class="language-python">from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-8B")
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

peft_model = get_peft_model(model, lora_config)
peft_model.print_trainable_parameters()</code></pre>

      <h3>Dataset Hygiene & Validation</h3>
      <p>Garbage in, garbage out remains the fundamental truth of machine learning. Prioritize instruction-formatted samples with human-reviewed edge cases over raw uncurated web dumps.</p>
    `,
  },
  {
    _id: 'mock-4',
    title: 'Designing Accessible & Cohesive Design Systems for Enterprise Applications',
    slug: 'designing-accessible-cohesive-design-systems-enterprise',
    shortDescription:
      'From semantic design tokens and WCAG 2.2 AA contrast ratios to composable headless UI components and keyboard accessibility.',
    summary:
      'From semantic design tokens and WCAG 2.2 AA contrast ratios to composable headless UI components and keyboard accessibility.',
    category: 'Design & UI',
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      role: 'Principal Design System Lead',
    },
    featuredImage:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    publishAt: '2026-11-06T08:20:00.000Z',
    createdAt: '2026-11-06T08:20:00.000Z',
    readingTime: 4,
    views: 2650,
    isFeatured: false,
    status: 'published',
    tags: ['Design Systems', 'Accessibility', 'Figma', 'CSS', 'UI/UX'],
    metaTitle: 'Building Accessible Enterprise Design Systems',
    metaDescription:
      'How to build consistent, compliant, and delightful enterprise component libraries using tokenized themes and headless primitives.',
    content: `
      <h2>The Power of Semantic Tokens</h2>
      <p>Hardcoding hex codes in CSS files is a recipe for design inconsistency. By creating a multi-tiered token architecture—Global, Semantic, and Component tokens—teams can implement dark mode and brand white-labeling in hours rather than months.</p>

      <h2>Keyboard Navigation & Focus Management</h2>
      <p>An accessible system guarantees that power users and assistive technology users can navigate seamlessly using standard keyboard controls (Tab, Shift+Tab, Arrow keys, Esc).</p>
    `,
  },
  {
    _id: 'mock-5',
    title: 'Optimizing MongoDB for High-Throughput Web Applications',
    slug: 'optimizing-mongodb-high-throughput-web-applications',
    shortDescription:
      'Compound index strategies, aggregation pipeline optimizations, memory caching patterns, and connection pool tuning for scale.',
    summary:
      'Compound index strategies, aggregation pipeline optimizations, memory caching patterns, and connection pool tuning for scale.',
    category: 'Technology',
    author: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'Principal Cloud Architect',
    },
    featuredImage:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&auto=format&fit=crop&q=80',
    publishAt: '2026-11-05T16:00:00.000Z',
    createdAt: '2026-11-05T16:00:00.000Z',
    readingTime: 6,
    views: 3120,
    isFeatured: false,
    status: 'published',
    tags: ['MongoDB', 'Databases', 'Backend', 'Performance', 'Indexing'],
    metaTitle: 'MongoDB Performance Optimization Guide (2026)',
    metaDescription:
      'Techniques for indexing, aggregation pipelines, and query analysis to eliminate database bottlenecks.',
    content: `
      <h2>Mastering the ESR Rule for Indexing</h2>
      <p>When creating compound indexes in MongoDB, always structure your index keys following the Equality, Sort, Range (ESR) rule to maximize index selectivity and prevent expensive in-memory sort stages.</p>
    `,
  },
  {
    _id: 'mock-6',
    title: 'Zero to Production: Building a Robust CI/CD Pipeline with GitHub Actions',
    slug: 'zero-to-production-cicd-pipeline-github-actions',
    shortDescription:
      'Automating linting, matrix test execution, container builds, semantic versioning, and zero-downtime production deployments.',
    summary:
      'Automating linting, matrix test execution, container builds, semantic versioning, and zero-downtime production deployments.',
    category: 'Tutorials',
    author: {
      name: 'Liam Zhang',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      role: 'DevOps Engineer',
    },
    featuredImage:
      'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=1200&auto=format&fit=crop&q=80',
    publishAt: '2026-11-04T12:00:00.000Z',
    createdAt: '2026-11-04T12:00:00.000Z',
    readingTime: 5,
    views: 2980,
    isFeatured: false,
    status: 'published',
    tags: ['CI/CD', 'DevOps', 'GitHub Actions', 'Automation', 'Docker'],
    metaTitle: 'Production CI/CD Pipelines with GitHub Actions',
    metaDescription:
      'Step-by-step tutorial on building reliable, fast, and secure continuous integration and delivery pipelines.',
    content: `
      <h2>Pipeline Architecture</h2>
      <p>A resilient deployment pipeline provides rapid feedback loops to engineers while maintaining strict quality gates for security and compliance before deploying to production environments.</p>
    `,
  },
]
