import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import trackImg from "@/assets/onboarding-track.png";
import saveImg from "@/assets/onboarding-save.png";
import achieveImg from "@/assets/onboarding-achieve.png";

const ONBOARDING_KEY = "onboarding-completed";

export const markOnboardingDone = () => {
  localStorage.setItem(ONBOARDING_KEY, "1");
};

export const isOnboardingDone = () => {
  return localStorage.getItem(ONBOARDING_KEY) === "1";
};

interface Slide {
  image: string;
  title: { id: string; en: string };
  desc: { id: string; en: string };
  bg: string;
}

const SLIDES: Slide[] = [
  {
    image: trackImg,
    title: { id: "Lacak Setiap Rupiah", en: "Track Every Penny" },
    desc: {
      id: "Catat pemasukan & pengeluaran harianmu dengan mudah, biar tahu uangmu kemana aja~",
      en: "Easily log your daily income & expenses, so you know where your money goes~",
    },
    bg: "from-purple-200/40 via-blue-200/30 to-transparent",
  },
  {
    image: saveImg,
    title: { id: "Mulai Menabung Yuk!", en: "Start Saving Today!" },
    desc: {
      id: "Bikin budget bulanan dan capai goal tabunganmu satu langkah demi satu langkah 💪",
      en: "Set monthly budgets and reach your savings goals one step at a time 💪",
    },
    bg: "from-pink-200/40 via-yellow-100/30 to-transparent",
  },
  {
    image: achieveImg,
    title: { id: "Raih Pencapaianmu", en: "Unlock Achievements" },
    desc: {
      id: "Dapatkan XP, badge, dan rayakan progres finansialmu jadi lebih seru!",
      en: "Earn XP, badges, and celebrate your financial progress in a fun way!",
    },
    bg: "from-teal-200/40 via-orange-100/30 to-transparent",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const finish = () => {
    markOnboardingDone();
    navigate("/auth", { replace: true });
  };

  const next = () => {
    if (index < SLIDES.length - 1) setIndex(index + 1);
    else finish();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && index < SLIDES.length - 1) setIndex(index + 1);
      if (dx > 0 && index > 0) setIndex(index - 1);
    }
    startX.current = null;
  };

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <div
      className="min-h-screen bg-background flex flex-col overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Skip */}
      <div className="flex justify-end px-6 pt-6 pb-2">
        {!isLast && (
          <button
            onClick={finish}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
          >
            {lang === "id" ? "Lewati" : "Skip"}
          </button>
        )}
      </div>

      {/* Slides */}
      <div className="flex-1 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((s, i) => (
            <div key={i} className="w-full shrink-0 flex flex-col items-center justify-center px-8">
              <div
                className={`relative w-full max-w-xs aspect-square flex items-center justify-center rounded-[2.5rem] bg-gradient-to-br ${s.bg} mb-8`}
              >
                <img
                  src={s.image}
                  alt={s.title[lang]}
                  loading={i === 0 ? "eager" : "lazy"}
                  width={1024}
                  height={1024}
                  className="w-full h-full object-contain p-6 drop-shadow-xl"
                />
              </div>
              <h2 className="text-2xl font-extrabold text-center text-foreground mb-3">
                {s.title[lang]}
              </h2>
              <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
                {s.desc[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator + CTA */}
      <div className="px-6 pb-10 pt-4 space-y-6">
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full py-4 rounded-2xl gradient-hero text-primary-foreground font-extrabold text-base shadow-soft active:scale-[0.98] transition-transform"
        >
          {isLast
            ? lang === "id"
              ? "Mulai Sekarang 🚀"
              : "Get Started 🚀"
            : lang === "id"
              ? "Lanjut"
              : "Next"}
        </button>
      </div>
    </div>
  );
}
