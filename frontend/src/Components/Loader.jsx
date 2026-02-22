import { useEffect, useState } from "react";
import React  from "react";
const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90; // stop at 80% like UC style
        }
        return prev +1.5;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}  >
      <div style={styles.content} className=" flex flex-col items-center  justify-center    ">

        <div style={styles.logoRow} className=" flex flex-col items-center justify-between mt-10 ">
          <div className={`  transition-all `}
        style={{
          clipPath: `inset(${100 - progress}% 0 0 0)`
        }}
      > 
        <img src="/bigger2.png" width={400} height={400}   />
      </div>
        </div>
 
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progress,
              width: `${progress}%`,
            }}
          />
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#f2f2f2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    textAlign: "center",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "25px",
  },
  logoBox: {
    backgroundColor: "black",
    color: "white",
    fontWeight: "bold",
    padding: "8px 12px",
    borderRadius: "8px",
  },
  companyName: {
    fontSize: "22px",
    fontWeight: "600",
  },
  progressBar: {
    width: "300px",
    height: "6px",
    backgroundColor: "#ddd",
    borderRadius: "10px",
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: " black",
    transition: "width 0.2s ease",
  },
};

export default Loader;