interface PageHeaderProps {
  title: string;
  description: string;
  centered?: boolean;
}

export default function PageHeader({
  title,
  description,
  centered = false,
}: PageHeaderProps) {
  return (
    <div
      className="relative overflow-hidden mb-8"
      style={{
        clipPath:
          "polygon(24px 0, calc(100% - 48px) 0, 100% 48px, 100% 100%, 0 100%, 0 24px)",
      }}
    >
      {/* Video Background */}
      <video
        loop
        muted
        autoPlay
        playsInline
        className="absolute top-0 right-0 w-full h-full object-cover"
        poster="/ui/oversubscription.webp"
      >
        <source src="/ui/oversubscription.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div
        className="absolute top-0 right-0 w-full h-full"
        style={{ backgroundColor: "rgba(25, 25, 26, 0.5)" }}
      />

      {/* Content */}
      <div
        className={`relative z-10 px-8 py-12 ${
          centered ? "text-center max-w-4xl mx-auto" : ""
        }`}
        style={{ color: "#fff" }}
      >
        <div
          className={`flex items-center gap-3 mb-4 ${
            centered ? "justify-center" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="68"
            height="68"
            viewBox="0 0 68 68"
            fill="none"
            className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
          >
            <path
              d="M34 0C34.6638 18.4957 49.5043 33.3362 68 34C49.5043 34.6638 34.6638 49.5043 34 68C33.3362 49.5043 18.4957 34.6638 0 34C18.4957 33.3362 33.3362 18.4957 34 0Z"
              fill="white"
            />
          </svg>
          <h1 className="text-4xl sm:text-5xl font-black uppercase leading-none pt-2">
            {title}
          </h1>
        </div>
        <p className="text-sm sm:text-base font-bold uppercase max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  );
}

