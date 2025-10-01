"use client"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">

      <div className="noise-bg absolute inset-0" />

      <div className="absolute inset-0 opacity-30">
        <div
          className="wave-animation absolute -bottom-32 left-0 right-0 h-96"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 100%, #08d6b4 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />
        <div
          className="wave-animation-slow absolute -bottom-48 left-1/4 right-0 h-[500px]"
          style={{
            background: `radial-gradient(ellipse 70% 40% at 60% 100%, #08d6b4 0%, transparent 60%)`,
            animationDelay: "1s",
            filter: "blur(50px)",
          }}
        />
        <div
          className="wave-animation absolute -bottom-40 right-1/4 h-[450px] w-full"
          style={{
            background: `radial-gradient(ellipse 60% 45% at 40% 100%, rgba(8, 214, 180, 0.6) 0%, transparent 65%)`,
            animationDelay: "2s",
            filter: "blur(45px)",
          }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#08d6b4 1px, transparent 1px), linear-gradient(90deg, #08d6b4 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full"
            style={{
              backgroundColor: "#08d6b4",
              left: `87.2%`,
              top: `77.9%`,
              animation: `float 6s ease-in-out infinite`,
              animationDelay: "6s",
              boxShadow: "0 0 10px rgba(8, 214, 180, 0.8)",
            }}
          />
        ))}
      </div>
    </div>
  )
}
