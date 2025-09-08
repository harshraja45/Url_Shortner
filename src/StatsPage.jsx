import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Typography, Paper, Button } from "@mui/material";

export default function StatsPage() {
  const { shortcode } = useParams();
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortenedUrls")) || [];
    const found = stored.find((u) => u.shortcode === shortcode);
    setEntry(found || null);
  }, [shortcode]);

  const copyToClipboard = () => {
    if (entry) {
      navigator.clipboard.writeText(window.location.origin + entry.shortUrl);
      alert("Short URL copied to clipboard!");
    }
  };

  if (!entry) {
    return (
      <Container style={{ marginTop: 50 }}>
        <Paper
          style={{
            padding: 20,
            background: 'linear-gradient(135deg, #ff6a00, #ee0979)',
            color: '#fff',
            borderRadius: 12,
            boxShadow: 'rgba(0, 0, 0, 0.5) 0px 4px 12px',
            transition: 'all 0.4s ease',
          }}
        >
          <Typography variant="h6" color="error">
            Short URL not found
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: 50 }}>
      <Paper
        className="hover-card"
        style={{
          padding: 25,
          background: 'linear-gradient(135deg, #646cff, #535bf2)',
          color: '#fff',
          borderRadius: 12,
          boxShadow: 'rgba(0, 0, 0, 0.5) 0px 4px 12px',
          transition: 'all 0.4s ease',
        }}
      >
        <Typography variant="h5" gutterBottom style={{ fontWeight: '700', marginBottom: 20 }}>
          Short URL Stats
        </Typography>
        <Typography style={{ marginBottom: 10 }}>
          <strong>Shortcode:</strong> {entry.shortcode}
        </Typography>
        <Typography style={{ marginBottom: 10 }}>
          <strong>Original URL:</strong>{" "}
          <a href={entry.longUrl} target="_blank" rel="noreferrer">{entry.longUrl}</a>
        </Typography>
        <Typography style={{ marginBottom: 10 }}>
          <strong>Shortened URL:</strong>{" "}
          <a href={entry.shortUrl}>{entry.shortUrl}</a>
        </Typography>
        <Typography style={{ marginBottom: 10 }}>
          <strong>Expiry Date:</strong> {entry.expiry}
        </Typography>
        <Typography style={{ marginBottom: 15 }}>
          <strong>Created At:</strong> {entry.createdAt}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 10 }}
          onClick={copyToClipboard}
        >
          Copy Short URL
        </Button>
      </Paper>
    </Container>
  );
}
