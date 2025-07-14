const LoadingDots = () => {
  return (
    <div
      className="wrapper"
      style={{
        // @ts-expect-error test
        "--uib-size": "43px",
        "--uib-color": "var(--color-lilac)",
        "--uib-speed": "1.3s",
        "--uib-dot-size": "calc(var(--uib-size) * 0.24)",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "var(--uib-dot-size)",
        width: "var(--uib-size)",
      }}
    >
      <div className="dot"></div>

      <style>{`
        .wrapper::before,
        .wrapper::after,
        .dot {
          content: '';
          display: block;
          height: var(--uib-dot-size);
          width: var(--uib-dot-size);
          border-radius: 50%;
          background-color: var(--uib-color);
          transform: scale(0);
          transition: background-color 0.3s ease;
        }
        
        .wrapper::before {
          animation: pulse var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.375) infinite;
        }
        
        .dot {
          animation: pulse var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.25) infinite both;
        }
        
        .wrapper::after {
          animation: pulse var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.125) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(0);
          }
          50% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingDots;
