import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RedirectPage() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortenedUrls")) || [];
    const entry = stored.find((u) => u.shortcode === shortcode);

    if (entry) window.location.href = entry.longUrl;
    else navigate("/");
  }, [shortcode, navigate]);

  return (
    <div style={{ padding: 50, textAlign: "center", color: "#fff" }}>
      Redirecting...
    </div>
  );
}
