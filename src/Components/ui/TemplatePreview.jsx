const ink = "#1a120b";
const muted = "#cdbda6";
const faint = "#e2d4bd";

function Line({ width, opacity = 1, color = muted, h = 3 }) {
  return (
    <div
      style={{
        width,
        height: h,
        backgroundColor: color,
        opacity,
        borderRadius: 1,
      }}
    />
  );
}

function SectionHead({ label }) {
  return (
    <div
      className="text-[7px] tracking-[0.2em] uppercase"
      style={{ color: ink, opacity: 0.7 }}
    >
      {label}
    </div>
  );
}

function Sidebar() {
  return (
    <div
      className="w-full h-full flex"
      style={{ backgroundColor: "#ffffff", padding: 14 }}
    >
      <div
        className="flex flex-col gap-3 p-3 rounded"
        style={{ width: "38%", backgroundColor: ink, color: "#fff" }}
      >
        <div
          className="text-[11px] tracking-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Your name
        </div>
        <div className="flex flex-col gap-1.5 mt-1">
          <Line width="80%" color="#fff" opacity={0.5} h={2} />
          <Line width="65%" color="#fff" opacity={0.4} h={2} />
          <Line width="70%" color="#fff" opacity={0.4} h={2} />
        </div>
        <div className="mt-3 space-y-2">
          <div
            className="text-[6px] tracking-[0.2em] uppercase"
            style={{ color: "#fff", opacity: 0.6 }}
          >
            Skills
          </div>
          <Line width="85%" color="#fff" opacity={0.45} h={2} />
          <Line width="70%" color="#fff" opacity={0.4} h={2} />
          <Line width="80%" color="#fff" opacity={0.4} h={2} />
          <Line width="60%" color="#fff" opacity={0.35} h={2} />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-3 pl-3">
        <SectionHead label="Experience" />
        <div className="space-y-1.5">
          <Line width="70%" color={ink} opacity={0.85} h={2.5} />
          <Line width="100%" opacity={0.5} h={2} />
          <Line width="92%" opacity={0.45} h={2} />
          <Line width="78%" opacity={0.4} h={2} />
        </div>
        <SectionHead label="Projects" />
        <div className="space-y-1.5">
          <Line width="60%" color={ink} opacity={0.85} h={2.5} />
          <Line width="98%" opacity={0.45} h={2} />
          <Line width="86%" opacity={0.4} h={2} />
        </div>
        <SectionHead label="Education" />
        <div className="space-y-1.5">
          <Line width="65%" color={ink} opacity={0.85} h={2.5} />
          <Line width="80%" opacity={0.4} h={2} />
        </div>
      </div>
    </div>
  );
}

function Classic() {
  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      style={{ backgroundColor: "#ffffff", padding: 18 }}
    >
      <div className="text-center">
        <div
          className="text-[14px] tracking-tight"
          style={{ fontFamily: "var(--font-serif)", color: ink }}
        >
          Your name
        </div>
        <div
          className="text-[7px] tracking-[0.18em] uppercase mt-1"
          style={{ color: ink, opacity: 0.55 }}
        >
          Software engineer
        </div>
      </div>
      <div
        className="h-px w-full mt-1"
        style={{ backgroundColor: faint }}
      />
      {["Profile", "Experience", "Projects", "Education"].map((label) => (
        <div key={label} className="space-y-1.5">
          <SectionHead label={label} />
          <Line width="100%" opacity={0.5} h={2} />
          <Line width="94%" opacity={0.45} h={2} />
          <Line width="88%" opacity={0.4} h={2} />
          {(label === "Experience" || label === "Projects") && (
            <Line width="72%" opacity={0.35} h={2} />
          )}
        </div>
      ))}
    </div>
  );
}

function Standard() {
  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      style={{ backgroundColor: "#ffffff", padding: 18 }}
    >
      <div>
        <div
          className="text-[13px] tracking-tight"
          style={{ fontFamily: "var(--font-serif)", color: ink }}
        >
          Your name
        </div>
        <div className="flex gap-2 mt-1">
          <Line width={26} opacity={0.5} h={2} />
          <Line width={32} opacity={0.5} h={2} />
          <Line width={20} opacity={0.5} h={2} />
        </div>
      </div>
      <div
        className="h-px w-full"
        style={{ backgroundColor: faint }}
      />
      {[
        ["Personal Summary", 3],
        ["Experience", 4],
        ["Skills", 2],
        ["Education", 2],
      ].map(([label, rows]) => (
        <div
          key={label}
          className="grid"
          style={{ gridTemplateColumns: "1fr 2fr", gap: 8 }}
        >
          <SectionHead label={label} />
          <div className="space-y-1.5">
            {Array.from({ length: rows }).map((_, i) => (
              <Line
                key={i}
                width={`${100 - i * 8}%`}
                opacity={0.5 - i * 0.05}
                h={2}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Modern() {
  return (
    <div
      className="w-full h-full flex flex-col gap-3"
      style={{ backgroundColor: "#ffffff", padding: 18 }}
    >
      <div className="flex items-center gap-3">
        <div
          className="rounded-full"
          style={{ width: 36, height: 36, backgroundColor: ink }}
        />
        <div className="flex-1">
          <div
            className="text-[13px] tracking-tight"
            style={{ fontFamily: "var(--font-serif)", color: ink }}
          >
            Your name
          </div>
          <div
            className="text-[7px] tracking-[0.18em] uppercase mt-1"
            style={{ color: ink, opacity: 0.55 }}
          >
            Software engineer
          </div>
        </div>
      </div>
      <div
        className="h-px w-full"
        style={{ backgroundColor: faint }}
      />
      {["About", "Experience", "Skills", "Education"].map((label) => (
        <div key={label} className="space-y-1.5">
          <SectionHead label={label} />
          <Line width="98%" opacity={0.5} h={2} />
          <Line width="90%" opacity={0.45} h={2} />
          {label === "Experience" && (
            <>
              <Line width="80%" opacity={0.4} h={2} />
              <Line width="70%" opacity={0.35} h={2} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default function TemplatePreview({ variant }) {
  const Inner =
    variant === "sidebar"
      ? Sidebar
      : variant === "classic"
      ? Classic
      : variant === "modern"
      ? Modern
      : Standard;

  return (
    <div
      className="w-full h-full flex items-center justify-center p-5"
      style={{
        background:
          "radial-gradient(circle at 30% 25%, #F4C9A8 0%, transparent 55%), radial-gradient(circle at 75% 70%, #C9B6E4 0%, transparent 55%), linear-gradient(135deg, #F2E2C8 0%, #EAD3BF 100%)",
      }}
    >
      <div
        className="w-full h-full rounded-md overflow-hidden"
        style={{
          aspectRatio: "1 / 1.414",
          boxShadow: "0 8px 24px rgba(26, 18, 11, 0.12)",
        }}
      >
        <Inner />
      </div>
    </div>
  );
}
