import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BirthdayMessage } from "../BirthdayMessage";
import { PartyItem } from "../PartyItem";
import {
  PARTY_CONTENT,
  PARTY_DECOR,
  PARTY_ITEMS,
  type PartyItemId,
  type PartyRegion,
} from "../../constants/party";
import "./styles.scss";

type PartySceneProps = {
  playCount: number;
  onComplete: () => void;
  onProgress: (text: string) => void;
};

const confetti = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: `${(i * 37 + 13) % 100}%`,
  color: ["#ff4fa3", "#3b5bff", "#ffd93d", "#ff7a00", "#9b6dff", "#168b95"][
    i % 6
  ],
  rotation: (i * 79) % 180,
}));

export function PartyScene({
  playCount,
  onComplete,
  onProgress,
}: PartySceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playCount === 0 || !sceneRef.current) return;

    const root = sceneRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      gsap.set("[data-party-item]", {
        autoAlpha: 0,
        scale: 0.35,
        y: 26,
        rotation: -10,
      });
      gsap.set(".scene-graphics", { autoAlpha: 0 });
      gsap.set(".scene-banner", { autoAlpha: 0, y: -30, scale: 0.85 });
      gsap.set(".birthday-message", {
        autoAlpha: 0,
        y: 24,
        scale: 0.85,
        rotation: -4,
      });
      gsap.set("[data-confetti]", { autoAlpha: 0, y: -60 });

      if (reduceMotion) {
        gsap.set(
          "[data-party-item], .scene-banner, .birthday-message, .scene-graphics",
          { autoAlpha: 1, scale: 1, rotation: 0, y: 0 },
        );
        onProgress(PARTY_CONTENT.status.finished);
        onComplete();
        return;
      }

      const pop = (id: PartyItemId) => `[data-party-item="${id}"]`;

      const tl = gsap.timeline({ onComplete });
      tl.call(() => onProgress(PARTY_CONTENT.status.preparing))
        .to(".scene-banner", {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: "back.out(1.7)",
        })
        .to(".scene-graphics", { autoAlpha: 1, duration: 0.35 }, "<")
        .to(
          pop("balloons"),
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(2)",
          },
          "-=0.3",
        )
        .call(() => onProgress(PARTY_CONTENT.status.cake))
        .to(pop("grill"), {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.75,
          ease: "back.out(2)",
        })
        .to(
          pop("drink"),
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(2)",
          },
        )
        .to(
          pop("tart"),
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.55,
            ease: "back.out(2)",
          },
          "-=0.25",
        )
        .call(() => onProgress(PARTY_CONTENT.status.fandom))
        .to(
          pop("team"),
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.65,
            ease: "back.out(2)",
          },
          // Preserve the pause before the team entrance after removing the unused tween.
          "+=0.4",
        )
        .to(
          '[data-party-item="taylor"], [data-party-item="meme"]',
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            stagger: 0.18,
            ease: "back.out(2)",
          },
          "-=0.25",
        )
        .to(
          '[data-party-item="thirteen"]',
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.45,
            ease: "back.out(1.7)",
          },
          "-=0.25",
        )
        .call(() => onProgress(PARTY_CONTENT.status.car))
        .fromTo(
          pop("car"),
          {
            autoAlpha: 1,
            x: root.clientWidth + 250,
            y: 0,
            rotation: 0,
            scale: 1,
          },
          { x: 0, duration: 1.25, ease: "power3.out" },
          "+=0.15",
        )
        .to(pop("car"), {
          x: -12,
          rotation: 0,
          duration: 0.12,
          ease: "power1.out",
        })
        .to(pop("car"), {
          x: 0,
          rotation: 0,
          duration: 0.22,
          ease: "elastic.out(1,0.4)",
        })
        .call(() => onProgress(PARTY_CONTENT.status.finished))
        .to(
          ".birthday-message",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.78,
            ease: "back.out(1.25)",
          },
          "+=0.15",
        )
        .to(
          "[data-confetti]",
          {
            autoAlpha: 1,
            y: (_, target) =>
              root.clientHeight +
              80 +
              (Number((target as HTMLElement).dataset.confetti) % 6) * 20,
            x: (_, target) =>
              (Number((target as HTMLElement).dataset.confetti) % 2 ? 1 : -1) *
              (45 + Math.random() * 95),
            rotation: "+=440",
            duration: 2.2,
            ease: "power1.out",
            stagger: { each: 0.035, from: "random" },
          },
          "-=0.65",
        );
    }, root);

    return () => ctx.revert();
  }, [playCount, onComplete, onProgress]);

  const renderRegion = (region: PartyRegion) =>
    PARTY_ITEMS.filter((item) => item.region === region).map((item) => (
      <PartyItem item={item} key={item.id} />
    ));

  return (
    <div className="party-scene" ref={sceneRef}>
      <div
        className="party-scene__paper party-scene__paper--pink"
        aria-hidden="true"
      />
      <div
        className="party-scene__paper party-scene__paper--blue"
        aria-hidden="true"
      />
      <div className="party-scene__graphics scene-graphics" aria-hidden="true">
        <img
          className="party-scene__doodles"
          src={PARTY_DECOR.doodles}
          alt=""
        />
        <img className="party-scene__decal" src={PARTY_DECOR.stickers} alt="" />
        <span className="party-scene__checker" />
      </div>
      <div className="party-scene__top">
        {renderRegion("top")}
        <div className="party-scene__banner">
          <div className="scene-banner">
            <img src={PARTY_DECOR.header} alt="" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="party-scene__body">
        <div className="party-scene__side party-scene__side--left">
          {renderRegion("left")}
        </div>
        <div className="party-scene__message-layer">
          <BirthdayMessage />
        </div>
        <div className="party-scene__side party-scene__side--right">
          {renderRegion("right")}
        </div>
      </div>
      <div className="party-scene__base">{renderRegion("base")}</div>
      <div className="party-scene__confetti" aria-hidden="true">
        {confetti.map((piece) => (
          <i
            key={piece.id}
            data-confetti={piece.id}
            style={{
              left: piece.x,
              backgroundColor: piece.color,
              rotate: `${piece.rotation}deg`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
