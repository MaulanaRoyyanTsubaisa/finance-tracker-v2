interface MascotProps {
  mood: "happy" | "neutral" | "worried" | "broke";
  size?: "sm" | "md" | "lg";
  showMessage?: boolean;
  variant?: "default" | "bubble";
}

const FACES: Record<string, { face: string; message: string; short: string }> = {
  happy: { face: "😸", message: "Yay! Keuanganmu sehat! Keep it up~ ✨", short: "Hemat terus! ✨" },
  neutral: { face: "🐱", message: "Lumayan sih… tapi bisa lebih hemat lho~", short: "Lumayan~ 👌" },
  worried: { face: "😿", message: "Hmm… spending-mu agak banyak nih 👀", short: "Pelan-pelan ya 👀" },
  broke: { face: "🙀", message: "HELP! Dompetku sekarat! 💀", short: "Dompet SOS! 💀" },
};

const SIZES = { sm: "text-3xl", md: "text-5xl", lg: "text-7xl" };

export default function Mascot({ mood, size = "md", showMessage = true, variant = "default" }: MascotProps) {
  const { face, message, short } = FACES[mood];
  const anim = mood === "happy" ? "animate-bounce-soft" : mood === "broke" ? "animate-wiggle" : "";

  if (variant === "bubble") {
    return (
      <div className="flex items-center gap-2">
        {showMessage && (
          <div className="relative bg-primary-foreground/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <p className="text-[10px] font-semibold text-primary-foreground whitespace-nowrap">{short}</p>
          </div>
        )}
        <div className={`${SIZES[size]} ${anim} select-none leading-none`}>{face}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${SIZES[size]} ${anim} select-none leading-none`}>{face}</div>
      {showMessage && (
        <p className="text-sm text-muted-foreground text-center max-w-[200px] font-medium">{message}</p>
      )}
    </div>
  );
}
