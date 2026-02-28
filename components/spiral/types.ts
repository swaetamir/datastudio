export interface StoryStop {
  id: string;
  slug: string;
  title: string;
  hook: string;
  tags: string[];
  readTime: string;
  status: "Published" | "Coming soon" | "Placeholder";
  /** 0–1 progress along the 3D spiral curve */
  progress: number;
  externalUrl?: string;
  image?: string;
}

export type WalkState = "idle" | "walking" | "arrived";
