export default function Footer() {
  const cols = [
    {
      title: "Resources",
      links: ["Articles", "Blog", "Chart Sheet", "Code challenges", "Docs", "Projects", "Videos", "Workspaces"],
      extra: { title: "Support", links: ["Help Center"] },
    },
    {
      title: "Plans",
      links: ["Paid memberships", "For students", "Business solutions"],
      extra: { title: "Community", links: ["Forums", "Chapters", "Events"] },
    },
    {
      title: "Subjects",
      links: ["AI", "Cloud Computing", "Code Foundations", "Computer Science", "Cybersecurity",
        "Data Analytics", "Data Science", "Data Visualization", "Developer Tools", "DevOps",
        "Game Development", "IT", "Machine Learning", "Math", "Mobile Development", "Web Design", "Web Development"],
    },
    {
      title: "Languages",
      links: ["Bash", "C", "C++", "C#", "Go", "HTML & CSS", "Java", "JavaScript", "Kotlin", "PHP", "Python", "R", "Ruby", "SQL", "Swift"],
    },
    {
      title: "Career building",
      links: ["Career paths", "Career services", "Interview prep", "Professional certification"],
      extra: { title: "", links: ["Full Catalog", "Beta Content"] },
    },
  ];

  return (
    <footer style={{ background: "#161D29", borderTop: "1px solid #2C3244", padding: "48px 40px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 60, marginBottom: 40, flexWrap: "wrap" }}>
          {/* Brand */}
          <div style={{ flex: "0 0 160px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 15, marginBottom: 12 }}>
              <div style={{ width: 26, height: 26, background: "#FFD60A", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 7v11h14V7L10 2z" fill="#000" />
                  <rect x="7" y="11" width="6" height="7" fill="#FFD60A" />
                </svg>
              </div>
              StudyNotion
            </div>
            <p style={{ color: "#AFB2BF", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
              Company
            </p>
            {["About", "Careers", "Affiliates"].map(l => (
              <p key={l} style={{ color: "#AFB2BF", fontSize: 13, cursor: "pointer", marginBottom: 7 }}>{l}</p>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: "50%", background: "#2C3244",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  color: "#AFB2BF", fontSize: 11,
                }}>
                  {["f", "◎", "▶", "t"][i]}
                </div>
              ))}
            </div>
          </div>

          {/* Columns */}
          <div style={{ display: "flex", gap: 48, flex: 1, flexWrap: "wrap" }}>
            {cols.map(col => (
              <div key={col.title} style={{ minWidth: 100 }}>
                <p style={{ color: "#F1F2FF", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{col.title}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {col.links.map(l => (
                    <span key={l} style={{ color: "#AFB2BF", fontSize: 13, cursor: "pointer" }}>{l}</span>
                  ))}
                </div>
                {col.extra && (
                  <>
                    <br />
                    {col.extra.title && (
                      <p style={{ color: "#F1F2FF", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{col.extra.title}</p>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {col.extra.links.map(l => (
                        <span key={l} style={{ color: "#AFB2BF", fontSize: 13, cursor: "pointer" }}>{l}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: "1px solid #2C3244", paddingTop: 20,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Cookie Policy", "Terms"].map(l => (
              <span key={l} style={{ color: "#AFB2BF", fontSize: 12, cursor: "pointer" }}>{l}</span>
            ))}
          </div>
          <span style={{ color: "#6B7280", fontSize: 12 }}>Made with ❤️ © 2023 Studynotion</span>
        </div>
      </div>
    </footer>
  );
}