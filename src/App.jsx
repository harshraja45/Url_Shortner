import { useState, useEffect } from "react";
import { TextField, Container, Typography, Paper, Grid } from "@mui/material";
import backgroundImage from './assets/urlshortner.jpg';

export default function App() {
  const [urls, setUrls] = useState([{ longUrl: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortenedUrls")) || [];
    setResults(stored);
  }, []);

  const addUrlInput = () => {
    if (urls.length < 5) setUrls([...urls, { longUrl: "", validity: "", shortcode: "" }]);
  };

  const clearAll = () => {
    setUrls([{ longUrl: "", validity: "", shortcode: "" }]);
    setResults([]);
    localStorage.removeItem("shortenedUrls");
  };

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const isValidUrl = (str) => {
    try { new URL(str); return true; } catch { return false; }
  };

  const generateShortcode = () => Math.random().toString(36).substring(2, 8);

  const saveToLocalStorage = (newResult) => {
    const stored = JSON.parse(localStorage.getItem("shortenedUrls")) || [];
    stored.push(newResult);
    localStorage.setItem("shortenedUrls", JSON.stringify(stored));
    setResults(stored);
  };

  const shortenUrls = async () => {
    setError("");
    for (let i = 0; i < urls.length; i++) {
      const { longUrl, validity, shortcode } = urls[i];
      if (!longUrl || !isValidUrl(longUrl)) {
        setError(`Invalid URL at entry ${i + 1}`);
        return;
      }
      if (validity && (!Number.isInteger(Number(validity)) || Number(validity) <= 0)) {
        setError(`Validity must be a positive integer at entry ${i + 1}`);
        return;
      }

      try {
        const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${longUrl}`);
        const data = await res.json();
        if (data.ok) {
          const shortcodeValue = shortcode || generateShortcode();
          const newResult = {
            longUrl,
            shortUrl: `/r/${shortcodeValue}`,
            expiry: validity
              ? new Date(Date.now() + Number(validity) * 86400000).toLocaleDateString()
              : "Default",
            shortcode: shortcodeValue,
            createdAt: new Date().toLocaleDateString()
          };
          saveToLocalStorage(newResult);
        } else {
          setError(`API failed for URL at entry ${i + 1}`);
          return;
        }
      } catch {
        setError(`Network error at entry ${i + 1}`);
        return;
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '50px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          padding: 20,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 12
        }}
      >
        <Container maxWidth="md">
          <h1>URL Shortener</h1>

          {urls.map((url, index) => (
            <Paper key={index} style={{ padding: 20, marginBottom: 20 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Original URL"
                    fullWidth
                    value={url.longUrl}
                    onChange={(e) => handleChange(index, "longUrl", e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Validity (days, optional)"
                    type="number"
                    fullWidth
                    value={url.validity}
                    onChange={(e) => handleChange(index, "validity", e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Custom Shortcode (optional)"
                    fullWidth
                    value={url.shortcode}
                    onChange={(e) => handleChange(index, "shortcode", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <div className="button-box" style={{ marginBottom: 20 }}>
            <button onClick={addUrlInput} disabled={urls.length >= 5}>Add Another URL</button>
            <button onClick={shortenUrls}>Shorten URLs</button>
            <button onClick={clearAll}>Clear All</button>
          </div>

          {error && <Typography color="error" style={{ marginTop: 20 }}>{error}</Typography>}

          {results.length > 0 && (
            <Paper style={{ padding: 20, marginTop: 30 }}>
              <Typography variant="h6" gutterBottom>Shortened URLs</Typography>
              {results.map((res, i) => (
                <Paper key={i} style={{ padding: 15, marginBottom: 15 }}>
                  <Typography>Original: {res.longUrl}</Typography>
                  <Typography>Shortened: <a href={res.shortUrl}>{res.shortUrl}</a></Typography>
                  <Typography>Expiry: {res.expiry}</Typography>
                  <Typography>Shortcode: {res.shortcode}</Typography>
                </Paper>
              ))}
            </Paper>
          )}
        </Container>
      </div>
    </div>
  );
}
