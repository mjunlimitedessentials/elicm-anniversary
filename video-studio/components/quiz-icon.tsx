import {
  Church,
  Smartphone,
  Briefcase,
  User,
  Video,
  Image as ImageIcon,
  Sparkles,
  Zap,
  Calendar,
  Sprout,
  Clapperboard,
  Mic,
  MessageSquare,
  Film,
  Trophy,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/onboarding-questions";

const ICONS: Record<IconName, LucideIcon> = {
  church: Church,
  smartphone: Smartphone,
  briefcase: Briefcase,
  user: User,
  video: Video,
  image: ImageIcon,
  sparkles: Sparkles,
  zap: Zap,
  calendar: Calendar,
  sprout: Sprout,
  clapperboard: Clapperboard,
  mic: Mic,
  "message-square": MessageSquare,
  film: Film,
  trophy: Trophy,
  "heart-handshake": HeartHandshake,
};

export function QuizIcon({ name, className }: { name?: IconName; className?: string }) {
  const Icon = name ? ICONS[name] : Sparkles;
  return <Icon className={className ?? "h-5 w-5"} />;
}
