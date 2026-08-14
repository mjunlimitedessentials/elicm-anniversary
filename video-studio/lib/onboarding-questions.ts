export type QuizOption = {
  id: string;
  label: string;
  // No real photography is bundled with this scaffold — QuizImageCard
  // renders a deterministic gradient per option id instead. Pass a real
  // imageUrl once you have production art and the card will use it.
  imageUrl?: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  subtitle?: string;
  multiSelect: boolean;
  options: QuizOption[];
};

// Question 1 mirrors the reference screenshots exactly. Questions 2-7 are
// original placeholders sized for a ministry-video product — replace the
// copy/images once you can confirm the real quiz content.
export const ONBOARDING_QUESTIONS: QuizQuestion[] = [
  {
    id: "focus",
    question: "What are you most interested in using Recreate Studio for?",
    subtitle: "Pick everything that fits your ministry. This shapes your first project.",
    multiSelect: true,
    options: [
      { id: "bible-videos", label: "Bible Videos" },
      { id: "sermon-jam", label: "Sermon Jam Videos" },
      { id: "social-media", label: "Social Media" },
      { id: "kids-ministry", label: "Kids Ministry Content" },
    ],
  },
  {
    id: "audience_size",
    question: "How big is your congregation or audience?",
    subtitle: "This helps us tune output quality and pacing.",
    multiSelect: false,
    options: [
      { id: "under-100", label: "Under 100" },
      { id: "100-500", label: "100 - 500" },
      { id: "500-2000", label: "500 - 2,000" },
      { id: "2000-plus", label: "2,000+" },
    ],
  },
  {
    id: "video_length",
    question: "What length do you usually need?",
    multiSelect: true,
    options: [
      { id: "short", label: "Under 60s (Reels/Shorts)" },
      { id: "medium", label: "1 - 5 minutes" },
      { id: "long", label: "5+ minutes" },
      { id: "series", label: "Multi-part series" },
    ],
  },
  {
    id: "voice_style",
    question: "What narration style fits your content?",
    multiSelect: false,
    options: [
      { id: "warm", label: "Warm & pastoral" },
      { id: "energetic", label: "Energetic & upbeat" },
      { id: "cinematic", label: "Cinematic & dramatic" },
      { id: "none", label: "No narration, visuals only" },
    ],
  },
  {
    id: "visual_style",
    question: "Pick a visual style to start from.",
    multiSelect: false,
    options: [
      { id: "realistic", label: "Cinematic realism" },
      { id: "illustrated", label: "Illustrated / storybook" },
      { id: "motion-graphics", label: "Motion graphics & text" },
      { id: "documentary", label: "Documentary footage" },
    ],
  },
  {
    id: "output_goal",
    question: "How many videos are you hoping to produce per month?",
    multiSelect: false,
    options: [
      { id: "1-4", label: "1 - 4" },
      { id: "5-15", label: "5 - 15" },
      { id: "16-40", label: "16 - 40" },
      { id: "40-plus", label: "40+" },
    ],
  },
  {
    id: "team",
    question: "Who else will be creating alongside you?",
    multiSelect: true,
    options: [
      { id: "solo", label: "Just me" },
      { id: "media-team", label: "A media/production team" },
      { id: "volunteers", label: "Volunteers" },
      { id: "agency", label: "An outside agency" },
    ],
  },
];
