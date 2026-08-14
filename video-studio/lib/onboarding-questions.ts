// Icon names reference components/quiz-icon.tsx's ICONS map (lucide-react).
export type IconName =
  | "church"
  | "smartphone"
  | "briefcase"
  | "user"
  | "video"
  | "image"
  | "sparkles"
  | "zap"
  | "calendar"
  | "sprout"
  | "clapperboard"
  | "mic"
  | "message-square"
  | "film"
  | "trophy"
  | "heart-handshake";

export type QuizOption = {
  id: string;
  label: string;
  subtitle?: string;
  icon?: IconName;
  // No real photography is bundled with this scaffold — image-card options
  // render a deterministic gradient per option id instead. Pass a real
  // imageUrl once you have production art and the card will use it.
  imageUrl?: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  subtitle?: string;
  multiSelect: boolean;
  // "image-cards": 2-col grid of photo cards (used for the focus question).
  // "icon-list": vertical stack of icon + title (+ subtitle) rows.
  layout: "image-cards" | "icon-list";
  // When set, renders a text link that advances the quiz without a
  // selection (e.g. "I'm not using any yet").
  skipLabel?: string;
  options: QuizOption[];
};

export const ONBOARDING_QUESTIONS: QuizQuestion[] = [
  {
    id: "focus",
    question: "What are you most interested in using Recreate Studio for?",
    subtitle: "Pick everything that fits your ministry. This shapes your first project.",
    multiSelect: true,
    layout: "image-cards",
    options: [
      { id: "bible-videos", label: "Bible Videos" },
      { id: "sermon-jam", label: "Sermon Jam Videos" },
      { id: "social-media", label: "Social Media" },
      { id: "kids-ministry", label: "Kids Ministry Content" },
    ],
  },
  {
    id: "audience",
    question: "Who will see this?",
    subtitle: "We'll shape the first project around the people it is for.",
    multiSelect: false,
    layout: "icon-list",
    options: [
      { id: "church", label: "My church or ministry", subtitle: "Sunday, a team, or the congregation", icon: "church" },
      { id: "personal", label: "My personal audience", subtitle: "Social, YouTube, or my own following", icon: "smartphone" },
      { id: "client", label: "A client", subtitle: "I'm making this for someone else", icon: "briefcase" },
      { id: "solo", label: "Just me - I'm trying it", subtitle: "No one is waiting on this yet", icon: "user" },
    ],
  },
  {
    id: "outcome",
    question: "What do you want to walk away with today?",
    subtitle: "We'll start you on the shortest path to that.",
    multiSelect: false,
    layout: "icon-list",
    options: [
      { id: "video", label: "A finished video I can post", subtitle: "I'll walk out with something to share", icon: "video" },
      { id: "images", label: "Images I can use later", subtitle: "Stills, thumbnails, or frames", icon: "image" },
      { id: "exploring", label: "Just seeing what this can do", subtitle: "I'm testing the studio", icon: "sparkles" },
    ],
  },
  {
    id: "timeline",
    question: "When do you need the first piece?",
    subtitle: "We'll match the pace to your deadline.",
    multiSelect: false,
    layout: "icon-list",
    options: [
      { id: "today", label: "Today", subtitle: "I need the first piece in this sitting", icon: "zap" },
      { id: "this-week", label: "This week", subtitle: "Sunday, a deadline, or a publish day", icon: "calendar" },
      { id: "no-rush", label: "No rush", subtitle: "I'll make something when I'm ready", icon: "sprout" },
    ],
  },
  {
    id: "current_tools",
    question: "What AI video tools are you using now?",
    subtitle: "Select all that apply. We'll meet you where you are.",
    multiSelect: true,
    layout: "icon-list",
    skipLabel: "I'm not using any yet",
    options: [
      { id: "higgsfield", label: "Higgsfield", icon: "zap" },
      { id: "runway", label: "Runway", icon: "clapperboard" },
      { id: "elevenlabs", label: "ElevenLabs", icon: "mic" },
      { id: "chatgpt", label: "ChatGPT", icon: "message-square" },
      { id: "other", label: "Other", icon: "sparkles" },
    ],
  },
  {
    id: "skill_level",
    question: "What's your skill level in video production?",
    subtitle: "No wrong answer. This tunes how much guidance you'll see.",
    multiSelect: false,
    layout: "icon-list",
    options: [
      { id: "beginner", label: "Beginner", subtitle: "I'm just getting started with video", icon: "sprout" },
      { id: "intermediate", label: "Intermediate", subtitle: "I've made and published videos before", icon: "film" },
      { id: "advanced", label: "Advanced", subtitle: "Video production is my craft", icon: "trophy" },
    ],
  },
  {
    id: "occupation",
    question: "What's your current occupation?",
    subtitle: "This helps us shape templates and tips for your role.",
    multiSelect: false,
    layout: "icon-list",
    options: [
      { id: "pastor", label: "Pastor", icon: "church" },
      { id: "media-director", label: "Media director / professional", icon: "video" },
      { id: "ministry-staff", label: "Ministry staff", icon: "heart-handshake" },
      { id: "content-creator", label: "Content creator", icon: "smartphone" },
      { id: "other", label: "Other", icon: "sparkles" },
    ],
  },
];
