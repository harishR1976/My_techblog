const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Author = require('../models/Author');
const Category = require('../models/Category');
const Post = require('../models/Post');
const slugify = require('./slugify');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const categoriesData = [
  {
    name: 'Software Development',
    slug: slugify('Software Development'),
    description: 'Architecture patterns, clean code principles, testing practices, and software engineering methodologies.',
    order: 1,
  },
  {
    name: 'Artificial Intelligence & Machine Learning',
    slug: slugify('Artificial Intelligence & Machine Learning'),
    description: 'Neural networks, large language models, generative AI, and real-world ML engineering workflows.',
    order: 2,
  },
  {
    name: 'Web and Mobile App Development',
    slug: slugify('Web and Mobile App Development'),
    description: 'Modern frontend frameworks, cross-platform mobile tooling, progressive web apps, and UI state management.',
    order: 3,
  },
  {
    name: 'Technology & Innovation',
    slug: slugify('Technology & Innovation'),
    description: 'Emerging tech breakthroughs, hardware advances, next-generation computing, and industry disruptions.',
    order: 4,
  },
  {
    name: 'Cybersecurity',
    slug: slugify('Cybersecurity'),
    description: 'Application security, threat modeling, cryptography, vulnerability mitigation, and zero-trust systems.',
    order: 5,
  },
  {
    name: 'Cloud Computing',
    slug: slugify('Cloud Computing'),
    description: 'Serverless architectures, Kubernetes, microservices, containerization, and modern DevOps tooling.',
    order: 6,
  },
  {
    name: 'Industry Insights',
    slug: slugify('Industry Insights'),
    description: 'Engineering culture, technical leadership, product strategy, and macroeconomic trends in tech.',
    order: 7,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({ email: process.env.ADMIN_EMAIL || 'admin@companyblog.com' }),
      Author.deleteMany({ email: 'alex.rivera@companyblog.com' }),
      Category.deleteMany({ name: { $in: categoriesData.map((c) => c.name) } }),
      Post.deleteMany({
        slug: {
          $in: [
            'building-scalable-event-driven-microservices-nodejs-kafka',
            'parameter-efficient-fine-tuning-guide-lora-qlora',
            'modern-frontend-architecture-react-server-components-edge-streaming',
          ],
        },
      }),
    ]);

    const adminUser = await User.create({
      name: 'System Admin',
      email: process.env.ADMIN_EMAIL || 'admin@companyblog.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin',
    });

    const defaultAuthor = await Author.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@companyblog.com',
      role: 'Principal Software Architect',
      bio: 'Software architect and engineering writer focusing on distributed systems, cloud computing, and AI application engineering.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      socialLinks: {
        twitter: 'https://twitter.com/alexrivera_dev',
        github: 'https://github.com/alexrivera',
        linkedin: 'https://linkedin.com/in/alexrivera',
        website: 'https://alexrivera.dev',
      },
    });

    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = createdCategories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {});

    const samplePosts = [
      {
        title: 'Building Scalable Event-Driven Microservices with Node.js and Apache Kafka',
        slug: 'building-scalable-event-driven-microservices-nodejs-kafka',
        shortDescription: 'Learn how to decouple complex distributed architectures using asynchronous message brokers, schema registries, and idempotent consumers.',
        content: `<h2>Introduction to Event-Driven Microservices</h2>
<p>In distributed architectures, services often need to communicate asynchronously without introducing tight coupling. Event-driven architectures (EDA) enable decoupled communication by broadcasting domain events over message brokers like Apache Kafka.</p>

<h3>Core Message Broker Implementation</h3>
<p>Below is a production-ready consumer pattern using KafkaJS to consume and process transaction events with error handling and commit management:</p>

<pre><code class="language-javascript">const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'order-processing-group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-created', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());
      console.log(\`Processing order \${order.id} on partition \${partition}\`);
      // Process order idempotently...
    }
  });
};

runConsumer().catch(console.error);</code></pre>

<h2>Architecture Comparison</h2>
<p>When selecting a communication model for backend services, evaluate latency, consistency, and operational complexity:</p>

<table>
  <thead>
    <tr>
      <th>Pattern</th>
      <th>Coupling</th>
      <th>Throughput</th>
      <th>Typical Use Case</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Synchronous REST/gRPC</td>
      <td>Tight</td>
      <td>Moderate</td>
      <td>User-facing read/query APIs</td>
    </tr>
    <tr>
      <td>Event Bus (Kafka)</td>
      <td>Loose</td>
      <td>High (1M+ msg/s)</td>
      <td>Financial transactions & analytics</td>
    </tr>
    <tr>
      <td>Message Queue (RabbitMQ)</td>
      <td>Loose</td>
      <td>Moderate-High</td>
      <td>Background task orchestration</td>
    </tr>
  </tbody>
</table>

<h3>Best Practices for Production Resilience</h3>
<p>Implement dead-letter queues (DLQ), establish schema registries using Avro or Protobuf, and always enforce consumer idempotency through deduplication keys in your primary datastore.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        category: categoryMap['Software Development'],
        author: defaultAuthor._id,
        tags: ['Node.js', 'Kafka', 'Microservices', 'Architecture', 'Backend'],
        status: 'published',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        isFeatured: true,
        readingTime: 4,
        views: 1845,
        seo: {
          metaTitle: 'Building Scalable Event-Driven Microservices with Node.js and Kafka',
          metaDescription: 'Master asynchronous message brokers, idempotency, and distributed event-driven systems in Node.js.',
        },
      },
      {
        title: 'Parameter-Efficient Fine-Tuning: A Practical Guide to LoRA and QLoRA',
        slug: 'parameter-efficient-fine-tuning-guide-lora-qlora',
        shortDescription: 'Explore low-rank adaptation techniques to fine-tune 7B+ open-weights language models on consumer-grade hardware with 4-bit quantization.',
        content: `<h2>The Evolution of Large Model Fine-Tuning</h2>
<p>Training multi-billion parameter foundation models from scratch is financially and computationally prohibitive for most engineering teams. Parameter-Efficient Fine-Tuning (PEFT) enables adaptation of foundation models by training a tiny subset of parameters while freezing the base weights.</p>

<h3>Implementing Low-Rank Adaptation (LoRA)</h3>
<p>Using Hugging Face PEFT and bitsandbytes, we can configure 4-bit quantized base models and inject low-rank decomposition matrices into self-attention layers:</p>

<pre><code class="language-python">from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
import torch

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)

base_model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-8B",
    quantization_config=bnb_config,
    device_map="auto"
)

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

peft_model = get_peft_model(base_model, lora_config)
peft_model.print_trainable_parameters()</code></pre>

<h2>Fine-Tuning Method Comparison</h2>
<p>Comparison of memory footprints and hardware requirements when tuning an 8B parameter model:</p>

<table>
  <thead>
    <tr>
      <th>Technique</th>
      <th>Trainable Parameters</th>
      <th>VRAM Required</th>
      <th>Convergence Speed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Full Fine-Tuning</td>
      <td>100% (8.0B)</td>
      <td>&gt;80 GB (A100)</td>
      <td>Fast</td>
    </tr>
    <tr>
      <td>Standard LoRA (16-bit)</td>
      <td>~0.2% (16M)</td>
      <td>~24 GB (RTX 4090)</td>
      <td>Moderate</td>
    </tr>
    <tr>
      <td>QLoRA (4-bit NF4)</td>
      <td>~0.2% (16M)</td>
      <td>~12 GB (RTX 3060)</td>
      <td>Moderate</td>
    </tr>
  </tbody>
</table>

<h3>Deployment and Inference Serving</h3>
<p>Because LoRA adapters are lightweight (typically 20MB-100MB), multiple specialized task adapters can be swapped dynamically on a single frozen base model instance in production using vLLM or Hugging Face TGI.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
        category: categoryMap['Artificial Intelligence & Machine Learning'],
        author: defaultAuthor._id,
        tags: ['AI', 'Machine Learning', 'LLM', 'LoRA', 'Python'],
        status: 'published',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        isFeatured: false,
        readingTime: 5,
        views: 2430,
        seo: {
          metaTitle: 'LoRA and QLoRA Fine-Tuning Guide for LLMs',
          metaDescription: 'Learn how low-rank adaptation and 4-bit quantization enable efficient fine-tuning of open-source language models.',
        },
      },
      {
        title: 'Modern Frontend Architecture: React Server Components and Edge Streaming',
        slug: 'modern-frontend-architecture-react-server-components-edge-streaming',
        shortDescription: 'A deep dive into server-side execution boundaries, zero-bundle-size dependencies, and distributed edge runtime performance.',
        content: `<h2>Rethinking Client-Server Boundaries in React</h2>
<p>React Server Components (RSC) fundamentally shift how frontend engineers conceptualize the client-server boundary. By executing components exclusively on the server, heavy dependencies remain zero-bundle-size on the client while streaming HTML seamlessly to the browser.</p>

<h3>Server Component with Direct Data Fetching</h3>
<p>Below is a clean pattern executing an async database query directly within a server component, streaming data without client side-effects or loading spinners:</p>

<pre><code class="language-jsx">import { Suspense } from 'react';
import db from '@/lib/db';

async function RecentActivity() {
  const activities = await db.activity.findMany({ take: 5, orderBy: { createdAt: 'desc' } });

  return (
    &lt;ul className="space-y-2"&gt;
      {activities.map((item) =&gt; (
        &lt;li key={item.id} className="p-3 bg-slate-800 rounded-lg text-slate-100"&gt;
          {item.description}
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}

export default async function DashboardPage() {
  return (
    &lt;section className="p-6"&gt;
      &lt;h1 className="text-2xl font-bold mb-4"&gt;System Dashboard&lt;/h1&gt;
      &lt;Suspense fallback={&lt;p&gt;Streaming live activity...&lt;/p&gt;}&gt;
        &lt;RecentActivity /&gt;
      &lt;/Suspense&gt;
    &lt;/section&gt;
  );
}</code></pre>

<h2>Rendering Strategies Benchmarked</h2>
<p>The table below summarizes performance metrics across client and server rendering paradigms:</p>

<table>
  <thead>
    <tr>
      <th>Strategy</th>
      <th>Client Bundle</th>
      <th>Initial TTFB</th>
      <th>SEO Support</th>
      <th>Data Freshness</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Client-Side SPA (CSR)</td>
      <td>Heavy</td>
      <td>Fast (Static)</td>
      <td>Limited</td>
      <td>On-demand API</td>
    </tr>
    <tr>
      <td>Server-Side Rendering (SSR)</td>
      <td>Medium</td>
      <td>Moderate</td>
      <td>Excellent</td>
      <td>Per-request real-time</td>
    </tr>
    <tr>
      <td>React Server Components (RSC)</td>
      <td>Minimal</td>
      <td>Fast Streaming</td>
      <td>Native</td>
      <td>Composable streaming</td>
    </tr>
  </tbody>
</table>

<h3>Streaming and Hydration Optimization</h3>
<p>Using React Suspense boundaries alongside HTTP chunked transfer encoding allows critical above-the-fold content to be rendered and hydrated immediately while asynchronous widgets resolve in the background.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        category: categoryMap['Web and Mobile App Development'],
        author: defaultAuthor._id,
        tags: ['React', 'Next.js', 'Web Development', 'Performance', 'JavaScript'],
        status: 'published',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
        isFeatured: false,
        readingTime: 4,
        views: 1290,
        seo: {
          metaTitle: 'React Server Components vs Edge SSR: Performance Analysis',
          metaDescription: 'Comprehensive benchmark and architectural breakdown of RSC, edge computing, and client bundle reduction.',
        },
      },
    ];

    await Post.create(samplePosts);

    console.log(`Database seeded successfully:`);
    console.log(`- Admin User: ${adminUser.email}`);
    console.log(`- Author: ${defaultAuthor.name} (${defaultAuthor.email})`);
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Posts: ${samplePosts.length}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
