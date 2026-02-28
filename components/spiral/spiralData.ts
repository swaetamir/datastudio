import { StoryStop } from "./types";

// 3D spiral config — used by spiralMath.buildSpiral3DCurve
export const SPIRAL_3D_CONFIG = {
  a: 1,          // starting radius
  b: 4.5,        // radius growth per radian
  thetaMax: Math.PI * 4.5, // 2.25 full rotations
};

// progress = 0..1 along the 3D curve
export const SPIRAL_STOPS: StoryStop[] = [
  {
    id: "start",
    slug: "",
    title: "WELCOME TO THE SPIRAL",
    hook: "Personal data essays about taste, culture, and behavior. Walk the spiral to explore.",
    tags: [],
    readTime: "",
    status: "Placeholder",
    progress: 0.06,
    image: "/welcome-spiral.jpg",
  },
  {
    id: "issue-000",
    slug: "issue-000-system-initialization",
    title: "Entry 000: System Initialization",
    hook: "the logic of curation — a research lab to map the drift between technical systems and my actual taste.",
    tags: ["Curation", "Data", "Personal Analytics"],
    readTime: "1 min",
    status: "Published",
    progress: 0.10,
    externalUrl: "https://substack.com/@thedatastudioarchive/note/p-189220389",
    image: "https://substackcdn.com/image/fetch/$s_!veIc!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3c9d19ad-d067-4e92-91c8-b80a4063bf51_650x432.jpeg",
  },
  {
    id: "issue-001",
    slug: "issue-001-digital-hoarding-vs-intentional-archiving",
    title: "Entry 001: Digital Hoarding vs. Intentional Archiving",
    hook: "My philosophy on why we need better systems for curating our digital lives.",
    tags: ["Reading", "EDA", "Story"],
    readTime: "3 min",
    status: "Published",
    progress: 0.20,
    externalUrl: "https://substack.com/home/post/p-189440259",
    image: "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F15fa1434-08c8-4a31-9645-edaf5ae04f6a_736x479.jpeg",
  },
  {
    id: "issue-002",
    slug: "",
    title: "Entry 002: The Anatomy of a Spiral — Coming Soon",
    hook: "A deep dive into the math and UX behind my 3D portfolio project.",
    tags: [],
    readTime: "",
    status: "Coming soon",
    progress: 0.30,
  },
  {
    id: "issue-003",
    slug: "",
    title: "Entry 003: The Gunna Algorithm — Coming Soon",
    hook: "A study on 'Production Consistency' vs. 'Production Stagnation.'",
    tags: [],
    readTime: "",
    status: "Coming soon",
    progress: 0.40,
  },
  {
    id: "end",
    slug: "",
    title: "MORE STORIES INCOMING",
    hook: "",
    tags: [],
    readTime: "",
    status: "Placeholder",
    progress: 0.96,
  },
];
