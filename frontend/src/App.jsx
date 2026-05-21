// // update version 2
// import React, { useState, useRef, useEffect, useCallback } from "react"
// // import { useState, useRef, useEffect, useCallback } from "react"

// const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

// // ── API helpers ───────────────────────────────────────────────────────────────
// async function apiUpload(files) {
//   const fd = new FormData()
//   files.forEach(f => fd.append("files", f))
//   const r = await fetch(`${API}/upload`, { method: "POST", body: fd })
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiQuery(query, use_web) {
//   const r = await fetch(`${API}/query`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ query, use_web }),
//   })
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiHistory(limit = 20) {
//   const r = await fetch(`${API}/history?limit=${limit}`)
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiClearHistory() {
//   const r = await fetch(`${API}/history`, { method: "DELETE" })
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiFiles() {
//   const r = await fetch(`${API}/files`)
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// // ── Design tokens ─────────────────────────────────────────────────────────────
// const C = {
//   blue:     "#1a5ce6",
//   blueLt:   "#e8effe",
//   blueMd:   "#b3c8f9",
//   blueDk:   "#0f3fa8",
//   slate:    "#f7f8fc",
//   border:   "#e2e6ef",
//   text:     "#0d1a2e",
//   muted:    "#64748b",
//   green:    "#16a34a",
//   greenLt:  "#dcfce7",
//   red:      "#dc2626",
//   redLt:    "#fee2e2",
//   amber:    "#d97706",
//   amberLt:  "#fef3c7",
// }

// // ── Shared components ─────────────────────────────────────────────────────────

// function Spinner({ size = 14 }) {
//   return (
//     <span style={{
//       display: "inline-block", width: size, height: size,
//       border: `2px solid ${C.blueMd}`, borderTopColor: C.blue,
//       borderRadius: "50%", animation: "spin 0.6s linear infinite",
//     }} />
//   )
// }

// function Badge({ children, color = "blue" }) {
//   const colors = {
//     blue:  { bg: C.blueLt,  text: C.blue },
//     green: { bg: C.greenLt, text: C.green },
//     amber: { bg: C.amberLt, text: C.amber },
//     red:   { bg: C.redLt,   text: C.red },
//   }
//   const c = colors[color] || colors.blue
//   return (
//     <span style={{
//       background: c.bg, color: c.text,
//       fontSize: 11, fontFamily: "'IBM Plex Mono', monospace",
//       fontWeight: 500, padding: "2px 8px", borderRadius: 4,
//     }}>
//       {children}
//     </span>
//   )
// }

// function Alert({ type = "success", children }) {
//   const styles = {
//     success: { bg: C.greenLt, border: "#86efac", color: "#15803d", icon: "✓" },
//     error:   { bg: C.redLt,   border: "#fca5a5", color: C.red,     icon: "✕" },
//   }
//   const s = styles[type]
//   return (
//     <div style={{
//       display: "flex", alignItems: "flex-start", gap: 10,
//       padding: "12px 14px", borderRadius: 7,
//       background: s.bg, border: `1px solid ${s.border}`, color: s.color,
//       fontSize: 13, marginTop: 12,
//     }}>
//       <span style={{ fontWeight: 700, marginTop: 1 }}>{s.icon}</span>
//       <span>{children}</span>
//     </div>
//   )
// }

// function Card({ children, style = {} }) {
//   return (
//     <div style={{
//       background: "#fff", border: `1.5px solid ${C.border}`,
//       borderRadius: 10, padding: 20, ...style,
//     }}>
//       {children}
//     </div>
//   )
// }

// function CardHeader({ icon, title, desc }) {
//   return (
//     <div style={{
//       display: "flex", alignItems: "center", gap: 10,
//       marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${C.border}`,
//     }}>
//       <div style={{
//         width: 32, height: 32, borderRadius: 7,
//         background: C.blueLt, display: "flex",
//         alignItems: "center", justifyContent: "center",
//         fontSize: 18, color: C.blue,
//       }}>
//         {icon}
//       </div>
//       <div>
//         <div style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 700, fontSize: 14, color: C.text }}>
//           {title}
//         </div>
//         {desc && <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{desc}</div>}
//       </div>
//     </div>
//   )
// }

// function Btn({ children, onClick, disabled, variant = "primary", size = "md", fullWidth = false, style = {} }) {
//   const variants = {
//     primary: { bg: C.blue,    color: "#fff",   border: C.blue },
//     outline: { bg: "#fff",    color: C.text,   border: C.border },
//     danger:  { bg: C.redLt,   color: C.red,    border: "#fca5a5" },
//   }
//   const sizes = {
//     sm: { padding: "6px 12px", fontSize: 12 },
//     md: { padding: "9px 18px", fontSize: 13 },
//   }
//   const v = variants[variant]
//   const s = sizes[size]
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       style={{
//         display: "inline-flex", alignItems: "center", gap: 7,
//         justifyContent: "center",
//         padding: s.padding, fontSize: s.fontSize,
//         fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500,
//         background: v.bg, color: v.color,
//         border: `1.5px solid ${v.border}`,
//         borderRadius: 7, cursor: disabled ? "not-allowed" : "pointer",
//         opacity: disabled ? 0.5 : 1,
//         width: fullWidth ? "100%" : "auto",
//         marginTop: fullWidth ? 12 : 0,
//         transition: "all 0.15s",
//         ...style,
//       }}
//     >
//       {children}
//     </button>
//   )
// }

// function Toggle({ on, onToggle, label, icon }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.text, fontWeight: 500 }}>
//         <span style={{ fontSize: 16 }}>{icon}</span>
//         {label}
//       </div>
//       <div
//         onClick={onToggle}
//         style={{
//           width: 38, height: 20, background: on ? C.blue : C.border,
//           borderRadius: 10, cursor: "pointer", position: "relative",
//           transition: "background 0.2s",
//         }}
//       >
//         <div style={{
//           position: "absolute", top: 3, left: on ? 21 : 3,
//           width: 14, height: 14, background: "#fff",
//           borderRadius: "50%", transition: "left 0.2s",
//         }} />
//       </div>
//     </div>
//   )
// }

// // ── Sidebar ───────────────────────────────────────────────────────────────────
// function Sidebar({ active, setActive, fileCount }) {
//   const nav = [
//     { id: "upload",  icon: "📂", label: "Documents", badge: fileCount },
//     { id: "query",   icon: "🔍", label: "Analysis" },
//     { id: "history", icon: "🕓", label: "History" },
//     { id: "stack",   icon: "⚙️",  label: "Tech Stack" },
//   ]
//   return (
//     <aside style={{
//       width: 210, background: "#fff",
//       borderRight: `1.5px solid ${C.border}`,
//       display: "flex", flexDirection: "column",
//       padding: "20px 0", flexShrink: 0,
//     }}>
//       {/* Logo */}
//       <div style={{ padding: "0 20px 20px" }}>
//         <div style={{
//           fontFamily: "'Epilogue', sans-serif", fontWeight: 800,
//           fontSize: 20, color: C.blue, letterSpacing: "-0.5px",
//         }}>
//           Nexus<span style={{ color: C.text }}>AI</span>
//         </div>
//         <div style={{
//           fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
//           color: C.muted, letterSpacing: "0.8px", marginTop: 2,
//         }}>
//           RAG · AGENT · LLM
//         </div>
//       </div>

//       <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.2px", color: C.muted, padding: "0 20px 8px", textTransform: "uppercase" }}>
//         Workspace
//       </div>

//       {nav.map(({ id, icon, label, badge }) => {
//         const isActive = active === id
//         return (
//           <div
//             key={id}
//             onClick={() => setActive(id)}
//             style={{
//               display: "flex", alignItems: "center", gap: 10,
//               padding: "9px 20px", fontSize: 13, fontWeight: 500,
//               color: isActive ? C.blue : C.muted,
//               background: isActive ? C.blueLt : "transparent",
//               borderLeft: `3px solid ${isActive ? C.blue : "transparent"}`,
//               cursor: "pointer", transition: "all 0.15s",
//             }}
//           >
//             <span style={{ fontSize: 15 }}>{icon}</span>
//             <span style={{ flex: 1 }}>{label}</span>
//             {badge > 0 && (
//               <span style={{
//                 fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
//                 background: C.blue, color: "#fff",
//                 padding: "1px 6px", borderRadius: 10,
//               }}>
//                 {badge}
//               </span>
//             )}
//           </div>
//         )
//       })}

//       {/* Footer */}
//       <div style={{
//         marginTop: "auto", padding: "16px 20px",
//         borderTop: `1px solid ${C.border}`,
//         fontSize: 11, color: C.muted, lineHeight: 1.6,
//       }}>
//         <div style={{ fontWeight: 600, color: C.text, fontSize: 12, marginBottom: 2 }}>Nexus RAG Engine</div>
//         FastAPI · LangChain<br />FAISS · PostgreSQL
//         <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
//           <div style={{
//             width: 7, height: 7, borderRadius: "50%",
//             background: C.green, animation: "pulse 2s infinite",
//           }} />
//           <span>Gemini 1.5 Flash</span>
//         </div>
//       </div>
//     </aside>
//   )
// }

// // ── Topbar ────────────────────────────────────────────────────────────────────
// function Topbar() {
//   return (
//     <div style={{
//       background: "#fff", borderBottom: `1.5px solid ${C.border}`,
//       height: 52, display: "flex", alignItems: "center",
//       padding: "0 24px", gap: 10, flexShrink: 0,
//     }}>
//       <span style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 700, fontSize: 14, color: C.text }}>
//         AI Research Engine
//       </span>
//       <Badge>v1.0</Badge>
//       <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}>
//         <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
//         Connected · Gemini 1.5 Flash
//       </div>
//     </div>
//   )
// }

// // ── Page Header ───────────────────────────────────────────────────────────────
// function PageHeader({ title, sub, action }) {
//   return (
//     <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
//       <div>
//         <div style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 800, fontSize: 22, color: C.text, letterSpacing: "-0.3px" }}>
//           {title}
//         </div>
//         <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{sub}</div>
//       </div>
//       {action}
//     </div>
//   )
// }

// // ── Stat Cards ────────────────────────────────────────────────────────────────
// function StatGrid({ files, chunks, queries }) {
//   const stats = [
//     { val: files,   label: "Files uploaded" },
//     { val: chunks,  label: "Vector chunks" },
//     { val: queries, label: "Queries run" },
//   ]
//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
//       {stats.map((s, i) => (
//         <div key={i} style={{ background: C.slate, borderRadius: 8, padding: "14px 16px" }}>
//           <div style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 800, fontSize: 24, color: C.text }}>
//             {s.val}
//           </div>
//           <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.label}</div>
//         </div>
//       ))}
//     </div>
//   )
// }

// // ── Upload Page ───────────────────────────────────────────────────────────────
// function UploadPage({ stats, setStats, indexedFiles, setIndexedFiles }) {
//   const [pending, setPending]       = useState([])
//   const [uploading, setUploading]   = useState(false)
//   const [alert, setAlert]           = useState(null)
//   const [dragging, setDragging]     = useState(false)
//   const inputRef = useRef()

//   const addFiles = useCallback((files) => {
//     const pdfs = [...files].filter(f => f.type === "application/pdf")
//     setPending(prev => {
//       const names = new Set(prev.map(p => p.name))
//       return [...prev, ...pdfs.filter(f => !names.has(f.name))]
//     })
//   }, [])

//   const handleDrop = useCallback((e) => {
//     e.preventDefault(); setDragging(false)
//     addFiles(e.dataTransfer.files)
//   }, [addFiles])

//   const doUpload = async () => {
//     if (!pending.length) return
//     setUploading(true); setAlert(null)
//     try {
//       const data = await apiUpload(pending)
//       setAlert({ type: "success", msg: data.message })
//       const newChunks = (data.files || []).reduce((s, f) => s + (f.chunks || 0), 0)
//       setStats(prev => ({
//         files:   prev.files + pending.length,
//         chunks:  prev.chunks + newChunks,
//         queries: prev.queries,
//       }))
//       setIndexedFiles(prev => [...prev, ...(data.files || [])])
//       setPending([])
//     } catch (e) {
//       setAlert({ type: "error", msg: e.message })
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <PageHeader title="Document Corpus" sub="Upload PDFs to build the RAG knowledge base" />

//       <StatGrid files={stats.files} chunks={stats.chunks} queries={stats.queries} />

//       <Card>
//         <CardHeader icon="⬆" title="Upload Documents" desc="PDF files only · Multiple files supported" />

//         {/* Drop zone */}
//         <div
//           onClick={() => inputRef.current?.click()}
//           onDrop={handleDrop}
//           onDragOver={e => { e.preventDefault(); setDragging(true) }}
//           onDragLeave={() => setDragging(false)}
//           style={{
//             border: `2px dashed ${dragging ? C.blue : C.blueMd}`,
//             borderRadius: 8, padding: "36px 20px", textAlign: "center",
//             cursor: "pointer", background: dragging ? "#dce8fd" : C.blueLt,
//             transition: "all 0.15s",
//           }}
//         >
//           <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
//           <div style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 700, fontSize: 14, color: C.text }}>
//             Drop PDFs here or click to browse
//           </div>
//           <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Multiple files · Max 10MB each</div>
//         </div>
//         <input ref={inputRef} type="file" accept=".pdf" multiple style={{ display: "none" }}
//           onChange={e => addFiles(e.target.files)} />

//         {/* Pending list */}
//         {pending.length > 0 && (
//           <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
//             {pending.map((f, i) => (
//               <div key={i} style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "10px 12px", background: C.slate,
//                 border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 13,
//               }}>
//                 <span style={{ fontSize: 16 }}>📄</span>
//                 <span style={{ flex: 1, color: C.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
//                 <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: C.muted }}>
//                   {(f.size / 1024).toFixed(0)} KB
//                 </span>
//                 <span
//                   onClick={() => setPending(prev => prev.filter((_, j) => j !== i))}
//                   style={{ color: C.muted, cursor: "pointer", fontSize: 16, lineHeight: 1 }}
//                 >✕</span>
//               </div>
//             ))}
//             <Btn onClick={doUpload} disabled={uploading} fullWidth>
//               {uploading ? <><Spinner /> Processing…</> : <>⚡ Build Knowledge Base</>}
//             </Btn>
//           </div>
//         )}

//         {alert && <Alert type={alert.type}>{alert.msg}</Alert>}
//       </Card>

//       {/* Indexed files */}
//       <Card>
//         <CardHeader icon="🗄" title="Indexed Files" desc="Stored in PostgreSQL · FAISS vector index on disk" />
//         {indexedFiles.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "32px 0", color: C.muted, fontSize: 13 }}>
//             <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>📭</div>
//             No files indexed yet
//           </div>
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//             {indexedFiles.map((f, i) => (
//               <div key={i} style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "10px 12px", background: C.slate,
//                 border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 13,
//               }}>
//                 <span>📄</span>
//                 <span style={{ flex: 1, fontWeight: 500, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                   {f.name}
//                 </span>
//                 <Badge color="green">{f.chunks} chunks</Badge>
//               </div>
//             ))}
//           </div>
//         )}
//       </Card>
//     </div>
//   )
// }

// // ── Query Page ────────────────────────────────────────────────────────────────
// function QueryPage({ onQuerySuccess }) {
//   const [query, setQuery]     = useState("")
//   const [useWeb, setUseWeb]   = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [result, setResult]   = useState(null)
//   const [error, setError]     = useState(null)

//   const doQuery = async () => {
//     if (!query.trim()) return
//     setLoading(true); setResult(null); setError(null)
//     try {
//       const data = await apiQuery(query, useWeb)
//       setResult(data)
//       onQuerySuccess(data, query, useWeb)
//     } catch (e) {
//       setError(e.message || "Query failed. Make sure documents are uploaded first.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <PageHeader title="Intelligent Analysis" sub="ReAct agent with hybrid BM25 + vector retrieval" />

//       <Card>
//         <CardHeader icon="🔍" title="Query Engine" desc="Ask anything about your uploaded documents" />

//         <textarea
//           value={query}
//           onChange={e => setQuery(e.target.value)}
//           onKeyDown={e => { if (e.key === "Enter" && e.metaKey) doQuery() }}
//           rows={4}
//           placeholder={"e.g. Summarize the key findings across all documents…\ne.g. What are the candidate's top skills?\ne.g. Compare the methodologies in the research papers…"}
//           style={{
//             width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 8,
//             padding: 12, fontSize: 13, fontFamily: "'IBM Plex Sans',sans-serif",
//             color: C.text, resize: "none", outline: "none",
//             background: "#fff", lineHeight: 1.6, transition: "border 0.15s",
//           }}
//           onFocus={e => e.target.style.borderColor = C.blue}
//           onBlur={e => e.target.style.borderColor = C.border}
//         />

//         <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 12, paddingTop: 4 }}>
//           <Toggle
//             on={useWeb} onToggle={() => setUseWeb(p => !p)}
//             icon="🌐" label="Enable web search (Serper API)"
//           />
//         </div>

//         {error && <Alert type="error">{error}</Alert>}

//         <Btn onClick={doQuery} disabled={loading || !query.trim()} fullWidth>
//           {loading ? <><Spinner /> Analyzing…</> : <>▶ Run Analysis</>}
//         </Btn>
//       </Card>

//       {result && <ResultDisplay result={result} />}
//     </div>
//   )
// }

// // ── Result Display ────────────────────────────────────────────────────────────
// function ResultDisplay({ result }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="fade-up">

//       {/* Answer */}
//       <Card>
//         <div style={{
//           fontSize: 10, fontWeight: 600, letterSpacing: "1px",
//           textTransform: "uppercase", color: C.muted, marginBottom: 10,
//           display: "flex", alignItems: "center", gap: 6,
//         }}>
//           ✨ AI Answer
//         </div>
//         <div style={{
//           background: C.slate, border: `1.5px solid ${C.border}`,
//           borderRadius: 8, padding: 16, fontSize: 13,
//           color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap",
//         }}>
//           {result.answer}
//         </div>
//       </Card>

//       {/* Sources */}
//       {result.sources?.length > 0 && (
//         <Card>
//           <div style={{
//             fontSize: 10, fontWeight: 600, letterSpacing: "1px",
//             textTransform: "uppercase", color: C.muted, marginBottom: 12,
//           }}>
//             📌 Source References ({result.sources.length})
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//             {result.sources.map((s, i) => (
//               <div key={i} style={{
//                 display: "flex", gap: 10, padding: 12,
//                 background: "#fff", border: `1px solid ${C.border}`,
//                 borderRadius: 7,
//               }}>
//                 <Badge color="amber">#{i + 1}</Badge>
//                 <div>
//                   <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>
//                     {s.source?.split("/").pop() || "document"}
//                   </div>
//                   <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Page {(s.page || 0) + 1}</div>
//                   <div style={{ fontSize: 12, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>
//                     {s.snippet}…
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       {/* Web results */}
//       {result.web_results?.length > 0 && (
//         <Card>
//           <div style={{
//             fontSize: 10, fontWeight: 600, letterSpacing: "1px",
//             textTransform: "uppercase", color: C.muted, marginBottom: 12,
//           }}>
//             🌐 Web Insights
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//             {result.web_results.map((w, i) => (
//               <div key={i} style={{
//                 padding: 12, background: C.slate,
//                 border: `1px solid ${C.border}`, borderRadius: 7,
//               }}>
//                 <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 4 }}>
//                   {w.title}
//                 </div>
//                 <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{w.snippet}</div>
//                 {w.url && (
//                   <a href={w.url} target="_blank" rel="noreferrer"
//                     style={{ fontSize: 11, color: C.blue, fontFamily: "'IBM Plex Mono',monospace", marginTop: 4, display: "block" }}>
//                     {w.url}
//                   </a>
//                 )}
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}
//     </div>
//   )
// }

// // ── History Page ──────────────────────────────────────────────────────────────
// function HistoryPage({ localHistory, setLocalHistory }) {
//   const [serverHistory, setServerHistory] = useState([])
//   const [loading, setLoading]             = useState(true)
//   const [expanded, setExpanded]           = useState(null)

//   useEffect(() => {
//     apiHistory()
//       .then(d => setServerHistory(d.history || []))
//       .catch(() => {})
//       .finally(() => setLoading(false))
//   }, [])

//   const allHistory = [
//     ...localHistory,
//     ...serverHistory.filter(s => !localHistory.find(l => l.query === s.query && l.answer === s.answer)),
//   ]

//   const clearAll = async () => {
//     try {
//       await apiClearHistory()
//       setServerHistory([])
//       setLocalHistory([])
//     } catch (e) {
//       alert("Failed to clear: " + e.message)
//     }
//   }

//   return (
//     <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <PageHeader
//         title="Query History"
//         sub={`${allHistory.length} queries stored in PostgreSQL`}
//         action={
//           allHistory.length > 0 && (
//             <Btn variant="danger" size="sm" onClick={clearAll}>🗑 Clear all</Btn>
//           )
//         }
//       />

//       {loading ? (
//         <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.muted, fontSize: 13 }}>
//           <Spinner /> Loading history…
//         </div>
//       ) : allHistory.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "64px 0", color: C.muted }}>
//           <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>🕓</div>
//           <div style={{ fontSize: 13 }}>No queries yet — run an analysis first</div>
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {allHistory.map((h, i) => (
//             <div key={i} style={{
//               background: "#fff", border: `1.5px solid ${C.border}`,
//               borderRadius: 8, overflow: "hidden",
//             }}>
//               <div
//                 onClick={() => setExpanded(expanded === i ? null : i)}
//                 style={{
//                   display: "flex", alignItems: "flex-start", gap: 10,
//                   padding: "14px 16px", cursor: "pointer",
//                   transition: "background 0.1s",
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.background = C.slate}
//                 onMouseLeave={e => e.currentTarget.style.background = "#fff"}
//               >
//                 <Badge>#{i + 1}</Badge>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{h.query}</div>
//                   <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>
//                     {h.created_at
//                       ? new Date(h.created_at).toLocaleString()
//                       : "Just now"
//                     } · {h.sources?.length || 0} sources · {h.use_web === "True" || h.useWeb ? "🌐 web" : "📄 docs"}
//                   </div>
//                 </div>
//                 <span style={{ color: C.muted, fontSize: 13, marginTop: 1 }}>
//                   {expanded === i ? "▲" : "▼"}
//                 </span>
//               </div>

//               {expanded === i && (
//                 <div style={{
//                   borderTop: `1px solid ${C.border}`,
//                   padding: "14px 16px",
//                   fontSize: 13, color: C.text, lineHeight: 1.7,
//                   whiteSpace: "pre-wrap",
//                 }}>
//                   {h.answer}
//                   {h.sources?.length > 0 && (
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
//                       {h.sources.map((s, j) => (
//                         <Badge key={j} color="amber">
//                           {s.source?.split("/").pop()} p.{(s.page || 0) + 1}
//                         </Badge>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // ── Stack Page ────────────────────────────────────────────────────────────────
// function StackPage() {
//   const stack = [
//     { icon: "🤖", name: "Gemini 1.5 Flash", role: "LLM",         detail: "Google AI" },
//     { icon: "🔗", name: "LangChain 0.2",    role: "Framework",   detail: "ReAct Agent + RAG pipeline" },
//     { icon: "📦", name: "FAISS",            role: "Vector DB",   detail: "Saved to disk · cosine similarity" },
//     { icon: "🔍", name: "Hybrid BM25 + Vector", role: "Retrieval", detail: "Ensemble 40% BM25 · 60% vector" },
//     { icon: "🗄", name: "PostgreSQL",       role: "Database",    detail: "Render managed · SQLAlchemy ORM" },
//     { icon: "⚡", name: "FastAPI",          role: "Backend",     detail: "Python 3.11 · Uvicorn" },
//     { icon: "⚛", name: "React + Vite",     role: "Frontend",    detail: "Tailwind CSS · Vercel deploy" },
//     { icon: "🌐", name: "Serper API",       role: "Web Search",  detail: "Optional live search tool" },
//   ]
//   return (
//     <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <PageHeader title="Tech Stack" sub="Full-stack AI architecture overview" />
//       <Card>
//         <CardHeader icon="⚙" title="Architecture Components" desc="Production-ready · Render + Vercel deployment" />
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {stack.map((s, i) => (
//             <div key={i} style={{
//               display: "flex", alignItems: "center", gap: 14,
//               padding: "12px 14px", background: "#fff",
//               border: `1px solid ${C.border}`, borderRadius: 8,
//             }}>
//               <div style={{
//                 width: 36, height: 36, borderRadius: 7,
//                 background: C.blueLt, display: "flex",
//                 alignItems: "center", justifyContent: "center", fontSize: 18,
//               }}>
//                 {s.icon}
//               </div>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{s.name}</div>
//                 <div style={{ fontSize: 12, color: C.muted }}>{s.role} · {s.detail}</div>
//               </div>
//               <Badge color="green">Active</Badge>
//             </div>
//           ))}
//         </div>
//       </Card>
//     </div>
//   )
// }

// // ── App root ──────────────────────────────────────────────────────────────────
// export default function App() {
//   const [active, setActive]             = useState("upload")
//   const [indexedFiles, setIndexedFiles] = useState([])
//   const [localHistory, setLocalHistory] = useState([])
//   const [stats, setStats]               = useState({ files: 0, chunks: 0, queries: 0 })

//   // Load existing files from server on mount
//   useEffect(() => {
//     apiFiles()
//       .then(d => {
//         if (d.files?.length) {
//           setIndexedFiles(d.files)
//           const totalChunks = d.files.reduce((s, f) => s + (f.chunks || 0), 0)
//           setStats(prev => ({ ...prev, files: d.files.length, chunks: totalChunks }))
//         }
//       })
//       .catch(() => {})
//   }, [])

//   const handleQuerySuccess = (data, query, useWeb) => {
//     setStats(prev => ({ ...prev, queries: prev.queries + 1 }))
//     setLocalHistory(prev => [{
//       query, answer: data.answer,
//       sources: data.sources || [],
//       web_results: data.web_results || [],
//       useWeb, created_at: new Date().toISOString(),
//     }, ...prev])
//   }

//   const pages = {
//     upload:  <UploadPage stats={stats} setStats={setStats} indexedFiles={indexedFiles} setIndexedFiles={setIndexedFiles} />,
//     query:   <QueryPage onQuerySuccess={handleQuerySuccess} />,
//     history: <HistoryPage localHistory={localHistory} setLocalHistory={setLocalHistory} />,
//     stack:   <StackPage />,
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
//       <Topbar />
//       <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
//         <Sidebar active={active} setActive={setActive} fileCount={indexedFiles.length} />
//         <main style={{ flex: 1, overflowY: "auto", padding: 24, background: C.slate }}>
//           <div style={{ maxWidth: 760, margin: "0 auto" }}>
//             {pages[active]}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

















// updated version 2
// import { useState, useRef, useEffect, useCallback } from "react"

// const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

// async function apiUpload(files) {
//   const fd = new FormData()
//   files.forEach(f => fd.append("files", f))
//   const r = await fetch(`${API}/upload`, { method: "POST", body: fd })
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiQuery(query, use_web) {
//   const r = await fetch(`${API}/query`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ query, use_web }),
//   })
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiHistory() {
//   const r = await fetch(`${API}/history?limit=20`)
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiClearHistory() {
//   const r = await fetch(`${API}/history`, { method: "DELETE" })
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiFiles() {
//   const r = await fetch(`${API}/files`)
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// const C = {
//   blue:    "#1a5ce6",
//   blueLt:  "#e8effe",
//   blueMd:  "#b3c8f9",
//   blueDk:  "#0f3fa8",
//   slate:   "#f7f8fc",
//   border:  "#e2e6ef",
//   text:    "#0d1a2e",
//   muted:   "#64748b",
//   green:   "#16a34a",
//   greenLt: "#dcfce7",
//   red:     "#dc2626",
//   redLt:   "#fee2e2",
//   amber:   "#d97706",
//   amberLt: "#fef3c7",
//   white:   "#ffffff",
// }

// function Spinner({ size = 14 }) {
//   return (
//     <span style={{
//       display: "inline-block",
//       width: size, height: size,
//       border: `2px solid ${C.blueMd}`,
//       borderTopColor: C.blue,
//       borderRadius: "50%",
//       animation: "spin 0.6s linear infinite",
//       flexShrink: 0,
//     }} />
//   )
// }

// function Badge({ children, color = "blue" }) {
//   const map = {
//     blue:  { bg: C.blueLt,  color: C.blue },
//     green: { bg: C.greenLt, color: C.green },
//     amber: { bg: C.amberLt, color: C.amber },
//     red:   { bg: C.redLt,   color: C.red },
//   }
//   const c = map[color] || map.blue
//   return (
//     <span style={{
//       background: c.bg, color: c.color,
//       fontSize: 11,
//       fontFamily: "'IBM Plex Mono', monospace",
//       fontWeight: 500,
//       padding: "2px 8px",
//       borderRadius: 4,
//       whiteSpace: "nowrap",
//     }}>
//       {children}
//     </span>
//   )
// }

// function Alert({ type = "success", children }) {
//   const map = {
//     success: { bg: C.greenLt, border: "#86efac", color: "#15803d", icon: "✓" },
//     error:   { bg: C.redLt,   border: "#fca5a5", color: C.red,     icon: "✕" },
//   }
//   const s = map[type]
//   return (
//     <div style={{
//       display: "flex", alignItems: "flex-start", gap: 10,
//       padding: "12px 14px", borderRadius: 7,
//       background: s.bg, border: `1px solid ${s.border}`,
//       color: s.color, fontSize: 13, marginTop: 12,
//     }}>
//       <span style={{ fontWeight: 700, marginTop: 1 }}>{s.icon}</span>
//       <span>{children}</span>
//     </div>
//   )
// }

// function Card({ children, style = {} }) {
//   return (
//     <div style={{
//       background: C.white,
//       border: `1.5px solid ${C.border}`,
//       borderRadius: 10,
//       padding: 20,
//       ...style,
//     }}>
//       {children}
//     </div>
//   )
// }

// function CardHeader({ icon, title, desc }) {
//   return (
//     <div style={{
//       display: "flex", alignItems: "center", gap: 10,
//       marginBottom: 16, paddingBottom: 14,
//       borderBottom: `1px solid ${C.border}`,
//     }}>
//       <div style={{
//         width: 32, height: 32, borderRadius: 7,
//         background: C.blueLt,
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontSize: 18, color: C.blue,
//       }}>
//         {icon}
//       </div>
//       <div>
//         <div style={{
//           fontFamily: "'Epilogue', sans-serif",
//           fontWeight: 700, fontSize: 14, color: C.text,
//         }}>
//           {title}
//         </div>
//         {desc && (
//           <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{desc}</div>
//         )}
//       </div>
//     </div>
//   )
// }

// function Btn({ children, onClick, disabled, variant = "primary", size = "md", fullWidth = false, style: extraStyle = {} }) {
//   const variants = {
//     primary: { background: C.blue,   color: C.white, border: C.blue },
//     outline: { background: C.white,  color: C.text,  border: C.border },
//     danger:  { background: C.redLt,  color: C.red,   border: "#fca5a5" },
//   }
//   const sizes = {
//     sm: { padding: "6px 12px", fontSize: 12 },
//     md: { padding: "9px 18px", fontSize: 13 },
//   }
//   const v = variants[variant]
//   const s = sizes[size]
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       style={{
//         display: "inline-flex", alignItems: "center",
//         justifyContent: "center", gap: 7,
//         padding: s.padding, fontSize: s.fontSize,
//         fontFamily: "'IBM Plex Sans', sans-serif",
//         fontWeight: 500,
//         background: v.background, color: v.color,
//         border: `1.5px solid ${v.border}`,
//         borderRadius: 7,
//         cursor: disabled ? "not-allowed" : "pointer",
//         opacity: disabled ? 0.5 : 1,
//         width: fullWidth ? "100%" : "auto",
//         marginTop: fullWidth ? 12 : 0,
//         transition: "all 0.15s",
//         ...extraStyle,
//       }}
//     >
//       {children}
//     </button>
//   )
// }

// function Toggle({ on, onToggle, label, icon }) {
//   return (
//     <div style={{
//       display: "flex", alignItems: "center",
//       justifyContent: "space-between", padding: "10px 0",
//     }}>
//       <div style={{
//         display: "flex", alignItems: "center", gap: 8,
//         fontSize: 13, color: C.text, fontWeight: 500,
//       }}>
//         <span style={{ fontSize: 16 }}>{icon}</span>
//         {label}
//       </div>
//       <div
//         onClick={onToggle}
//         style={{
//           width: 38, height: 20,
//           background: on ? C.blue : C.border,
//           borderRadius: 10, cursor: "pointer",
//           position: "relative", transition: "background 0.2s",
//         }}
//       >
//         <div style={{
//           position: "absolute", top: 3,
//           left: on ? 21 : 3,
//           width: 14, height: 14,
//           background: C.white, borderRadius: "50%",
//           transition: "left 0.2s",
//         }} />
//       </div>
//     </div>
//   )
// }

// function StatGrid({ files, chunks, queries }) {
//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
//       {[
//         { val: files,   label: "Files uploaded" },
//         { val: chunks,  label: "Vector chunks" },
//         { val: queries, label: "Queries run" },
//       ].map((s, i) => (
//         <div key={i} style={{
//           background: C.slate, borderRadius: 8, padding: "14px 16px",
//         }}>
//           <div style={{
//             fontFamily: "'Epilogue', sans-serif",
//             fontWeight: 800, fontSize: 24, color: C.text,
//           }}>
//             {s.val}
//           </div>
//           <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.label}</div>
//         </div>
//       ))}
//     </div>
//   )
// }

// function PageHeader({ title, sub, action }) {
//   return (
//     <div style={{
//       display: "flex", alignItems: "flex-start",
//       justifyContent: "space-between", marginBottom: 4,
//     }}>
//       <div>
//         <div style={{
//           fontFamily: "'Epilogue', sans-serif",
//           fontWeight: 800, fontSize: 22, color: C.text, letterSpacing: "-0.3px",
//         }}>
//           {title}
//         </div>
//         <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{sub}</div>
//       </div>
//       {action}
//     </div>
//   )
// }

// function Sidebar({ active, setActive, fileCount }) {
//   const nav = [
//     { id: "upload",  icon: "📂", label: "Documents", badge: fileCount },
//     { id: "query",   icon: "🔍", label: "Analysis" },
//     { id: "history", icon: "🕓", label: "History" },
//     { id: "stack",   icon: "⚙️",  label: "Tech Stack" },
//   ]
//   return (
//     <aside style={{
//       width: 210, background: C.white,
//       borderRight: `1.5px solid ${C.border}`,
//       display: "flex", flexDirection: "column",
//       padding: "20px 0", flexShrink: 0,
//       height: "100%",
//     }}>
//       <div style={{ padding: "0 20px 20px" }}>
//         <div style={{
//           fontFamily: "'Epilogue', sans-serif",
//           fontWeight: 800, fontSize: 20,
//           color: C.blue, letterSpacing: "-0.5px",
//         }}>
//           Nexus<span style={{ color: C.text }}>AI</span>
//         </div>
//         <div style={{
//           fontFamily: "'IBM Plex Mono', monospace",
//           fontSize: 10, color: C.muted,
//           letterSpacing: "0.8px", marginTop: 2,
//         }}>
//           RAG · AGENT · LLM
//         </div>
//       </div>

//       <div style={{
//         fontSize: 10, fontWeight: 600, letterSpacing: "1.2px",
//         color: C.muted, padding: "0 20px 8px", textTransform: "uppercase",
//       }}>
//         Workspace
//       </div>

//       {nav.map(({ id, icon, label, badge }) => {
//         const isActive = active === id
//         return (
//           <div
//             key={id}
//             onClick={() => setActive(id)}
//             style={{
//               display: "flex", alignItems: "center", gap: 10,
//               padding: "9px 20px", fontSize: 13, fontWeight: 500,
//               color: isActive ? C.blue : C.muted,
//               background: isActive ? C.blueLt : "transparent",
//               borderLeft: `3px solid ${isActive ? C.blue : "transparent"}`,
//               cursor: "pointer", transition: "all 0.15s",
//             }}
//           >
//             <span style={{ fontSize: 15 }}>{icon}</span>
//             <span style={{ flex: 1 }}>{label}</span>
//             {badge > 0 && (
//               <span style={{
//                 fontFamily: "'IBM Plex Mono', monospace",
//                 fontSize: 10, background: C.blue,
//                 color: C.white, padding: "1px 6px", borderRadius: 10,
//               }}>
//                 {badge}
//               </span>
//             )}
//           </div>
//         )
//       })}

//       <div style={{
//         marginTop: "auto", padding: "16px 20px",
//         borderTop: `1px solid ${C.border}`,
//         fontSize: 11, color: C.muted, lineHeight: 1.6,
//       }}>
//         <div style={{ fontWeight: 600, color: C.text, fontSize: 12, marginBottom: 2 }}>
//           Nexus RAG Engine
//         </div>
//         FastAPI · LangChain<br />FAISS · PostgreSQL
//         <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
//           <div style={{
//             width: 7, height: 7, borderRadius: "50%",
//             background: C.green, animation: "pulse 2s infinite",
//           }} />
//           <span>Gemini 1.5 Flash</span>
//         </div>
//       </div>
//     </aside>
//   )
// }

// function Topbar() {
//   return (
//     <div style={{
//       background: C.white,
//       borderBottom: `1.5px solid ${C.border}`,
//       height: 52, display: "flex", alignItems: "center",
//       padding: "0 24px", gap: 10, flexShrink: 0,
//     }}>
//       <span style={{
//         fontFamily: "'Epilogue', sans-serif",
//         fontWeight: 700, fontSize: 14, color: C.text,
//       }}>
//         AI Research Engine
//       </span>
//       <Badge>v1.0</Badge>
//       <div style={{
//         marginLeft: "auto", display: "flex",
//         alignItems: "center", gap: 6,
//         fontSize: 12, color: C.muted,
//       }}>
//         <div style={{
//           width: 7, height: 7, borderRadius: "50%",
//           background: C.green, animation: "pulse 2s infinite",
//         }} />
//         Connected · Gemini 1.5 Flash
//       </div>
//     </div>
//   )
// }

// function UploadPage({ stats, setStats, indexedFiles, setIndexedFiles }) {
//   const [pending, setPending]     = useState([])
//   const [uploading, setUploading] = useState(false)
//   const [alert, setAlert]         = useState(null)
//   const [dragging, setDragging]   = useState(false)
//   const inputRef = useRef()

//   const addFiles = useCallback((files) => {
//     const pdfs = [...files].filter(f => f.type === "application/pdf")
//     setPending(prev => {
//       const names = new Set(prev.map(p => p.name))
//       return [...prev, ...pdfs.filter(f => !names.has(f.name))]
//     })
//   }, [])

//   const handleDrop = useCallback((e) => {
//     e.preventDefault()
//     setDragging(false)
//     addFiles(e.dataTransfer.files)
//   }, [addFiles])

//   const doUpload = async () => {
//     if (!pending.length) return
//     setUploading(true)
//     setAlert(null)
//     try {
//       const data = await apiUpload(pending)
//       setAlert({ type: "success", msg: data.message })
//       const newChunks = (data.files || []).reduce((s, f) => s + (f.chunks || 0), 0)
//       setStats(prev => ({
//         files:   prev.files + pending.length,
//         chunks:  prev.chunks + newChunks,
//         queries: prev.queries,
//       }))
//       setIndexedFiles(prev => [...prev, ...(data.files || [])])
//       setPending([])
//     } catch (e) {
//       setAlert({ type: "error", msg: e.message })
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <PageHeader title="Document Corpus" sub="Upload PDFs to build the RAG knowledge base" />

//       <StatGrid files={stats.files} chunks={stats.chunks} queries={stats.queries} />

//       <Card>
//         <CardHeader icon="⬆" title="Upload Documents" desc="PDF files only · Multiple files supported" />

//         <div
//           onClick={() => inputRef.current?.click()}
//           onDrop={handleDrop}
//           onDragOver={e => { e.preventDefault(); setDragging(true) }}
//           onDragLeave={() => setDragging(false)}
//           style={{
//             border: `2px dashed ${dragging ? C.blue : C.blueMd}`,
//             borderRadius: 8, padding: "36px 20px",
//             textAlign: "center", cursor: "pointer",
//             background: dragging ? "#dce8fd" : C.blueLt,
//             transition: "all 0.15s",
//           }}
//         >
//           <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
//           <div style={{
//             fontFamily: "'Epilogue', sans-serif",
//             fontWeight: 700, fontSize: 14, color: C.text,
//           }}>
//             Drop PDFs here or click to browse
//           </div>
//           <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
//             Multiple files · Max 10MB each
//           </div>
//         </div>

//         <input
//           ref={inputRef} type="file" accept=".pdf" multiple
//           style={{ display: "none" }}
//           onChange={e => addFiles(e.target.files)}
//         />

//         {pending.length > 0 && (
//           <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
//             {pending.map((f, i) => (
//               <div key={i} style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "10px 12px", background: C.slate,
//                 border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 13,
//               }}>
//                 <span>📄</span>
//                 <span style={{
//                   flex: 1, color: C.text, fontWeight: 500,
//                   overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//                 }}>
//                   {f.name}
//                 </span>
//                 <span style={{
//                   fontFamily: "'IBM Plex Mono', monospace",
//                   fontSize: 11, color: C.muted,
//                 }}>
//                   {(f.size / 1024).toFixed(0)} KB
//                 </span>
//                 <span
//                   onClick={() => setPending(prev => prev.filter((_, j) => j !== i))}
//                   style={{ color: C.muted, cursor: "pointer", fontSize: 16 }}
//                 >
//                   ✕
//                 </span>
//               </div>
//             ))}
//             <Btn onClick={doUpload} disabled={uploading} fullWidth>
//               {uploading ? <><Spinner /> Processing…</> : <>⚡ Build Knowledge Base</>}
//             </Btn>
//           </div>
//         )}

//         {alert && <Alert type={alert.type}>{alert.msg}</Alert>}
//       </Card>

//       <Card>
//         <CardHeader icon="🗄" title="Indexed Files" desc="PostgreSQL · FAISS vector index on disk" />
//         {indexedFiles.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "32px 0", color: C.muted, fontSize: 13 }}>
//             <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>📭</div>
//             No files indexed yet
//           </div>
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//             {indexedFiles.map((f, i) => (
//               <div key={i} style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "10px 12px", background: C.slate,
//                 border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 13,
//               }}>
//                 <span>📄</span>
//                 <span style={{
//                   flex: 1, fontWeight: 500, color: C.text,
//                   overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//                 }}>
//                   {f.name}
//                 </span>
//                 <Badge color="green">{f.chunks} chunks</Badge>
//               </div>
//             ))}
//           </div>
//         )}
//       </Card>
//     </div>
//   )
// }

// function ResultDisplay({ result }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       <Card>
//         <div style={{
//           fontSize: 10, fontWeight: 600, letterSpacing: "1px",
//           textTransform: "uppercase", color: C.muted, marginBottom: 10,
//         }}>
//           ✨ AI Answer
//         </div>
//         <div style={{
//           background: C.slate, border: `1.5px solid ${C.border}`,
//           borderRadius: 8, padding: 16, fontSize: 13,
//           color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap",
//         }}>
//           {result.answer}
//         </div>
//       </Card>

//       {result.sources?.length > 0 && (
//         <Card>
//           <div style={{
//             fontSize: 10, fontWeight: 600, letterSpacing: "1px",
//             textTransform: "uppercase", color: C.muted, marginBottom: 12,
//           }}>
//             📌 Source References ({result.sources.length})
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//             {result.sources.map((s, i) => (
//               <div key={i} style={{
//                 display: "flex", gap: 10, padding: 12,
//                 background: C.white, border: `1px solid ${C.border}`, borderRadius: 7,
//               }}>
//                 <Badge color="amber">#{i + 1}</Badge>
//                 <div>
//                   <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>
//                     {s.source?.split("/").pop() || "document"}
//                   </div>
//                   <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
//                     Page {(s.page || 0) + 1}
//                   </div>
//                   <div style={{ fontSize: 12, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>
//                     {s.snippet}…
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       {result.web_results?.length > 0 && (
//         <Card>
//           <div style={{
//             fontSize: 10, fontWeight: 600, letterSpacing: "1px",
//             textTransform: "uppercase", color: C.muted, marginBottom: 12,
//           }}>
//             🌐 Web Insights
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//             {result.web_results.map((w, i) => (
//               <div key={i} style={{
//                 padding: 12, background: C.slate,
//                 border: `1px solid ${C.border}`, borderRadius: 7,
//               }}>
//                 <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 4 }}>
//                   {w.title}
//                 </div>
//                 <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{w.snippet}</div>
//                 {w.url && (
//                   <a href={w.url} target="_blank" rel="noreferrer" style={{
//                     fontSize: 11, color: C.blue,
//                     fontFamily: "'IBM Plex Mono', monospace",
//                     marginTop: 4, display: "block",
//                   }}>
//                     {w.url}
//                   </a>
//                 )}
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}
//     </div>
//   )
// }

// function QueryPage({ onQuerySuccess }) {
//   const [query, setQuery]     = useState("")
//   const [useWeb, setUseWeb]   = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [result, setResult]   = useState(null)
//   const [error, setError]     = useState(null)

//   const doQuery = async () => {
//     if (!query.trim()) return
//     setLoading(true); setResult(null); setError(null)
//     try {
//       const data = await apiQuery(query, useWeb)
//       setResult(data)
//       onQuerySuccess(data, query, useWeb)
//     } catch (e) {
//       setError(e.message || "Query failed. Upload documents first.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <PageHeader title="Intelligent Analysis" sub="ReAct agent · Hybrid BM25 + vector retrieval" />

//       <Card>
//         <CardHeader icon="🔍" title="Query Engine" desc="Ask anything about your uploaded documents" />

//         <textarea
//           value={query}
//           onChange={e => setQuery(e.target.value)}
//           onKeyDown={e => { if (e.key === "Enter" && e.metaKey) doQuery() }}
//           rows={4}
//           placeholder={"e.g. Summarize key findings…\ne.g. What are the candidate's skills?\ne.g. Compare methodologies…"}
//           style={{
//             width: "100%",
//             border: `1.5px solid ${C.border}`,
//             borderRadius: 8, padding: 12,
//             fontSize: 13,
//             fontFamily: "'IBM Plex Sans', sans-serif",
//             color: C.text, resize: "none", outline: "none",
//             background: C.white, lineHeight: 1.6,
//             transition: "border 0.15s",
//           }}
//           onFocus={e => e.target.style.borderColor = C.blue}
//           onBlur={e => e.target.style.borderColor = C.border}
//         />

//         <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 12, paddingTop: 4 }}>
//           <Toggle
//             on={useWeb}
//             onToggle={() => setUseWeb(p => !p)}
//             icon="🌐"
//             label="Enable web search (Serper API)"
//           />
//         </div>

//         {error && <Alert type="error">{error}</Alert>}

//         <Btn onClick={doQuery} disabled={loading || !query.trim()} fullWidth>
//           {loading ? <><Spinner /> Analyzing…</> : <>▶ Run Analysis</>}
//         </Btn>
//       </Card>

//       {result && <ResultDisplay result={result} />}
//     </div>
//   )
// }

// function HistoryPage({ localHistory, setLocalHistory }) {
//   const [serverHistory, setServerHistory] = useState([])
//   const [loading, setLoading]             = useState(true)
//   const [expanded, setExpanded]           = useState(null)

//   useEffect(() => {
//     apiHistory()
//       .then(d => setServerHistory(d.history || []))
//       .catch(() => {})
//       .finally(() => setLoading(false))
//   }, [])

//   const allHistory = [
//     ...localHistory,
//     ...serverHistory.filter(s =>
//       !localHistory.find(l => l.query === s.query && l.answer === s.answer)
//     ),
//   ]

//   const clearAll = async () => {
//     try {
//       await apiClearHistory()
//       setServerHistory([])
//       setLocalHistory([])
//     } catch (e) {
//       alert("Failed: " + e.message)
//     }
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <PageHeader
//         title="Query History"
//         sub={`${allHistory.length} queries stored in PostgreSQL`}
//         action={
//           allHistory.length > 0 && (
//             <Btn variant="danger" size="sm" onClick={clearAll}>🗑 Clear all</Btn>
//           )
//         }
//       />

//       {loading ? (
//         <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.muted, fontSize: 13 }}>
//           <Spinner /> Loading history…
//         </div>
//       ) : allHistory.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "64px 0", color: C.muted }}>
//           <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>🕓</div>
//           <div style={{ fontSize: 13 }}>No queries yet — run an analysis first</div>
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {allHistory.map((h, i) => (
//             <div key={i} style={{
//               background: C.white,
//               border: `1.5px solid ${C.border}`,
//               borderRadius: 8, overflow: "hidden",
//             }}>
//               <div
//                 onClick={() => setExpanded(expanded === i ? null : i)}
//                 style={{
//                   display: "flex", alignItems: "flex-start", gap: 10,
//                   padding: "14px 16px", cursor: "pointer",
//                   background: expanded === i ? C.slate : C.white,
//                   transition: "background 0.1s",
//                 }}
//               >
//                 <Badge>#{i + 1}</Badge>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{h.query}</div>
//                   <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>
//                     {h.created_at
//                       ? new Date(h.created_at).toLocaleString()
//                       : "Just now"
//                     } · {h.sources?.length || 0} sources
//                   </div>
//                 </div>
//                 <span style={{ color: C.muted, fontSize: 12 }}>
//                   {expanded === i ? "▲" : "▼"}
//                 </span>
//               </div>

//               {expanded === i && (
//                 <div style={{
//                   borderTop: `1px solid ${C.border}`,
//                   padding: "14px 16px",
//                   fontSize: 13, color: C.text,
//                   lineHeight: 1.7, whiteSpace: "pre-wrap",
//                 }}>
//                   {h.answer}
//                   {h.sources?.length > 0 && (
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
//                       {h.sources.map((s, j) => (
//                         <Badge key={j} color="amber">
//                           {s.source?.split("/").pop()} p.{(s.page || 0) + 1}
//                         </Badge>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// function StackPage() {
//   const stack = [
//     { icon: "🤖", name: "Gemini 1.5 Flash",      role: "LLM",       detail: "Google AI" },
//     { icon: "🔗", name: "LangChain 0.2",          role: "Framework", detail: "ReAct Agent + RAG" },
//     { icon: "📦", name: "FAISS",                  role: "Vector DB", detail: "Saved to disk" },
//     { icon: "🔍", name: "Hybrid BM25 + Vector",   role: "Retrieval", detail: "Ensemble 40/60" },
//     { icon: "🗄", name: "PostgreSQL",             role: "Database",  detail: "Render managed" },
//     { icon: "⚡", name: "FastAPI",                role: "Backend",   detail: "Python 3.11" },
//     { icon: "⚛", name: "React + Vite",           role: "Frontend",  detail: "Vercel deploy" },
//     { icon: "🌐", name: "Serper API",             role: "Web Search",detail: "Optional tool" },
//   ]

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <PageHeader title="Tech Stack" sub="Full-stack AI architecture overview" />
//       <Card>
//         <CardHeader icon="⚙" title="Architecture" desc="Production-ready · Render + Vercel" />
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {stack.map((s, i) => (
//             <div key={i} style={{
//               display: "flex", alignItems: "center", gap: 14,
//               padding: "12px 14px", background: C.white,
//               border: `1px solid ${C.border}`, borderRadius: 8,
//             }}>
//               <div style={{
//                 width: 36, height: 36, borderRadius: 7,
//                 background: C.blueLt, display: "flex",
//                 alignItems: "center", justifyContent: "center", fontSize: 18,
//               }}>
//                 {s.icon}
//               </div>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{s.name}</div>
//                 <div style={{ fontSize: 12, color: C.muted }}>{s.role} · {s.detail}</div>
//               </div>
//               <Badge color="green">Active</Badge>
//             </div>
//           ))}
//         </div>
//       </Card>
//     </div>
//   )
// }

// export default function App() {
//   const [active, setActive]             = useState("upload")
//   const [indexedFiles, setIndexedFiles] = useState([])
//   const [localHistory, setLocalHistory] = useState([])
//   const [stats, setStats]               = useState({ files: 0, chunks: 0, queries: 0 })

//   useEffect(() => {
//     apiFiles()
//       .then(d => {
//         if (d.files?.length) {
//           setIndexedFiles(d.files)
//           const chunks = d.files.reduce((s, f) => s + (f.chunks || 0), 0)
//           setStats(prev => ({ ...prev, files: d.files.length, chunks }))
//         }
//       })
//       .catch(() => {})
//   }, [])

//   const handleQuerySuccess = (data, query, useWeb) => {
//     setStats(prev => ({ ...prev, queries: prev.queries + 1 }))
//     setLocalHistory(prev => [{
//       query,
//       answer: data.answer,
//       sources: data.sources || [],
//       web_results: data.web_results || [],
//       useWeb,
//       created_at: new Date().toISOString(),
//     }, ...prev])
//   }

//   const pages = {
//     upload:  <UploadPage stats={stats} setStats={setStats} indexedFiles={indexedFiles} setIndexedFiles={setIndexedFiles} />,
//     query:   <QueryPage onQuerySuccess={handleQuerySuccess} />,
//     history: <HistoryPage localHistory={localHistory} setLocalHistory={setLocalHistory} />,
//     stack:   <StackPage />,
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
//       <Topbar />
//       <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
//         <Sidebar active={active} setActive={setActive} fileCount={indexedFiles.length} />
//         <main style={{
//           flex: 1, overflowY: "auto",
//           padding: 24, background: C.slate,
//         }}>
//           <div style={{ maxWidth: 760, margin: "0 auto" }}>
//             {pages[active]}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }





























// new update version 2.0 - delete option
// import { useState, useRef, useEffect, useCallback } from "react"

// const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

// // ── API helpers ───────────────────────────────────────────────────────────────
// async function apiUpload(files) {
//   const fd = new FormData()
//   files.forEach(f => fd.append("files", f))
//   const r = await fetch(`${API}/upload`, { method: "POST", body: fd })
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiQuery(query, use_web) {
//   const r = await fetch(`${API}/query`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ query, use_web }),
//   })
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiHistory() {
//   const r = await fetch(`${API}/history?limit=20`)
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiClearHistory() {
//   const r = await fetch(`${API}/history`, { method: "DELETE" })
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiFiles() {
//   const r = await fetch(`${API}/files`)
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// async function apiDeleteFile(fileId) {
//   const r = await fetch(`${API}/files/${fileId}`, { method: "DELETE" })
//   if (!r.ok) throw new Error(await r.text())
//   return r.json()
// }

// // ── Design tokens ─────────────────────────────────────────────────────────────
// const C = {
//   blue:    "#1a5ce6",
//   blueLt:  "#e8effe",
//   blueMd:  "#b3c8f9",
//   blueDk:  "#0f3fa8",
//   slate:   "#f7f8fc",
//   border:  "#e2e6ef",
//   text:    "#0d1a2e",
//   muted:   "#64748b",
//   green:   "#16a34a",
//   greenLt: "#dcfce7",
//   red:     "#dc2626",
//   redLt:   "#fee2e2",
//   amber:   "#d97706",
//   amberLt: "#fef3c7",
//   white:   "#ffffff",
// }

// // ── Shared components ─────────────────────────────────────────────────────────

// function Spinner({ size = 14 }) {
//   return (
//     <span style={{
//       display: "inline-block",
//       width: size, height: size,
//       border: `2px solid ${C.blueMd}`,
//       borderTopColor: C.blue,
//       borderRadius: "50%",
//       animation: "spin 0.6s linear infinite",
//       flexShrink: 0,
//     }} />
//   )
// }

// function Badge({ children, color = "blue" }) {
//   const map = {
//     blue:  { bg: C.blueLt,  color: C.blue },
//     green: { bg: C.greenLt, color: C.green },
//     amber: { bg: C.amberLt, color: C.amber },
//     red:   { bg: C.redLt,   color: C.red },
//   }
//   const c = map[color] || map.blue
//   return (
//     <span style={{
//       background: c.bg, color: c.color,
//       fontSize: 11,
//       fontFamily: "'IBM Plex Mono', monospace",
//       fontWeight: 500,
//       padding: "2px 8px",
//       borderRadius: 4,
//       whiteSpace: "nowrap",
//     }}>
//       {children}
//     </span>
//   )
// }

// function Alert({ type = "success", children }) {
//   const map = {
//     success: { bg: C.greenLt, border: "#86efac", color: "#15803d", icon: "✓" },
//     error:   { bg: C.redLt,   border: "#fca5a5", color: C.red,     icon: "✕" },
//   }
//   const s = map[type]
//   return (
//     <div style={{
//       display: "flex", alignItems: "flex-start", gap: 10,
//       padding: "12px 14px", borderRadius: 7,
//       background: s.bg, border: `1px solid ${s.border}`,
//       color: s.color, fontSize: 13, marginTop: 12,
//     }}>
//       <span style={{ fontWeight: 700, marginTop: 1 }}>{s.icon}</span>
//       <span>{children}</span>
//     </div>
//   )
// }

// function Card({ children, style = {} }) {
//   return (
//     <div style={{
//       background: C.white,
//       border: `1.5px solid ${C.border}`,
//       borderRadius: 10,
//       padding: 20,
//       ...style,
//     }}>
//       {children}
//     </div>
//   )
// }

// function CardHeader({ icon, title, desc }) {
//   return (
//     <div style={{
//       display: "flex", alignItems: "center", gap: 10,
//       marginBottom: 16, paddingBottom: 14,
//       borderBottom: `1px solid ${C.border}`,
//     }}>
//       <div style={{
//         width: 32, height: 32, borderRadius: 7,
//         background: C.blueLt,
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontSize: 18, color: C.blue,
//       }}>
//         {icon}
//       </div>
//       <div>
//         <div style={{
//           fontFamily: "'Epilogue', sans-serif",
//           fontWeight: 700, fontSize: 14, color: C.text,
//         }}>
//           {title}
//         </div>
//         {desc && (
//           <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{desc}</div>
//         )}
//       </div>
//     </div>
//   )
// }

// function Btn({ children, onClick, disabled, variant = "primary", size = "md", fullWidth = false, style: extraStyle = {} }) {
//   const variants = {
//     primary: { background: C.blue,  color: C.white, border: C.blue },
//     outline: { background: C.white, color: C.text,  border: C.border },
//     danger:  { background: C.redLt, color: C.red,   border: "#fca5a5" },
//   }
//   const sizes = {
//     sm: { padding: "6px 12px", fontSize: 12 },
//     md: { padding: "9px 18px", fontSize: 13 },
//   }
//   const v = variants[variant]
//   const s = sizes[size]
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       style={{
//         display: "inline-flex", alignItems: "center",
//         justifyContent: "center", gap: 7,
//         padding: s.padding, fontSize: s.fontSize,
//         fontFamily: "'IBM Plex Sans', sans-serif",
//         fontWeight: 500,
//         background: v.background, color: v.color,
//         border: `1.5px solid ${v.border}`,
//         borderRadius: 7,
//         cursor: disabled ? "not-allowed" : "pointer",
//         opacity: disabled ? 0.5 : 1,
//         width: fullWidth ? "100%" : "auto",
//         marginTop: fullWidth ? 12 : 0,
//         transition: "all 0.15s",
//         ...extraStyle,
//       }}
//     >
//       {children}
//     </button>
//   )
// }

// function Toggle({ on, onToggle, label, icon }) {
//   return (
//     <div style={{
//       display: "flex", alignItems: "center",
//       justifyContent: "space-between", padding: "10px 0",
//     }}>
//       <div style={{
//         display: "flex", alignItems: "center", gap: 8,
//         fontSize: 13, color: C.text, fontWeight: 500,
//       }}>
//         <span style={{ fontSize: 16 }}>{icon}</span>
//         {label}
//       </div>
//       <div
//         onClick={onToggle}
//         style={{
//           width: 38, height: 20,
//           background: on ? C.blue : C.border,
//           borderRadius: 10, cursor: "pointer",
//           position: "relative", transition: "background 0.2s",
//         }}
//       >
//         <div style={{
//           position: "absolute", top: 3,
//           left: on ? 21 : 3,
//           width: 14, height: 14,
//           background: C.white, borderRadius: "50%",
//           transition: "left 0.2s",
//         }} />
//       </div>
//     </div>
//   )
// }

// function StatGrid({ files, chunks, queries }) {
//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
//       {[
//         { val: files,   label: "Files uploaded" },
//         { val: chunks,  label: "Vector chunks" },
//         { val: queries, label: "Queries run" },
//       ].map((s, i) => (
//         <div key={i} style={{
//           background: C.slate, borderRadius: 8, padding: "14px 16px",
//         }}>
//           <div style={{
//             fontFamily: "'Epilogue', sans-serif",
//             fontWeight: 800, fontSize: 24, color: C.text,
//           }}>
//             {s.val}
//           </div>
//           <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.label}</div>
//         </div>
//       ))}
//     </div>
//   )
// }

// function PageHeader({ title, sub, action }) {
//   return (
//     <div style={{
//       display: "flex", alignItems: "flex-start",
//       justifyContent: "space-between", marginBottom: 4,
//     }}>
//       <div>
//         <div style={{
//           fontFamily: "'Epilogue', sans-serif",
//           fontWeight: 800, fontSize: 22, color: C.text, letterSpacing: "-0.3px",
//         }}>
//           {title}
//         </div>
//         <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{sub}</div>
//       </div>
//       {action}
//     </div>
//   )
// }

// // ── Sidebar ───────────────────────────────────────────────────────────────────
// function Sidebar({ active, setActive, fileCount }) {
//   const nav = [
//     { id: "upload",  icon: "📂", label: "Documents", badge: fileCount },
//     { id: "query",   icon: "🔍", label: "Analysis" },
//     { id: "history", icon: "🕓", label: "History" },
//     { id: "stack",   icon: "⚙️",  label: "Tech Stack" },
//   ]
//   return (
//     <aside style={{
//       width: 210, background: C.white,
//       borderRight: `1.5px solid ${C.border}`,
//       display: "flex", flexDirection: "column",
//       padding: "20px 0", flexShrink: 0,
//       height: "100%",
//     }}>
//       <div style={{ padding: "0 20px 20px" }}>
//         <div style={{
//           fontFamily: "'Epilogue', sans-serif",
//           fontWeight: 800, fontSize: 20,
//           color: C.blue, letterSpacing: "-0.5px",
//         }}>
//           Nexus<span style={{ color: C.text }}>AI</span>
//         </div>
//         <div style={{
//           fontFamily: "'IBM Plex Mono', monospace",
//           fontSize: 10, color: C.muted,
//           letterSpacing: "0.8px", marginTop: 2,
//         }}>
//           RAG · AGENT · LLM
//         </div>
//       </div>

//       <div style={{
//         fontSize: 10, fontWeight: 600, letterSpacing: "1.2px",
//         color: C.muted, padding: "0 20px 8px", textTransform: "uppercase",
//       }}>
//         Workspace
//       </div>

//       {nav.map(({ id, icon, label, badge }) => {
//         const isActive = active === id
//         return (
//           <div
//             key={id}
//             onClick={() => setActive(id)}
//             style={{
//               display: "flex", alignItems: "center", gap: 10,
//               padding: "9px 20px", fontSize: 13, fontWeight: 500,
//               color: isActive ? C.blue : C.muted,
//               background: isActive ? C.blueLt : "transparent",
//               borderLeft: `3px solid ${isActive ? C.blue : "transparent"}`,
//               cursor: "pointer", transition: "all 0.15s",
//             }}
//           >
//             <span style={{ fontSize: 15 }}>{icon}</span>
//             <span style={{ flex: 1 }}>{label}</span>
//             {badge > 0 && (
//               <span style={{
//                 fontFamily: "'IBM Plex Mono', monospace",
//                 fontSize: 10, background: C.blue,
//                 color: C.white, padding: "1px 6px", borderRadius: 10,
//               }}>
//                 {badge}
//               </span>
//             )}
//           </div>
//         )
//       })}

//       <div style={{
//         marginTop: "auto", padding: "16px 20px",
//         borderTop: `1px solid ${C.border}`,
//         fontSize: 11, color: C.muted, lineHeight: 1.6,
//       }}>
//         <div style={{ fontWeight: 600, color: C.text, fontSize: 12, marginBottom: 2 }}>
//           Nexus RAG Engine
//         </div>
//         FastAPI · LangChain<br />FAISS · PostgreSQL
//         <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
//           <div style={{
//             width: 7, height: 7, borderRadius: "50%",
//             background: C.green, animation: "pulse 2s infinite",
//           }} />
//           <span>Groq · Llama 3.3</span>
//         </div>
//       </div>
//     </aside>
//   )
// }

// // ── Topbar ────────────────────────────────────────────────────────────────────
// function Topbar() {
//   return (
//     <div style={{
//       background: C.white,
//       borderBottom: `1.5px solid ${C.border}`,
//       height: 52, display: "flex", alignItems: "center",
//       padding: "0 24px", gap: 10, flexShrink: 0,
//     }}>
//       <span style={{
//         fontFamily: "'Epilogue', sans-serif",
//         fontWeight: 700, fontSize: 14, color: C.text,
//       }}>
//         AI Research Engine
//       </span>
//       <Badge>v1.0</Badge>
//       <div style={{
//         marginLeft: "auto", display: "flex",
//         alignItems: "center", gap: 6,
//         fontSize: 12, color: C.muted,
//       }}>
//         <div style={{
//           width: 7, height: 7, borderRadius: "50%",
//           background: C.green, animation: "pulse 2s infinite",
//         }} />
//         Connected · Groq Llama 3.3-70b
//       </div>
//     </div>
//   )
// }

// // ── Upload Page ───────────────────────────────────────────────────────────────
// function UploadPage({ stats, setStats, indexedFiles, setIndexedFiles }) {
//   const [pending, setPending]     = useState([])
//   const [uploading, setUploading] = useState(false)
//   const [alert, setAlert]         = useState(null)
//   const [dragging, setDragging]   = useState(false)
//   const [deleting, setDeleting]   = useState(null)
//   const inputRef = useRef()

//   const addFiles = useCallback((files) => {
//     const pdfs = [...files].filter(f => f.type === "application/pdf")
//     setPending(prev => {
//       const names = new Set(prev.map(p => p.name))
//       return [...prev, ...pdfs.filter(f => !names.has(f.name))]
//     })
//   }, [])

//   const handleDrop = useCallback((e) => {
//     e.preventDefault()
//     setDragging(false)
//     addFiles(e.dataTransfer.files)
//   }, [addFiles])

//   const doUpload = async () => {
//     if (!pending.length) return
//     setUploading(true)
//     setAlert(null)
//     try {
//       const data = await apiUpload(pending)
//       setAlert({ type: "success", msg: data.message })
//       const newChunks = (data.files || []).reduce((s, f) => s + (f.chunks || 0), 0)
//       setStats(prev => ({
//         files:   prev.files + pending.length,
//         chunks:  prev.chunks + newChunks,
//         queries: prev.queries,
//       }))
//       setIndexedFiles(prev => [...prev, ...(data.files || [])])
//       setPending([])
//     } catch (e) {
//       setAlert({ type: "error", msg: e.message })
//     } finally {
//       setUploading(false)
//     }
//   }

//   const handleDeleteFile = async (fileId, index) => {
//     if (!window.confirm("Delete this file from the knowledge base?")) return
//     setDeleting(index)
//     setAlert(null)
//     try {
//       if (fileId) {
//         await apiDeleteFile(fileId)
//       }
//       const deleted = indexedFiles[index]
//       setIndexedFiles(prev => prev.filter((_, i) => i !== index))
//       setStats(prev => ({
//         ...prev,
//         files:  Math.max(0, prev.files - 1),
//         chunks: Math.max(0, prev.chunks - (deleted?.chunks || 0)),
//       }))
//       setAlert({ type: "success", msg: `"${deleted?.name}" deleted successfully.` })
//     } catch (e) {
//       setAlert({ type: "error", msg: "Delete failed: " + e.message })
//     } finally {
//       setDeleting(null)
//     }
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <PageHeader title="Document Corpus" sub="Upload PDFs to build the RAG knowledge base" />

//       <StatGrid files={stats.files} chunks={stats.chunks} queries={stats.queries} />

//       <Card>
//         <CardHeader icon="⬆" title="Upload Documents" desc="PDF files only · Multiple files supported" />

//         {/* Drop zone */}
//         <div
//           onClick={() => inputRef.current?.click()}
//           onDrop={handleDrop}
//           onDragOver={e => { e.preventDefault(); setDragging(true) }}
//           onDragLeave={() => setDragging(false)}
//           style={{
//             border: `2px dashed ${dragging ? C.blue : C.blueMd}`,
//             borderRadius: 8, padding: "36px 20px",
//             textAlign: "center", cursor: "pointer",
//             background: dragging ? "#dce8fd" : C.blueLt,
//             transition: "all 0.15s",
//           }}
//         >
//           <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
//           <div style={{
//             fontFamily: "'Epilogue', sans-serif",
//             fontWeight: 700, fontSize: 14, color: C.text,
//           }}>
//             Drop PDFs here or click to browse
//           </div>
//           <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
//             Multiple files · Max 10MB each
//           </div>
//         </div>

//         <input
//           ref={inputRef} type="file" accept=".pdf" multiple
//           style={{ display: "none" }}
//           onChange={e => addFiles(e.target.files)}
//         />

//         {/* Pending files list */}
//         {pending.length > 0 && (
//           <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
//             <div style={{
//               fontSize: 11, fontWeight: 600, color: C.muted,
//               textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2,
//             }}>
//               Ready to upload ({pending.length})
//             </div>
//             {pending.map((f, i) => (
//               <div key={i} style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "10px 12px", background: C.slate,
//                 border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 13,
//               }}>
//                 <span>📄</span>
//                 <span style={{
//                   flex: 1, color: C.text, fontWeight: 500,
//                   overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//                 }}>
//                   {f.name}
//                 </span>
//                 <span style={{
//                   fontFamily: "'IBM Plex Mono', monospace",
//                   fontSize: 11, color: C.muted,
//                 }}>
//                   {(f.size / 1024).toFixed(0)} KB
//                 </span>
//                 <span
//                   onClick={() => setPending(prev => prev.filter((_, j) => j !== i))}
//                   style={{
//                     color: C.muted, cursor: "pointer",
//                     fontSize: 16, lineHeight: 1, padding: "0 2px",
//                   }}
//                 >
//                   ✕
//                 </span>
//               </div>
//             ))}
//             <Btn onClick={doUpload} disabled={uploading} fullWidth>
//               {uploading ? <><Spinner /> Processing…</> : <>⚡ Build Knowledge Base</>}
//             </Btn>
//           </div>
//         )}

//         {alert && <Alert type={alert.type}>{alert.msg}</Alert>}
//       </Card>

//       {/* Indexed files */}
//       <Card>
//         <CardHeader icon="🗄" title="Indexed Files" desc="PostgreSQL · FAISS vector index on disk" />
//         {indexedFiles.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "32px 0", color: C.muted, fontSize: 13 }}>
//             <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>📭</div>
//             No files indexed yet
//           </div>
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//             {indexedFiles.map((f, i) => (
//               <div key={f.id || i} style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "10px 12px", background: C.slate,
//                 border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 13,
//                 transition: "opacity 0.2s",
//                 opacity: deleting === i ? 0.5 : 1,
//               }}>
//                 <span>📄</span>

//                 {/* Filename */}
//                 <span style={{
//                   flex: 1, fontWeight: 500, color: C.text,
//                   overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//                 }}>
//                   {f.name}
//                 </span>

//                 {/* Chunk count */}
//                 <Badge color="green">
//                   {f.chunks} chunk{f.chunks !== 1 ? "s" : ""}
//                 </Badge>

//                 {/* File size */}
//                 {f.size_kb > 0 && (
//                   <span style={{
//                     fontFamily: "'IBM Plex Mono', monospace",
//                     fontSize: 11, color: C.muted,
//                   }}>
//                     {f.size_kb} KB
//                   </span>
//                 )}

//                 {/* Upload date */}
//                 {f.uploaded_at && (
//                   <span style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>
//                     {new Date(f.uploaded_at).toLocaleDateString()}
//                   </span>
//                 )}

//                 {/* Delete button */}
//                 <button
//                   onClick={() => handleDeleteFile(f.id, i)}
//                   disabled={deleting === i}
//                   title="Delete file from knowledge base"
//                   style={{
//                     display: "inline-flex", alignItems: "center", gap: 4,
//                     background: C.redLt,
//                     border: `1px solid #fca5a5`,
//                     borderRadius: 5,
//                     padding: "4px 10px",
//                     color: C.red,
//                     fontSize: 11,
//                     cursor: deleting === i ? "not-allowed" : "pointer",
//                     fontFamily: "'IBM Plex Sans', sans-serif",
//                     fontWeight: 500,
//                     whiteSpace: "nowrap",
//                     opacity: deleting === i ? 0.6 : 1,
//                     transition: "all 0.15s",
//                     flexShrink: 0,
//                   }}
//                 >
//                   {deleting === i ? <Spinner size={10} /> : "🗑"}
//                   {deleting === i ? " Deleting…" : " Delete"}
//                 </button>
//               </div>
//             ))}

//             {/* Total summary row */}
//             <div style={{
//               display: "flex", justifyContent: "flex-end",
//               paddingTop: 8, borderTop: `1px solid ${C.border}`,
//               fontSize: 12, color: C.muted, gap: 16,
//             }}>
//               <span>{indexedFiles.length} file{indexedFiles.length !== 1 ? "s" : ""}</span>
//               <span>
//                 {indexedFiles.reduce((s, f) => s + (f.chunks || 0), 0)} total chunks
//               </span>
//             </div>
//           </div>
//         )}
//       </Card>
//     </div>
//   )
// }

// // ── Result Display ────────────────────────────────────────────────────────────
// function ResultDisplay({ result }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       <Card>
//         <div style={{
//           fontSize: 10, fontWeight: 600, letterSpacing: "1px",
//           textTransform: "uppercase", color: C.muted, marginBottom: 10,
//         }}>
//           ✨ AI Answer
//         </div>
//         <div style={{
//           background: C.slate, border: `1.5px solid ${C.border}`,
//           borderRadius: 8, padding: 16, fontSize: 13,
//           color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap",
//         }}>
//           {result.answer}
//         </div>
//       </Card>

//       {result.sources?.length > 0 && (
//         <Card>
//           <div style={{
//             fontSize: 10, fontWeight: 600, letterSpacing: "1px",
//             textTransform: "uppercase", color: C.muted, marginBottom: 12,
//           }}>
//             📌 Source References ({result.sources.length})
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//             {result.sources.map((s, i) => (
//               <div key={i} style={{
//                 display: "flex", gap: 10, padding: 12,
//                 background: C.white, border: `1px solid ${C.border}`, borderRadius: 7,
//               }}>
//                 <Badge color="amber">#{i + 1}</Badge>
//                 <div>
//                   <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>
//                     {s.source?.split("/").pop() || "document"}
//                   </div>
//                   <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
//                     Page {(s.page || 0) + 1}
//                   </div>
//                   <div style={{ fontSize: 12, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>
//                     {s.snippet}…
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       {result.web_results?.length > 0 && (
//         <Card>
//           <div style={{
//             fontSize: 10, fontWeight: 600, letterSpacing: "1px",
//             textTransform: "uppercase", color: C.muted, marginBottom: 12,
//           }}>
//             🌐 Web Insights
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//             {result.web_results.map((w, i) => (
//               <div key={i} style={{
//                 padding: 12, background: C.slate,
//                 border: `1px solid ${C.border}`, borderRadius: 7,
//               }}>
//                 <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 4 }}>
//                   {w.title}
//                 </div>
//                 <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
//                   {w.snippet}
//                 </div>
//                 {w.url && (
//                   <a href={w.url} target="_blank" rel="noreferrer" style={{
//                     fontSize: 11, color: C.blue,
//                     fontFamily: "'IBM Plex Mono', monospace",
//                     marginTop: 4, display: "block",
//                   }}>
//                     {w.url}
//                   </a>
//                 )}
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}
//     </div>
//   )
// }

// // ── Query Page ────────────────────────────────────────────────────────────────
// function QueryPage({ onQuerySuccess }) {
//   const [query, setQuery]     = useState("")
//   const [useWeb, setUseWeb]   = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [result, setResult]   = useState(null)
//   const [error, setError]     = useState(null)

//   const doQuery = async () => {
//     if (!query.trim()) return
//     setLoading(true); setResult(null); setError(null)
//     try {
//       const data = await apiQuery(query, useWeb)
//       setResult(data)
//       onQuerySuccess(data, query, useWeb)
//     } catch (e) {
//       setError(e.message || "Query failed. Upload documents first.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <PageHeader title="Intelligent Analysis" sub="ReAct agent · Hybrid BM25 + vector retrieval" />

//       <Card>
//         <CardHeader icon="🔍" title="Query Engine" desc="Ask anything about your uploaded documents" />

//         <textarea
//           value={query}
//           onChange={e => setQuery(e.target.value)}
//           onKeyDown={e => { if (e.key === "Enter" && e.metaKey) doQuery() }}
//           rows={4}
//           placeholder={"e.g. Summarize key findings…\ne.g. What are the candidate's skills?\ne.g. Compare methodologies…"}
//           style={{
//             width: "100%",
//             border: `1.5px solid ${C.border}`,
//             borderRadius: 8, padding: 12,
//             fontSize: 13,
//             fontFamily: "'IBM Plex Sans', sans-serif",
//             color: C.text, resize: "none", outline: "none",
//             background: C.white, lineHeight: 1.6,
//             transition: "border 0.15s",
//           }}
//           onFocus={e => e.target.style.borderColor = C.blue}
//           onBlur={e => e.target.style.borderColor = C.border}
//         />

//         <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 12, paddingTop: 4 }}>
//           <Toggle
//             on={useWeb}
//             onToggle={() => setUseWeb(p => !p)}
//             icon="🌐"
//             label="Enable web search (Serper API)"
//           />
//         </div>

//         {error && <Alert type="error">{error}</Alert>}

//         <Btn onClick={doQuery} disabled={loading || !query.trim()} fullWidth>
//           {loading ? <><Spinner /> Analyzing…</> : <>▶ Run Analysis</>}
//         </Btn>
//       </Card>

//       {result && <ResultDisplay result={result} />}
//     </div>
//   )
// }

// // ── History Page ──────────────────────────────────────────────────────────────
// function HistoryPage({ localHistory, setLocalHistory }) {
//   const [serverHistory, setServerHistory] = useState([])
//   const [loading, setLoading]             = useState(true)
//   const [expanded, setExpanded]           = useState(null)

//   useEffect(() => {
//     apiHistory()
//       .then(d => setServerHistory(d.history || []))
//       .catch(() => {})
//       .finally(() => setLoading(false))
//   }, [])

//   const allHistory = [
//     ...localHistory,
//     ...serverHistory.filter(s =>
//       !localHistory.find(l => l.query === s.query && l.answer === s.answer)
//     ),
//   ]

//   const clearAll = async () => {
//     if (!window.confirm("Clear all query history?")) return
//     try {
//       await apiClearHistory()
//       setServerHistory([])
//       setLocalHistory([])
//     } catch (e) {
//       alert("Failed: " + e.message)
//     }
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <PageHeader
//         title="Query History"
//         sub={`${allHistory.length} queries stored in PostgreSQL`}
//         action={
//           allHistory.length > 0 && (
//             <Btn variant="danger" size="sm" onClick={clearAll}>🗑 Clear all</Btn>
//           )
//         }
//       />

//       {loading ? (
//         <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.muted, fontSize: 13 }}>
//           <Spinner /> Loading history…
//         </div>
//       ) : allHistory.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "64px 0", color: C.muted }}>
//           <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>🕓</div>
//           <div style={{ fontSize: 13 }}>No queries yet — run an analysis first</div>
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {allHistory.map((h, i) => (
//             <div key={i} style={{
//               background: C.white,
//               border: `1.5px solid ${C.border}`,
//               borderRadius: 8, overflow: "hidden",
//             }}>
//               <div
//                 onClick={() => setExpanded(expanded === i ? null : i)}
//                 style={{
//                   display: "flex", alignItems: "flex-start", gap: 10,
//                   padding: "14px 16px", cursor: "pointer",
//                   background: expanded === i ? C.slate : C.white,
//                   transition: "background 0.1s",
//                 }}
//               >
//                 <Badge>#{i + 1}</Badge>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
//                     {h.query}
//                   </div>
//                   <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>
//                     {h.created_at
//                       ? new Date(h.created_at).toLocaleString()
//                       : "Just now"
//                     } · {h.sources?.length || 0} sources · {h.use_web === "True" || h.useWeb ? "🌐 web" : "📄 docs"}
//                   </div>
//                 </div>
//                 <span style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
//                   {expanded === i ? "▲" : "▼"}
//                 </span>
//               </div>

//               {expanded === i && (
//                 <div style={{
//                   borderTop: `1px solid ${C.border}`,
//                   padding: "14px 16px",
//                   fontSize: 13, color: C.text,
//                   lineHeight: 1.7, whiteSpace: "pre-wrap",
//                 }}>
//                   {h.answer}
//                   {h.sources?.length > 0 && (
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
//                       {h.sources.map((s, j) => (
//                         <Badge key={j} color="amber">
//                           {s.source?.split("/").pop()} p.{(s.page || 0) + 1}
//                         </Badge>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // ── Stack Page ────────────────────────────────────────────────────────────────
// function StackPage() {
//   const stack = [
//     { icon: "🤖", name: "Groq · Llama 3.3-70b",      role: "LLM",        detail: "Free · Ultra fast inference" },
//     { icon: "🔗", name: "LangChain 0.2",              role: "Framework",  detail: "ReAct Agent + RAG pipeline" },
//     { icon: "🧠", name: "HuggingFace MiniLM-L6",      role: "Embeddings", detail: "Local · sentence-transformers" },
//     { icon: "📦", name: "FAISS",                      role: "Vector DB",  detail: "Saved to disk · cosine similarity" },
//     { icon: "🔍", name: "Hybrid BM25 + Vector",       role: "Retrieval",  detail: "Ensemble 40% BM25 · 60% vector" },
//     { icon: "🗄", name: "PostgreSQL",                 role: "Database",   detail: "Render managed · SQLAlchemy ORM" },
//     { icon: "⚡", name: "FastAPI",                    role: "Backend",    detail: "Python 3.11 · Uvicorn" },
//     { icon: "⚛", name: "React + Vite",               role: "Frontend",   detail: "Inline styles · Vercel deploy" },
//     { icon: "🌐", name: "Serper API",                 role: "Web Search", detail: "Optional live search tool" },
//   ]

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <PageHeader title="Tech Stack" sub="Full-stack AI architecture overview" />
//       <Card>
//         <CardHeader icon="⚙" title="Architecture" desc="Production-ready · Render + Vercel deployment" />
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {stack.map((s, i) => (
//             <div key={i} style={{
//               display: "flex", alignItems: "center", gap: 14,
//               padding: "12px 14px", background: C.white,
//               border: `1px solid ${C.border}`, borderRadius: 8,
//             }}>
//               <div style={{
//                 width: 36, height: 36, borderRadius: 7,
//                 background: C.blueLt, display: "flex",
//                 alignItems: "center", justifyContent: "center", fontSize: 18,
//               }}>
//                 {s.icon}
//               </div>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{s.name}</div>
//                 <div style={{ fontSize: 12, color: C.muted }}>{s.role} · {s.detail}</div>
//               </div>
//               <Badge color="green">Active</Badge>
//             </div>
//           ))}
//         </div>
//       </Card>
//     </div>
//   )
// }

// // ── App Root ──────────────────────────────────────────────────────────────────
// export default function App() {
//   const [active, setActive]             = useState("upload")
//   const [indexedFiles, setIndexedFiles] = useState([])
//   const [localHistory, setLocalHistory] = useState([])
//   const [stats, setStats]               = useState({ files: 0, chunks: 0, queries: 0 })

//   // Load existing files from server on mount
//   useEffect(() => {
//     apiFiles()
//       .then(d => {
//         if (d.files?.length) {
//           setIndexedFiles(d.files)
//           const chunks = d.files.reduce((s, f) => s + (f.chunks || 0), 0)
//           setStats(prev => ({ ...prev, files: d.files.length, chunks }))
//         }
//       })
//       .catch(() => {})
//   }, [])

//   const handleQuerySuccess = (data, query, useWeb) => {
//     setStats(prev => ({ ...prev, queries: prev.queries + 1 }))
//     setLocalHistory(prev => [{
//       query,
//       answer:      data.answer,
//       sources:     data.sources || [],
//       web_results: data.web_results || [],
//       useWeb,
//       created_at:  new Date().toISOString(),
//     }, ...prev])
//   }

//   const pages = {
//     upload:  (
//       <UploadPage
//         stats={stats}
//         setStats={setStats}
//         indexedFiles={indexedFiles}
//         setIndexedFiles={setIndexedFiles}
//       />
//     ),
//     query:   <QueryPage onQuerySuccess={handleQuerySuccess} />,
//     history: <HistoryPage localHistory={localHistory} setLocalHistory={setLocalHistory} />,
//     stack:   <StackPage />,
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
//       <Topbar />
//       <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
//         <Sidebar active={active} setActive={setActive} fileCount={indexedFiles.length} />
//         <main style={{
//           flex: 1, overflowY: "auto",
//           padding: 24, background: C.slate,
//         }}>
//           <div style={{ maxWidth: 760, margin: "0 auto" }}>
//             {pages[active]}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }














































// new update version 3 added chatsession and summarize UI 
// import { useState, useRef, useEffect, useCallback } from "react"

// const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

// // ── API ───────────────────────────────────────────────────────────────────────
// const api = {
//   upload:          (files) => { const fd = new FormData(); files.forEach(f => fd.append("files", f)); return fetch(`${API}/upload`, { method:"POST", body:fd }).then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t) })) },
//   query:           (body)  => fetch(`${API}/query`,     { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }).then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t) })),
//   webSearch:       (query) => fetch(`${API}/websearch`,  { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({query}) }).then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t) })),
//   files:           ()      => fetch(`${API}/files`).then(r => r.json()),
//   deleteFile:      (id)    => fetch(`${API}/files/${id}`, { method:"DELETE" }).then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t) })),
//   sessions:        ()      => fetch(`${API}/sessions`).then(r => r.json()),
//   createSession:   (title) => fetch(`${API}/sessions`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({title}) }).then(r => r.json()),
//   sessionMessages: (id)    => fetch(`${API}/sessions/${id}/messages`).then(r => r.json()),
//   deleteSession:   (id)    => fetch(`${API}/sessions/${id}`, { method:"DELETE" }).then(r => r.json()),
//   clearHistory:    ()      => fetch(`${API}/history`, { method:"DELETE" }).then(r => r.json()),
// }

// // ── Design tokens ─────────────────────────────────────────────────────────────
// const C = {
//   blue:"#1a5ce6", blueLt:"#e8effe", blueMd:"#b3c8f9", blueDk:"#0f3fa8",
//   slate:"#f7f8fc", border:"#e2e6ef", text:"#0d1a2e", muted:"#64748b",
//   green:"#16a34a", greenLt:"#dcfce7", red:"#dc2626", redLt:"#fee2e2",
//   amber:"#d97706", amberLt:"#fef3c7", white:"#ffffff",
// }

// // ── Primitives ────────────────────────────────────────────────────────────────
// const Spinner = ({ size=14 }) => (
//   <span style={{ display:"inline-block", width:size, height:size, border:`2px solid ${C.blueMd}`, borderTopColor:C.blue, borderRadius:"50%", animation:"spin 0.6s linear infinite", flexShrink:0 }} />
// )

// const Badge = ({ children, color="blue" }) => {
//   const m = { blue:{bg:C.blueLt,c:C.blue}, green:{bg:C.greenLt,c:C.green}, amber:{bg:C.amberLt,c:C.amber}, red:{bg:C.redLt,c:C.red} }
//   const s = m[color]||m.blue
//   return <span style={{ background:s.bg, color:s.c, fontSize:11, fontFamily:"'IBM Plex Mono',monospace", fontWeight:500, padding:"2px 8px", borderRadius:4, whiteSpace:"nowrap" }}>{children}</span>
// }

// const Alert = ({ type="success", children }) => {
//   const m = { success:{bg:C.greenLt,border:"#86efac",color:"#15803d",icon:"✓"}, error:{bg:C.redLt,border:"#fca5a5",color:C.red,icon:"✕"} }
//   const s = m[type]
//   return <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"12px 14px", borderRadius:7, background:s.bg, border:`1px solid ${s.border}`, color:s.color, fontSize:13, marginTop:12 }}><span style={{fontWeight:700}}>{s.icon}</span><span>{children}</span></div>
// }

// const Card = ({ children, style={} }) => (
//   <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:10, padding:20, ...style }}>{children}</div>
// )

// const CardHeader = ({ icon, title, desc }) => (
//   <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${C.border}` }}>
//     <div style={{ width:32, height:32, borderRadius:7, background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{icon}</div>
//     <div>
//       <div style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:14, color:C.text }}>{title}</div>
//       {desc && <div style={{ fontSize:12, color:C.muted, marginTop:1 }}>{desc}</div>}
//     </div>
//   </div>
// )

// const Btn = ({ children, onClick, disabled, variant="primary", size="md", fullWidth=false, style:ex={} }) => {
//   const v = { primary:{bg:C.blue,color:C.white,border:C.blue}, outline:{bg:C.white,color:C.text,border:C.border}, danger:{bg:C.redLt,color:C.red,border:"#fca5a5"}, ghost:{bg:"transparent",color:C.muted,border:"transparent"} }[variant]
//   const s = { sm:{padding:"5px 10px",fontSize:11}, md:{padding:"9px 18px",fontSize:13} }[size]
//   return (
//     <button onClick={onClick} disabled={disabled} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7, padding:s.padding, fontSize:s.fontSize, fontFamily:"'IBM Plex Sans',sans-serif", fontWeight:500, background:v.bg, color:v.color, border:`1.5px solid ${v.border}`, borderRadius:7, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1, width:fullWidth?"100%":"auto", marginTop:fullWidth?12:0, transition:"all 0.15s", ...ex }}>{children}</button>
//   )
// }

// const Textarea = ({ value, onChange, onKeyDown, placeholder, rows=3 }) => {
//   const [focused, setFocused] = useState(false)
//   return (
//     <textarea value={value} onChange={onChange} onKeyDown={onKeyDown} rows={rows} placeholder={placeholder}
//       onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
//       style={{ width:"100%", border:`1.5px solid ${focused?C.blue:C.border}`, borderRadius:8, padding:12, fontSize:13, fontFamily:"'IBM Plex Sans',sans-serif", color:C.text, resize:"none", outline:"none", background:C.white, lineHeight:1.6, transition:"border 0.15s" }} />
//   )
// }

// const PageHeader = ({ title, sub, action }) => (
//   <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:4 }}>
//     <div>
//       <div style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:800, fontSize:22, color:C.text, letterSpacing:"-0.3px" }}>{title}</div>
//       <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>{sub}</div>
//     </div>
//     {action}
//   </div>
// )

// // ── Source cards ──────────────────────────────────────────────────────────────
// function SourceCard({ source, index }) {
//   return (
//     <div style={{ display:"flex", gap:10, padding:12, background:C.white, border:`1px solid ${C.border}`, borderRadius:7 }}>
//       <Badge color="amber">#{index+1}</Badge>
//       <div>
//         <div style={{ fontSize:12, fontWeight:500, color:C.text }}>{source.source?.split("/").pop()||"document"}</div>
//         <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Page {(source.page||0)+1}</div>
//         <div style={{ fontSize:12, color:C.muted, marginTop:5, lineHeight:1.5 }}>{source.snippet}…</div>
//       </div>
//     </div>
//   )
// }

// // ── Export PDF (client-side) ──────────────────────────────────────────────────
// function exportToPDF(messages, sessionTitle) {
//   const content = messages.map(m =>
//     `Q: ${m.query}\n\nA: ${m.answer}\n\nSources: ${(m.sources||[]).map(s => `${s.source?.split("/").pop()} p.${(s.page||0)+1}`).join(", ")}\n\n${"─".repeat(60)}\n`
//   ).join("\n")

//   const blob = new Blob([`NexusAI Export — ${sessionTitle}\n${"=".repeat(60)}\n\n${content}`], { type:"text/plain" })
//   const url = URL.createObjectURL(blob)
//   const a = document.createElement("a")
//   a.href = url
//   a.download = `nexusai-${sessionTitle.replace(/\s+/g,"-").toLowerCase()}.txt`
//   a.click()
//   URL.revokeObjectURL(url)
// }

// // ── Sidebar ───────────────────────────────────────────────────────────────────
// function Sidebar({ active, setActive, fileCount, sessions, currentSessionId, onSelectSession, onNewChat, onDeleteSession }) {
//   const nav = [
//     { id:"workspace", icon:"📂", label:"Workspace", badge:fileCount },
//     { id:"websearch", icon:"🌐", label:"Web Search" },
//     { id:"stack",     icon:"⚙️",  label:"Tech Stack" },
//   ]
//   return (
//     <aside style={{ width:220, background:C.white, borderRight:`1.5px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0, height:"100%", overflow:"hidden" }}>
//       {/* Logo */}
//       <div style={{ padding:"20px 20px 16px" }}>
//         <div style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:800, fontSize:20, color:C.blue }}>Nexus<span style={{color:C.text}}>AI</span></div>
//         <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:C.muted, marginTop:2 }}>RAG · AGENT · LLM</div>
//       </div>

//       {/* Main nav */}
//       <div style={{ fontSize:10, fontWeight:600, letterSpacing:"1.2px", color:C.muted, padding:"0 20px 6px", textTransform:"uppercase" }}>Navigation</div>
//       {nav.map(({ id, icon, label, badge }) => {
//         const isActive = active===id
//         return (
//           <div key={id} onClick={() => setActive(id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 20px", fontSize:13, fontWeight:500, color:isActive?C.blue:C.muted, background:isActive?C.blueLt:"transparent", borderLeft:`3px solid ${isActive?C.blue:"transparent"}`, cursor:"pointer", transition:"all 0.15s" }}>
//             <span style={{fontSize:14}}>{icon}</span>
//             <span style={{flex:1}}>{label}</span>
//             {badge > 0 && <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, background:C.blue, color:C.white, padding:"1px 6px", borderRadius:10 }}>{badge}</span>}
//           </div>
//         )
//       })}

//       {/* Chats section */}
//       <div style={{ borderTop:`1px solid ${C.border}`, marginTop:8, paddingTop:8 }}>
//         <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px 6px" }}>
//           <span style={{ fontSize:10, fontWeight:600, letterSpacing:"1.2px", color:C.muted, textTransform:"uppercase" }}>💬 Chats</span>
//           <button onClick={onNewChat} title="New Chat" style={{ background:C.blue, color:C.white, border:"none", borderRadius:4, padding:"2px 7px", fontSize:11, cursor:"pointer", fontWeight:600 }}>+ New</button>
//         </div>
//         <div style={{ overflowY:"auto", maxHeight:200 }}>
//           {sessions.length === 0 && (
//             <div style={{ padding:"8px 20px", fontSize:12, color:C.muted }}>No chats yet</div>
//           )}
//           {sessions.map(s => (
//             <div key={s.id} onClick={() => { setActive("workspace"); onSelectSession(s.id) }}
//               style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 20px", cursor:"pointer", background:currentSessionId===s.id?C.blueLt:"transparent", borderLeft:`3px solid ${currentSessionId===s.id?C.blue:"transparent"}`, transition:"all 0.1s" }}>
//               <span style={{ fontSize:11, color:C.text, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>💬 {s.title}</span>
//               <span onClick={e => { e.stopPropagation(); onDeleteSession(s.id) }} style={{ color:C.muted, fontSize:12, cursor:"pointer", padding:"0 2px" }}>✕</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Footer */}
//       <div style={{ marginTop:"auto", padding:"14px 20px", borderTop:`1px solid ${C.border}`, fontSize:11, color:C.muted, lineHeight:1.6 }}>
//         <div style={{ fontWeight:600, color:C.text, fontSize:12, marginBottom:2 }}>Nexus RAG Engine</div>
//         FastAPI · LangChain · FAISS
//         <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:6 }}>
//           <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite" }} />
//           <span>Groq · Llama 3.3-70b</span>
//         </div>
//       </div>
//     </aside>
//   )
// }

// // ── Topbar ────────────────────────────────────────────────────────────────────
// function Topbar({ sessionTitle, onExport, hasMessages }) {
//   return (
//     <div style={{ background:C.white, borderBottom:`1.5px solid ${C.border}`, height:52, display:"flex", alignItems:"center", padding:"0 24px", gap:10, flexShrink:0 }}>
//       <span style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:14, color:C.text }}>AI Research Engine</span>
//       <Badge>v2.0</Badge>
//       {sessionTitle && <span style={{ fontSize:12, color:C.muted, marginLeft:8 }}>· {sessionTitle}</span>}
//       <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
//         {hasMessages && (
//           <Btn variant="outline" size="sm" onClick={onExport}>⬇ Export</Btn>
//         )}
//         <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.muted }}>
//           <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite" }} />
//           Connected · Groq
//         </div>
//       </div>
//     </div>
//   )
// }

// // ── Document Summary Card ─────────────────────────────────────────────────────
// function SummaryCard({ file }) {
//   const [open, setOpen] = useState(false)
//   return (
//     <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden" }}>
//       <div onClick={() => setOpen(p => !p)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", cursor:"pointer", background:open?C.slate:C.white, transition:"background 0.1s" }}>
//         <span>📄</span>
//         <span style={{ flex:1, fontWeight:500, color:C.text, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{file.name}</span>
//         <Badge color="green">{file.chunks} chunks</Badge>
//         {file.size_kb > 0 && <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:C.muted }}>{file.size_kb}KB</span>}
//         <span style={{ color:C.muted, fontSize:12 }}>{open?"▲":"▼"}</span>
//       </div>
//       {open && file.summary && (
//         <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.border}`, background:C.blueLt }}>
//           <div style={{ fontSize:10, fontWeight:600, color:C.blue, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6 }}>📝 AI Summary</div>
//           <div style={{ fontSize:12, color:C.text, lineHeight:1.7 }}>{file.summary}</div>
//         </div>
//       )}
//     </div>
//   )
// }

// // ── Chat Thread ───────────────────────────────────────────────────────────────
// function ChatThread({ messages }) {
//   const bottomRef = useRef()
//   useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }) }, [messages])

//   if (messages.length === 0) {
//     return (
//       <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:C.muted, gap:10 }}>
//         <div style={{ fontSize:40, opacity:0.3 }}>🔍</div>
//         <div style={{ fontSize:13 }}>Ask anything about your documents</div>
//         <div style={{ fontSize:12 }}>Upload PDFs first, then type your question below</div>
//       </div>
//     )
//   }

//   return (
//     <div style={{ flex:1, overflowY:"auto", padding:"16px 0", display:"flex", flexDirection:"column", gap:16 }}>
//       {messages.map((m, i) => (
//         <div key={i} style={{ display:"flex", flexDirection:"column", gap:10 }}>
//           {/* User question */}
//           <div style={{ display:"flex", justifyContent:"flex-end" }}>
//             <div style={{ background:C.blue, color:C.white, borderRadius:"12px 12px 4px 12px", padding:"10px 14px", fontSize:13, maxWidth:"80%", lineHeight:1.6 }}>
//               {m.query}
//             </div>
//           </div>
//           {/* AI answer */}
//           <div style={{ display:"flex", gap:10 }}>
//             <div style={{ width:28, height:28, borderRadius:"50%", background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>🤖</div>
//             <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
//               <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"4px 12px 12px 12px", padding:"12px 14px", fontSize:13, color:C.text, lineHeight:1.8, whiteSpace:"pre-wrap" }}>
//                 {m.loading ? <span style={{color:C.muted}}><Spinner size={12} /> &nbsp;Thinking…</span> : m.answer}
//               </div>
//               {/* Sources */}
//               {m.sources?.length > 0 && (
//                 <div>
//                   <div style={{ fontSize:10, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:6 }}>📌 Sources</div>
//                   <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
//                     {m.sources.map((s, j) => <SourceCard key={j} source={s} index={j} />)}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       ))}
//       <div ref={bottomRef} />
//     </div>
//   )
// }

// // ── Workspace Page (Upload LEFT + Analysis RIGHT) ─────────────────────────────
// function WorkspacePage({ indexedFiles, setIndexedFiles, stats, setStats, sessionId, setSessionId, sessions, setSessions }) {
//   const [pending, setPending]     = useState([])
//   const [uploading, setUploading] = useState(false)
//   const [uploadAlert, setUploadAlert] = useState(null)
//   const [dragging, setDragging]   = useState(false)
//   const [deleting, setDeleting]   = useState(null)
//   const [messages, setMessages]   = useState([])
//   const [query, setQuery]         = useState("")
//   const [loading, setLoading]     = useState(false)
//   const [queryError, setQueryError] = useState(null)
//   const inputRef = useRef()

//   // Load messages when session changes
//   useEffect(() => {
//     if (!sessionId) { setMessages([]); return }
//     api.sessionMessages(sessionId).then(d => {
//       setMessages((d.messages||[]).map(m => ({ ...m, loading:false })))
//     }).catch(() => setMessages([]))
//   }, [sessionId])

//   const addFiles = useCallback((files) => {
//     const pdfs = [...files].filter(f => f.type==="application/pdf")
//     setPending(prev => { const names = new Set(prev.map(p=>p.name)); return [...prev, ...pdfs.filter(f=>!names.has(f.name))] })
//   }, [])

//   const doUpload = async () => {
//     if (!pending.length) return
//     setUploading(true); setUploadAlert(null)
//     try {
//       const data = await api.upload(pending)
//       setUploadAlert({ type:"success", msg:data.message })
//       const newChunks = (data.files||[]).reduce((s,f) => s+(f.chunks||0), 0)
//       setStats(prev => ({ files:prev.files+pending.length, chunks:prev.chunks+newChunks, queries:prev.queries }))
//       setIndexedFiles(prev => [...prev, ...(data.files||[])])
//       setPending([])
//     } catch(e) { setUploadAlert({ type:"error", msg:e.message }) }
//     finally { setUploading(false) }
//   }

//   const handleDelete = async (fileId, index) => {
//     if (!window.confirm("Delete this file?")) return
//     setDeleting(index)
//     try {
//       if (fileId) await api.deleteFile(fileId)
//       const deleted = indexedFiles[index]
//       setIndexedFiles(prev => prev.filter((_,i) => i!==index))
//       setStats(prev => ({ ...prev, files:Math.max(0,prev.files-1), chunks:Math.max(0,prev.chunks-(deleted?.chunks||0)) }))
//       setUploadAlert({ type:"success", msg:`"${deleted?.name}" deleted.` })
//     } catch(e) { setUploadAlert({ type:"error", msg:"Delete failed: "+e.message }) }
//     finally { setDeleting(null) }
//   }

//   const doQuery = async () => {
//     if (!query.trim()) return
//     setLoading(true); setQueryError(null)
//     const userMsg = { query, answer:"", sources:[], loading:true }
//     setMessages(prev => [...prev, userMsg])
//     const q = query; setQuery("")
//     try {
//       const data = await api.query({ query:q, use_web:false, session_id:sessionId })
//       // Update session list and current session
//       if (!sessionId) {
//         setSessionId(data.session_id)
//         const s = await api.sessions()
//         setSessions(s.sessions||[])
//       }
//       setMessages(prev => prev.map((m,i) => i===prev.length-1 ? { ...m, answer:data.answer, sources:data.sources||[], loading:false } : m))
//       setStats(prev => ({ ...prev, queries:prev.queries+1 }))
//     } catch(e) {
//       setQueryError(e.message||"Query failed. Upload documents first.")
//       setMessages(prev => prev.slice(0,-1))
//     }
//     finally { setLoading(false) }
//   }

//   return (
//     <div style={{ display:"flex", gap:20, height:"100%", overflow:"hidden" }}>

//       {/* LEFT — Upload panel */}
//       <div style={{ width:300, flexShrink:0, overflowY:"auto", display:"flex", flexDirection:"column", gap:14 }}>

//         {/* Stats */}
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
//           {[{val:stats.files,label:"Files"},{val:stats.chunks,label:"Chunks"},{val:stats.queries,label:"Queries"}].map((s,i)=>(
//             <div key={i} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
//               <div style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:800, fontSize:20, color:C.text }}>{s.val}</div>
//               <div style={{ fontSize:11, color:C.muted }}>{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Upload card */}
//         <Card style={{ padding:16 }}>
//           <CardHeader icon="⬆" title="Upload PDFs" desc="Drag & drop or click" />
//           <div onClick={() => inputRef.current?.click()} onDrop={e=>{e.preventDefault();setDragging(false);addFiles(e.dataTransfer.files)}} onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)}
//             style={{ border:`2px dashed ${dragging?C.blue:C.blueMd}`, borderRadius:8, padding:"20px 12px", textAlign:"center", cursor:"pointer", background:dragging?"#dce8fd":C.blueLt, transition:"all 0.15s" }}>
//             <div style={{fontSize:24,marginBottom:6}}>📄</div>
//             <div style={{fontSize:12,color:C.text,fontWeight:600}}>Drop PDFs here</div>
//             <div style={{fontSize:11,color:C.muted,marginTop:2}}>or click to browse</div>
//           </div>
//           <input ref={inputRef} type="file" accept=".pdf" multiple style={{display:"none"}} onChange={e=>addFiles(e.target.files)} />

//           {pending.length > 0 && (
//             <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:4 }}>
//               {pending.map((f,i) => (
//                 <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", background:C.slate, border:`1px solid ${C.border}`, borderRadius:6, fontSize:12 }}>
//                   <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:C.text}}>{f.name}</span>
//                   <span onClick={()=>setPending(p=>p.filter((_,j)=>j!==i))} style={{color:C.muted,cursor:"pointer"}}>✕</span>
//                 </div>
//               ))}
//               <Btn onClick={doUpload} disabled={uploading} fullWidth>
//                 {uploading?<><Spinner/>Processing…</>:<>⚡ Build Index</>}
//               </Btn>
//             </div>
//           )}
//           {uploadAlert && <Alert type={uploadAlert.type}>{uploadAlert.msg}</Alert>}
//         </Card>

//         {/* Indexed files with summary cards */}
//         <Card style={{ padding:16 }}>
//           <CardHeader icon="🗄" title="Indexed Files" desc="Click to see AI summary" />
//           {indexedFiles.length === 0 ? (
//             <div style={{ textAlign:"center", padding:"20px 0", color:C.muted, fontSize:12 }}>
//               <div style={{fontSize:24,opacity:0.3,marginBottom:6}}>📭</div>No files yet
//             </div>
//           ) : (
//             <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
//               {indexedFiles.map((f,i) => (
//                 <div key={f.id||i}>
//                   <SummaryCard file={f} />
//                   <div style={{ display:"flex", justifyContent:"flex-end", marginTop:3 }}>
//                     <button onClick={()=>handleDelete(f.id,i)} disabled={deleting===i}
//                       style={{ fontSize:10, color:C.red, background:C.redLt, border:`1px solid #fca5a5`, borderRadius:4, padding:"2px 8px", cursor:"pointer" }}>
//                       {deleting===i?<Spinner size={9}/>:"🗑 Delete"}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               <div style={{ fontSize:11, color:C.muted, textAlign:"right", paddingTop:6, borderTop:`1px solid ${C.border}` }}>
//                 {indexedFiles.reduce((s,f)=>s+(f.chunks||0),0)} total chunks
//               </div>
//             </div>
//           )}
//         </Card>
//       </div>

//       {/* RIGHT — Analysis panel */}
//       <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:0, background:C.white, border:`1.5px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
//         <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, background:C.slate, display:"flex", alignItems:"center", gap:8 }}>
//           <span style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:14, color:C.text }}>🔍 Analysis</span>
//           <Badge>RAG · Hybrid Search</Badge>
//         </div>

//         {/* Messages */}
//         <div style={{ flex:1, overflowY:"auto", padding:"16px 18px", display:"flex", flexDirection:"column" }}>
//           <ChatThread messages={messages} />
//         </div>

//         {/* Query input */}
//         <div style={{ padding:"12px 18px", borderTop:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:8 }}>
//           {queryError && <Alert type="error">{queryError}</Alert>}
//           <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
//             <div style={{ flex:1 }}>
//               <Textarea value={query} onChange={e=>setQuery(e.target.value)} rows={2}
//                 onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();doQuery()}}}
//                 placeholder="Ask anything about your documents… (Enter to send, Shift+Enter for new line)" />
//             </div>
//             <Btn onClick={doQuery} disabled={loading||!query.trim()} style={{ alignSelf:"flex-end", padding:"10px 16px" }}>
//               {loading?<Spinner/>:"▶"}
//             </Btn>
//           </div>
//           <div style={{ fontSize:11, color:C.muted }}>Enter to send · Shift+Enter for new line · Results include source attribution</div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ── Web Search Page ───────────────────────────────────────────────────────────
// // function WebSearchPage() {
// //   const [query, setQuery]     = useState("")
// //   const [loading, setLoading] = useState(false)
// //   const [results, setResults] = useState(null)
// //   const [error, setError]     = useState(null)

// //   const doSearch = async () => {
// //     if (!query.trim()) return
// //     setLoading(true); setError(null); setResults(null)
// //     try {
// //       const data = await api.webSearch(query)
// //       setResults(data)
// //     } catch(e) { setError(e.message) }
// //     finally { setLoading(false) }
// //   }

// //   return (
// //     <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
// //       <PageHeader title="Web Search" sub="Live web results · Optional cross-reference with your documents" />

// //       <Card>
// //         <CardHeader icon="🌐" title="Search the Web" desc="Powered by Serper API · Set SERPER_API_KEY to enable" />
// //         <Textarea value={query} onChange={e=>setQuery(e.target.value)} rows={2}
// //           onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();doSearch()}}}
// //           placeholder="Search anything… e.g. Latest AI research trends 2025" />
// //         {error && <Alert type="error">{error}</Alert>}
// //         <Btn onClick={doSearch} disabled={loading||!query.trim()} fullWidth>
// //           {loading?<><Spinner/>Searching…</>:<>🔍 Search Web</>}
// //         </Btn>
// //       </Card>

// //       {results && (
// //         <>
// //           {/* Web results */}
// //           {results.results?.length > 0 && (
// //             <Card>
// //               <div style={{ fontSize:10, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:12 }}>🌐 Web Results ({results.results.length})</div>
// //               <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
// //                 {results.results.map((r,i) => (
// //                   <div key={i} style={{ padding:14, background:C.slate, border:`1px solid ${C.border}`, borderRadius:8 }}>
// //                     <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:6 }}>
// //                       <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{r.title}</div>
// //                       <Badge>{i+1}</Badge>
// //                     </div>
// //                     <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, marginBottom:6 }}>{r.snippet}</div>
// //                     {r.url && <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.blue, fontFamily:"'IBM Plex Mono',monospace" }}>{r.url}</a>}
// //                   </div>
// //                 ))}
// //               </div>
// //             </Card>
// //           )}

// //           {/* Document cross-reference */}
// //           {results.doc_context?.length > 0 && (
// //             <Card>
// //               <div style={{ fontSize:10, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:12 }}>📄 Related in Your Documents</div>
// //               <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
// //                 {results.doc_context.map((s,i) => <SourceCard key={i} source={s} index={i} />)}
// //               </div>
// //             </Card>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   )
// // }


// // update version 4 
// // removed doc cross reference session
// function WebSearchPage() {
//   const [query, setQuery]     = useState("")
//   const [loading, setLoading] = useState(false)
//   const [results, setResults] = useState(null)
//   const [error, setError]     = useState(null)

//   const doSearch = async () => {
//     if (!query.trim()) return
//     setLoading(true); setError(null); setResults(null)
//     try {
//       const data = await api.webSearch(query)
//       setResults(data)
//     } catch(e) { setError(e.message) }
//     finally { setLoading(false) }
//   }

//   return (
//     <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
//       <PageHeader
//         title="Web Search"
//         sub="Live web results only — your uploaded documents are not consulted"
//       />

//       <Card>
//         <CardHeader
//           icon="🌐"
//           title="Search the Web"
//           desc="Powered by Serper API · Set SERPER_API_KEY in .env to enable"
//         />
//         <Textarea
//           value={query}
//           onChange={e => setQuery(e.target.value)}
//           rows={2}
//           onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); doSearch() } }}
//           placeholder="Search anything… e.g. Latest AI research trends 2025"
//         />
//         {error && <Alert type="error">{error}</Alert>}
//         <Btn onClick={doSearch} disabled={loading || !query.trim()} fullWidth>
//           {loading ? <><Spinner /> Searching…</> : <>🔍 Search Web</>}
//         </Btn>
//       </Card>

//       {results?.results?.length > 0 && (
//         <Card>
//           <div style={{
//             fontSize:10, fontWeight:600, color:C.muted,
//             textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:12,
//           }}>
//             🌐 Web Results ({results.results.length})
//           </div>
//           <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
//             {results.results.map((r, i) => (
//               <div key={i} style={{
//                 padding:14, background:C.slate,
//                 border:`1px solid ${C.border}`, borderRadius:8,
//               }}>
//                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:6 }}>
//                   <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{r.title}</div>
//                   <Badge>{i+1}</Badge>
//                 </div>
//                 <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, marginBottom:6 }}>
//                   {r.snippet}
//                 </div>
//                 {r.url && (
//                   <a href={r.url} target="_blank" rel="noreferrer"
//                     style={{ fontSize:11, color:C.blue, fontFamily:"'IBM Plex Mono',monospace" }}>
//                     {r.url}
//                   </a>
//                 )}
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       {results && results.results?.length === 0 && (
//         <div style={{ textAlign:"center", padding:"40px 0", color:C.muted }}>
//           <div style={{ fontSize:32, marginBottom:10, opacity:0.3 }}>🌐</div>
//           <div style={{ fontSize:13 }}>No results found. Try a different query.</div>
//         </div>
//       )}
//     </div>
//   )
// }

// // ── Stack Page ────────────────────────────────────────────────────────────────
// function StackPage() {
//   const stack = [
//     {icon:"🤖",name:"Groq · Llama 3.3-70b",role:"LLM",detail:"Free · ultra-fast"},
//     {icon:"🔗",name:"LangChain 0.2",role:"Framework",detail:"RAG + agent pipeline"},
//     {icon:"🧠",name:"Google . gemini-embedding-001",role:"Embeddings",detail:"Local · no API cost"},
//     {icon:"📦",name:"FAISS",role:"Vector DB",detail:"Disk-persisted"},
//     {icon:"🔍",name:"BM25 + Vector",role:"Hybrid Search",detail:"Ensemble 40/60"},
//     {icon:"🗄",name:"PostgreSQL",role:"Database",detail:"Sessions + history"},
//     {icon:"⚡",name:"FastAPI",role:"Backend",detail:"Python 3.11"},
//     {icon:"⚛",name:"React + Vite",role:"Frontend",detail:"Tailwind v4"},
//     {icon:"☁",name:"Render + Vercel",role:"Deploy",detail:"Free tier"},
//     {icon:"🌐",name:"Serper API",role:"Web Search",detail:"Optional"},
//   ]
//   return (
//     <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
//       <PageHeader title="Tech Stack" sub="Full-stack AI architecture" />
//       <Card>
//         <CardHeader icon="⚙" title="Architecture" desc="Production-ready · v2.0" />
//         <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
//           {stack.map((s,i) => (
//             <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"11px 14px", background:C.white, border:`1px solid ${C.border}`, borderRadius:8 }}>
//               <div style={{ width:34, height:34, borderRadius:7, background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{s.icon}</div>
//               <div style={{flex:1}}>
//                 <div style={{fontSize:13,fontWeight:500,color:C.text}}>{s.name}</div>
//                 <div style={{fontSize:11,color:C.muted}}>{s.role} · {s.detail}</div>
//               </div>
//               <Badge color="green">Active</Badge>
//             </div>
//           ))}
//         </div>
//       </Card>
//     </div>
//   )
// }

// // ── App Root ──────────────────────────────────────────────────────────────────
// export default function App() {
//   const [active, setActive]             = useState("workspace")
//   const [indexedFiles, setIndexedFiles] = useState([])
//   const [stats, setStats]               = useState({ files:0, chunks:0, queries:0 })
//   const [sessions, setSessions]         = useState([])
//   const [sessionId, setSessionId]       = useState(null)
//   const [sessionTitle, setSessionTitle] = useState("")
//   const [messagesForExport, setMessagesForExport] = useState([])

//   // Load files + sessions on mount
//   useEffect(() => {
//     api.files().then(d => {
//       if (d.files?.length) {
//         setIndexedFiles(d.files)
//         const chunks = d.files.reduce((s,f) => s+(f.chunks||0), 0)
//         setStats(prev => ({ ...prev, files:d.files.length, chunks }))
//       }
//     }).catch(()=>{})

//     api.sessions().then(d => setSessions(d.sessions||[])).catch(()=>{})
//   }, [])

//   const handleNewChat = async () => {
//     setSessionId(null)
//     setSessionTitle("")
//     setActive("workspace")
//   }

//   const handleSelectSession = async (id) => {
//     setSessionId(id)
//     const s = sessions.find(s => s.id===id)
//     setSessionTitle(s?.title||"")
//     setStats(prev => ({ ...prev, queries:prev.queries }))
//   }

//   const handleDeleteSession = async (id) => {
//     try {
//       await api.deleteSession(id)
//       setSessions(prev => prev.filter(s => s.id!==id))
//       if (sessionId===id) { setSessionId(null); setSessionTitle("") }
//     } catch(e) { alert("Failed: "+e.message) }
//   }

//   const handleExport = () => {
//     if (messagesForExport.length) exportToPDF(messagesForExport, sessionTitle||"chat")
//   }

//   const pages = {
//     workspace: (
//       <WorkspacePage
//         indexedFiles={indexedFiles} setIndexedFiles={setIndexedFiles}
//         stats={stats} setStats={setStats}
//         sessionId={sessionId} setSessionId={setSessionId}
//         sessions={sessions} setSessions={setSessions}
//       />
//     ),
//     websearch: <WebSearchPage />,
//     stack:     <StackPage />,
//   }

//   return (
//     <div style={{ display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden" }}>
//       <Topbar sessionTitle={sessionTitle} onExport={handleExport} hasMessages={messagesForExport.length>0} />
//       <div style={{ display:"flex", flex:1, minHeight:0 }}>
//         <Sidebar
//           active={active} setActive={setActive} fileCount={indexedFiles.length}
//           sessions={sessions} currentSessionId={sessionId}
//           onSelectSession={handleSelectSession} onNewChat={handleNewChat}
//           onDeleteSession={handleDeleteSession}
//         />
//         <main style={{ flex:1, overflowY:"auto", padding:active==="workspace"?20:24, background:C.slate }}>
//           <div style={{ maxWidth:active==="workspace"?"100%":760, margin:"0 auto", height:active==="workspace"?"100%":"auto" }}>
//             {pages[active]}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }







  


// ═══════════════════════════════════════════════════════════════════════════════════
// NexusAI RAG Research Engine — v4.0 Architecture
// ═══════════════════════════════════════════════════════════════════════════════════
// 
// FEATURES:
// • Workspace: Upload PDFs, ask questions using RAG (Retrieval-Augmented Generation)
// • Web Search: Live web search with persistent history (stored in localStorage)
// • Documents: View all indexed files permanently
// • Tech Stack: Display architecture overview
// • Chat History: Save and resume past conversations
// • Web Search History: Click to view old searches and their results
//
// KEY CHANGES:
// 1. Web search history now persists to localStorage (survives page reload)
// 2. Clicking history items displays original query + results in Web Search page
// 3. Responsive layout: 1-column on mobile, 2-column on desktop for search results
// 4. Prevents horizontal scroll on mobile by wrapping long URLs
// 5. Web Search page has constrained max-width (1200px) instead of 100% coverage
//

import { useState, useRef, useEffect, useCallback } from "react"

// ── API Configuration ──────────────────────────────────────────────────────────────
// Backend URL from environment variable or fallback to localhost:8000
const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

// ── API Helper Functions ──────────────────────────────────────────────────────────
// Encapsulates all backend API calls. Each method handles error reporting and JSON parsing.
const api = {
  
  upload:          (files) => { const fd = new FormData(); files.forEach(f => fd.append("files", f)); return fetch(`${API}/upload`, { method:"POST", body:fd }).then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t) })) },
  files:           ()      => fetch(`${API}/files`).then(r => r.json()),
  deleteFile:      (id)    => fetch(`${API}/files/${id}`, { method:"DELETE" }).then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t) })),
  query:           (body)  => fetch(`${API}/query`,    { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }).then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t) })),
  webSearch:       (query) => fetch(`${API}/websearch`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({query}) }).then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t) })),
  sessions:        ()      => fetch(`${API}/sessions`).then(r => r.json()),
  createSession:   (title) => fetch(`${API}/sessions`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({title}) }).then(r => r.json()),
  sessionMessages: (id)    => fetch(`${API}/sessions/${id}/messages`).then(r => r.json()),
  deleteSession:   (id)    => fetch(`${API}/sessions/${id}`, { method:"DELETE" }).then(r => r.json()),
  
  // History
  clearHistory:    ()      => fetch(`${API}/history`, { method:"DELETE" }).then(r => r.json()),
}

// ── Design System / Color Tokens ──────────────────────────────────────────────────
// Centralized color constants used throughout the app for consistency
const C = {
  blue:"#1a5ce6", blueLt:"#e8effe", blueMd:"#b3c8f9", blueDk:"#0f3fa8",
  slate:"#f7f8fc", border:"#e2e6ef", text:"#0d1a2e", muted:"#64748b", white:"#ffffff",
  green:"#16a34a", greenLt:"#dcfce7", 
  red:"#dc2626", redLt:"#fee2e2",     
  amber:"#d97706", amberLt:"#fef3c7", 
}

// ── Primitives ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
const Spinner = ({ size=16 }) => (
  <span style={{ display:"inline-block", width:size, height:size, border:`2px solid ${C.blueMd}`, borderTopColor:C.blue, borderRadius:"50%", animation:"spin 0.6s linear infinite", flexShrink:0 }} />
)

const Badge = ({ children, color="blue" }) => {
  const m = { blue:{bg:C.blueLt,c:C.blue}, green:{bg:C.greenLt,c:C.green}, amber:{bg:C.amberLt,c:C.amber}, red:{bg:C.redLt,c:C.red} }
  const s = m[color]||m.blue
  return <span style={{ background:s.bg, color:s.c, fontSize:12, fontFamily:"'IBM Plex Mono',monospace", fontWeight:600, padding:"3px 10px", borderRadius:4, whiteSpace:"nowrap" }}>{children}</span>
}

const Alert = ({ type="success", children }) => {
  const m = { success:{bg:C.greenLt,border:"#86efac",color:"#15803d",icon:"✓"}, error:{bg:C.redLt,border:"#fca5a5",color:C.red,icon:"✕"} }
  const s = m[type]
  return <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"14px 16px", borderRadius:8, background:s.bg, border:`1px solid ${s.border}`, color:s.color, fontSize:14, marginTop:12 }}><span style={{fontWeight:700,fontSize:16}}>{s.icon}</span><span>{children}</span></div>
}

const Card = ({ children, style={} }) => (
  <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:12, padding:24, ...style }}>{children}</div>
)

const CardHeader = ({ icon, title, desc }) => (
  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18, paddingBottom:16, borderBottom:`1px solid ${C.border}` }}>
    <div style={{ width:36, height:36, borderRadius:8, background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
    <div>
      <div style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:16, color:C.text }}>{title}</div>
      {desc && <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>{desc}</div>}
    </div>
  </div>
)

const Btn = ({ children, onClick, disabled, variant="primary", size="md", fullWidth=false, style:ex={} }) => {
  const v = { primary:{bg:C.blue,color:C.white,border:C.blue}, outline:{bg:C.white,color:C.text,border:C.border}, danger:{bg:C.redLt,color:C.red,border:"#fca5a5"}, ghost:{bg:"transparent",color:C.muted,border:"transparent"} }[variant]
  const s = { sm:{padding:"6px 14px",fontSize:12}, md:{padding:"10px 20px",fontSize:14} }[size]
  return (
    <button onClick={onClick} disabled={disabled} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, padding:s.padding, fontSize:s.fontSize, fontFamily:"'IBM Plex Sans',sans-serif", fontWeight:500, background:v.bg, color:v.color, border:`1.5px solid ${v.border}`, borderRadius:8, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1, width:fullWidth?"100%":"auto", marginTop:fullWidth?14:0, transition:"all 0.15s", ...ex }}>{children}</button>
  )
}

const Textarea = ({ value, onChange, onKeyDown, placeholder, rows=3 }) => {
  const [focused, setFocused] = useState(false)
  return (
    <textarea value={value} onChange={onChange} onKeyDown={onKeyDown} rows={rows} placeholder={placeholder}
      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
      style={{ width:"100%", border:`1.5px solid ${focused?C.blue:C.border}`, borderRadius:8, padding:"14px", fontSize:14, fontFamily:"'IBM Plex Sans',sans-serif", color:C.text, resize:"none", outline:"none", background:C.white, lineHeight:1.7, transition:"border 0.15s" }} />
  )
}

const PageHeader = ({ title, sub, action }) => (
  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6 }}>
    <div>
      <div style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:800, fontSize:26, color:C.text, letterSpacing:"-0.3px" }}>{title}</div>
      <div style={{ fontSize:14, color:C.muted, marginTop:5 }}>{sub}</div>
    </div>
    {action}
  </div>
)

function SourceCard({ source, index }) {
  return (
    <div style={{ display:"flex", gap:12, padding:14, background:C.white, border:`1px solid ${C.border}`, borderRadius:8 }}>
      <Badge color="amber">#{index+1}</Badge>
      <div>
        <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{source.source?.split("/").pop()||"document"}</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>Page {(source.page||0)+1}</div>
        <div style={{ fontSize:13, color:C.muted, marginTop:6, lineHeight:1.6 }}>{source.snippet}…</div>
      </div>
    </div>
  )
}

function exportToPDF(messages, sessionTitle) {
  const content = messages.map(m =>
    `Q: ${m.query}\n\nA: ${m.answer}\n\nSources: ${(m.sources||[]).map(s=>`${s.source?.split("/").pop()} p.${(s.page||0)+1}`).join(", ")}\n\n${"─".repeat(60)}\n`
  ).join("\n")
  const blob = new Blob([`NexusAI Export — ${sessionTitle}\n${"=".repeat(60)}\n\n${content}`], {type:"text/plain"})
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a"); a.href=url; a.download=`nexusai-${sessionTitle.replace(/\s+/g,"-").toLowerCase()}.txt`; a.click()
  URL.revokeObjectURL(url)
}

// ═══════════════════════════════════════════════════════════════════════════════════
// SIDEBAR COMPONENT — Navigation & History Panel
// ═══════════════════════════════════════════════════════════════════════════════════
// Displays main navigation, web search history, or chat history depending on active page.
// NEW PROPS (Web Search History):
//   • webSearchHistory: Array of past web searches { id, query, results, resultsCount, time }
//   • onSelectWebSearch(id): Called when user clicks a history item to view its results
//   • onDeleteWebSearch(id): Called when user clicks delete (✕) on a history item
//   • onNewSearch(): Called when "+ New" button is clicked in web search view
// 
function Sidebar({ active, setActive, fileCount, sessions, webSearchHistory, currentSessionId, onSelectSession, onNewChat, onDeleteSession, onDeleteWebSearch, onSelectWebSearch, onNewSearch }) {

  const isWebSearch = active === "websearch"

  const mainNav = [
    { id:"workspace", icon:"🔍", label:"Workspace" },
    { id:"documents", icon:"📂", label:"Documents", badge:fileCount },
    { id:"websearch", icon:"🌐", label:"Web Search" },
    { id:"stack",     icon:"⚙️",  label:"Tech Stack" },
  ]

  return (
    <aside style={{ width:240, background:C.white, borderRight:`1.5px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0, height:"100%", overflow:"hidden" }}>

      {/* Logo */}
      <div style={{ padding:"22px 22px 18px" }}>
        <div style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:800, fontSize:22, color:C.blue }}>Nexus<span style={{color:C.text}}>AI</span></div>
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:C.muted, marginTop:3 }}>RAG · AGENT · LLM</div>
      </div>

      {/* Main nav */}
      <div style={{ fontSize:11, fontWeight:600, letterSpacing:"1.2px", color:C.muted, padding:"0 22px 8px", textTransform:"uppercase" }}>Navigation</div>
      {mainNav.map(({ id, icon, label, badge }) => {
        const isActive = active===id
        return (
          <div key={id} onClick={()=>setActive(id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 22px", fontSize:14, fontWeight:500, color:isActive?C.blue:C.muted, background:isActive?C.blueLt:"transparent", borderLeft:`3px solid ${isActive?C.blue:"transparent"}`, cursor:"pointer", transition:"all 0.15s" }}>
            <span style={{fontSize:16}}>{icon}</span>
            <span style={{flex:1}}>{label}</span>
            {badge > 0 && <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, background:C.blue, color:C.white, padding:"2px 7px", borderRadius:10 }}>{badge}</span>}
          </div>
        )
      })}

      {/* Dynamic secondary panel */}
      <div style={{ borderTop:`1px solid ${C.border}`, marginTop:10, paddingTop:10, flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>

        {/* Web Search History — shown when web search is active */}
        {isWebSearch ? (
          <>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 22px 8px" }}>
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:"1.2px", color:C.muted, textTransform:"uppercase" }}>🔎 Search History</span>
              <button onClick={onNewSearch} style={{ background:C.blue, color:C.white, border:"none", borderRadius:5, padding:"3px 9px", fontSize:12, cursor:"pointer", fontWeight:600 }}>+ New</button>
            </div>
            <div style={{ overflowY:"auto", flex:1 }}>
              {webSearchHistory.length === 0 ? (
                <div style={{ padding:"10px 22px", fontSize:13, color:C.muted }}>No search history yet</div>
              ) : (
                webSearchHistory.map(h => (
                  <div key={h.id} onClick={() => onSelectWebSearch?.(h.id) }
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 22px", cursor:"pointer", transition:"all 0.1s" }}>
                    <span style={{ fontSize:13, color:C.text, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>🌐 {h.query}</span>
                    <span onClick={e => { e.stopPropagation(); onDeleteWebSearch?.(h.id) }} style={{ color:C.muted, fontSize:13, cursor:"pointer", padding:"0 2px" }}>✕</span>
                  </div>
                ))
              )}
            </div>
          </>
          
        ) : (
          /* Chat History — shown on all other pages */
          <>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 22px 8px" }}>
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:"1.2px", color:C.muted, textTransform:"uppercase" }}>💬 Chats</span>
              <button onClick={onNewChat} style={{ background:C.blue, color:C.white, border:"none", borderRadius:5, padding:"3px 9px", fontSize:12, cursor:"pointer", fontWeight:600 }}>+ New</button>
            </div>
            <div style={{ overflowY:"auto", flex:1 }}>
              {sessions.length === 0 ? (
                <div style={{ padding:"10px 22px", fontSize:13, color:C.muted }}>No chats yet</div>
              ) : (
                sessions.map(s => (
                  <div key={s.id} onClick={()=>{ setActive("workspace"); onSelectSession(s.id) }}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 22px", cursor:"pointer", background:currentSessionId===s.id?C.blueLt:"transparent", borderLeft:`3px solid ${currentSessionId===s.id?C.blue:"transparent"}`, transition:"all 0.1s" }}>
                    <span style={{ fontSize:13, color:C.text, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>💬 {s.title}</span>
                    <span onClick={e=>{e.stopPropagation();onDeleteSession(s.id)}} style={{ color:C.muted, fontSize:13, cursor:"pointer", padding:"0 2px" }}>✕</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
      {/*FOOTER */}
      <div style={{ padding:"16px 22px", borderTop:`1px solid ${C.border}`, fontSize:12, color:C.muted, lineHeight:1.7 }}>
        <div style={{ fontWeight:600, color:C.text, fontSize:13, marginBottom:3 }}>Nexus RAG Engine</div>
        FastAPI · LangChain · FAISS
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:7 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite" }} />
          <span>Groq · Llama 3.3-70b</span>
        </div>
      </div>
    </aside>
  )
}

// ── Topbar ────────────────────────────────────────────────────────────────────
function Topbar({ sessionTitle, onExport, hasMessages }) {
  return (
    <div style={{ background:C.white, borderBottom:`1.5px solid ${C.border}`, height:58, display:"flex", alignItems:"center", padding:"0 28px", gap:12, flexShrink:0 }}>
      <span style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:16, color:C.text }}>AI Research Engine</span>
      
      {sessionTitle && <span style={{ fontSize:13, color:C.muted, marginLeft:6 }}>· {sessionTitle}</span>}
      <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:12 }}>
        {hasMessages && <Btn variant="outline" size="sm" onClick={onExport}>⬇ Export</Btn>}
        <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:C.muted }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite" }} />
          Connected · Groq
        </div>
      </div>
    </div>
  )
}

// ── Document Summary Card ─────────────────────────────────────────────────────
function SummaryCard({ file, onDelete, deleting }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden", marginBottom:8 }}>
      <div onClick={()=>setOpen(p=>!p)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", cursor:"pointer", background:open?C.slate:C.white, transition:"background 0.1s" }}>
        <span style={{fontSize:18}}>📄</span>
        <span style={{ flex:1, fontWeight:500, color:C.text, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{file.name}</span>
        <Badge color="green">{file.chunks} chunks</Badge>
        {file.size_kb > 0 && <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color:C.muted }}>{file.size_kb}KB</span>}
        <span style={{ color:C.muted, fontSize:13 }}>{open?"▲":"▼"}</span>
      </div>
      {open && (
        <div style={{ padding:"14px 16px", borderTop:`1px solid ${C.border}`, background:C.blueLt }}>
          {file.summary && (
            <>
              <div style={{ fontSize:11, fontWeight:600, color:C.blue, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>📝 AI Summary</div>
              <div style={{ fontSize:13, color:C.text, lineHeight:1.8, marginBottom:12 }}>{file.summary}</div>
            </>
          )}
          <button onClick={()=>onDelete()} disabled={deleting}
            style={{ fontSize:12, color:C.red, background:C.redLt, border:`1px solid #fca5a5`, borderRadius:5, padding:"4px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            {deleting ? <Spinner size={11}/> : "🗑"} {deleting ? "Deleting…" : "Delete file"}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Chat Thread ───────────────────────────────────────────────────────────────
function ChatThread({ messages }) {
  const bottomRef = useRef()
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }) }, [messages])

  if (messages.length === 0) {
    return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:C.muted, gap:12 }}>
        <div style={{ fontSize:48, opacity:0.25 }}>🔍</div>
        <div style={{ fontSize:15, fontWeight:500 }}>Ask anything about your documents</div>
        <div style={{ fontSize:13 }}>Upload PDFs first, then type your question below</div>
      </div>
    )
  }

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"20px 0", display:"flex", flexDirection:"column", gap:20 }}>
      {messages.map((m,i) => (
        <div key={i} style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* User question */}
          <div style={{ display:"flex", justifyContent:"flex-end" }}>
            <div style={{ background:C.blue, color:C.white, borderRadius:"14px 14px 4px 14px", padding:"12px 18px", fontSize:14, maxWidth:"80%", lineHeight:1.7 }}>
              {m.query}
            </div>
          </div>
          {/* AI answer */}
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"4px 14px 14px 14px", padding:"14px 18px", fontSize:14, color:C.text, lineHeight:1.9, whiteSpace:"pre-wrap" }}>
                {m.loading ? <span style={{color:C.muted,display:"flex",alignItems:"center",gap:8}}><Spinner size={14}/> Thinking…</span> : m.answer}
              </div>
              {m.sources?.length > 0 && (
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>📌 Sources</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {m.sources.map((s,j) => <SourceCard key={j} source={s} index={j} />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

// Fixed Layout of Workspace
// ── Workspace Page — Upload LEFT + Analysis RIGHT ──────────────────────────────

function WorkspacePage({ stats, setStats, sessionId, setSessionId, sessions, setSessions }) {
  const [pending, setPending]       = useState([])
  const [uploading, setUploading]   = useState(false)
  const [uploadAlert, setUploadAlert] = useState(null)
  const [dragging, setDragging]     = useState(false)
  const [messages, setMessages]     = useState([])
  const [query, setQuery]           = useState("")
  const [loading, setLoading]       = useState(false)
  const [queryError, setQueryError] = useState(null)
  const inputRef = useRef()

  // 1. DYNAMIC SCREEN RESOLUTION TRACKER
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024)
    }
    // Set initial value
    handleResize()
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!sessionId) { setMessages([]); return }
    api.sessionMessages(sessionId)
      .then(d => setMessages((d.messages||[]).map(m => ({...m, loading:false}))))
      .catch(() => setMessages([]))
  }, [sessionId])

  const addFiles = useCallback((files) => {
    const pdfs = [...files].filter(f => f.type==="application/pdf")
    setPending(prev => { const names = new Set(prev.map(p=>p.name)); return [...prev, ...pdfs.filter(f=>!names.has(f.name))] })
  }, [])

  const doUpload = async () => {
    if (!pending.length) return
    setUploading(true); setUploadAlert(null)
    try {
      const data = await api.upload(pending)
      setUploadAlert({ type:"success", msg:data.message })
      const newChunks = (data.files||[]).reduce((s,f)=>s+(f.chunks||0),0)
      setStats(prev => ({ ...prev, files:prev.files+pending.length, chunks:prev.chunks+newChunks }))
      setPending([])
    } catch(e) { setUploadAlert({ type:"error", msg:e.message }) }
    finally { setUploading(false) }
  }

  const doQuery = async () => {
    if (!query.trim()) return
    setLoading(true); setQueryError(null)
    setMessages(prev => [...prev, { query, answer:"", sources:[], loading:true }])
    const q = query; setQuery("")
    try {
      const data = await api.query({ query:q, use_web:false, session_id:sessionId })
      if (!sessionId) {
        setSessionId(data.session_id)
        api.sessions().then(d => setSessions(d.sessions||[])).catch(()=>{})
      }
      setMessages(prev => prev.map((m,i) => i===prev.length-1 ? { ...m, answer:data.answer, sources:data.sources||[], loading:false } : m))
      setStats(prev => ({ ...prev, queries:prev.queries+1 }))
    } catch(e) {
      setQueryError(e.message||"Query failed. Upload documents first.")
      setMessages(prev => prev.slice(0,-1))
    }
    finally { setLoading(false) }
  }

  return (
    // <div style={{ 
    //   display: "flex", 
    //   // 2. RESPONSIVE LAYOUT DIRECTION: side-by-side on big screens, stacked on small screens
    //   flexDirection: isSmallScreen ? "column" : "row", 
    //   // gap: 24, 
    //   gap: 20,
    //   // 3. RESPONSIVE HEIGHT MANAGEMENT: Fills viewport height on desktop, naturally expands on mobile
    //   height: isSmallScreen ? "auto" : "calc(100vh - 58px)", 
    //   width: "100%",
    //   boxSizing: "border-box",
    //   padding: isSmallScreen ? "16px" : "24px", 
    //   // 4. PREVENTS OUTSIDE DOUBLE SCROLLBARS: Scroll inner panels on desktop, scroll entire page body on mobile
    //   overflowX: "hidden",
      
    //   overflowY: isSmallScreen ? "auto" : "hidden"
      
      
      
      
    // }}>
    <div
      style={{
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        gap: 20,

        height: isSmallScreen
          ? "auto"
          : "100%",

        overflowX: "hidden",
        // overflowY: "hidden",
        overflowY: isSmallScreen ? "auto" : "hidden",

        padding: isSmallScreen ? "16px" : "24px",
        boxSizing: "border-box"
      }}
    >
    
      {/* LEFT PANEL — Upload cards & Tips */}
      {/* <div style={{ 
        width: isSmallScreen ? "100%" : 320, 
        flexShrink: 0, 
        overflowY: isSmallScreen ? "visible" : "auto", 
        display: "flex", 
        flexDirection: "column", 
        gap: 16 
      }}> */}
      <div
        style={{
          width: isSmallScreen ? "100%" : 360,
          flexShrink: 0,

          display: "flex",
          flexDirection: "column",

          gap: 16,

          height: isSmallScreen
            ? "auto"
            : "100%"
        }}
      >

        {/* Upload card */}
        {/* <Card style={{ padding:18 }}> */}
        <Card style={{ padding:18,flex:1 }}>
          <CardHeader icon="⬆" title="Upload PDFs" desc="Drag & drop or click to browse" />

          <div onClick={()=>inputRef.current?.click()}
            onDrop={e=>{e.preventDefault();setDragging(false);addFiles(e.dataTransfer.files)}}
            onDragOver={e=>{e.preventDefault();setDragging(true)}}
            onDragLeave={()=>setDragging(false)}
            style={{ border:`2px dashed ${dragging?C.blue:C.blueMd}`, borderRadius:10, padding:"28px 16px", textAlign:"center", cursor:"pointer", background:dragging?"#dce8fd":C.blueLt, transition:"all 0.15s" }}>
            <div style={{fontSize:32,marginBottom:8}}>📄</div>
            <div style={{fontSize:14,color:C.text,fontWeight:600}}>Drop PDFs here</div>
            <div style={{fontSize:12,color:C.muted,marginTop:4}}>Multiple files supported · Max 10MB each</div>
          </div>
          <input ref={inputRef} type="file" accept=".pdf" multiple style={{display:"none"}} onChange={e=>addFiles(e.target.files)} />

          {pending.length > 0 && (
            <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ fontSize:12, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.7px" }}>Ready to upload ({pending.length})</div>
              {pending.map((f,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", background:C.slate, border:`1px solid ${C.border}`, borderRadius:8, fontSize:13 }}>
                  <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:C.text,fontWeight:500}}>{f.name}</span>
                  <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:C.muted}}>{(f.size/1024).toFixed(0)}KB</span>
                  <span onClick={()=>setPending(p=>p.filter((_,j)=>j!==i))} style={{color:C.muted,cursor:"pointer",fontSize:15}}>✕</span>
                </div>
              ))}
              <Btn onClick={doUpload} disabled={uploading} fullWidth>
                {uploading?<><Spinner/>Processing…</>:<>⚡ Build Knowledge Base</>}
              </Btn>
            </div>
          )}
          {uploadAlert && <Alert type={uploadAlert.type}>{uploadAlert.msg}</Alert>}
        </Card>

        {/* Tip box */}
        {/* <div style={{ background:C.blueLt, border:`1px solid ${C.blueMd}`, borderRadius:10, padding:"14px 16px" }}> */}
        <div
          style={{
            background:C.blueLt,
            border:`1px solid ${C.blueMd}`,
            borderRadius:10,
            padding:"14px 16px",

            flex:1
          }}
        >
          <div style={{ fontSize:13, fontWeight:600, color:C.blue, marginBottom:6 }}>💡 Quick Tips</div>
          <div style={{ fontSize:13, color:C.blueDk, lineHeight:1.8 }}>
            • Upload PDFs on the left<br/>
            • Ask questions on the right<br/>
            • View indexed files in <b>Documents</b> tab<br/>
            • Each chat is saved automatically<br/>
            • Use <b>Web Search</b> for live results
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Analysis chat (goes under layout tips on small screens) */}
      {/* <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        minWidth: 0, 
        // 5. RESPONSIVE COMPONENT SIZING: Scales to chat context dynamically on mobile, stays bounded on desktop
        height: isSmallScreen ? "auto" : "100%", 
        
        minHeight: isSmallScreen ? "500px" : 0, 
        background: C.white, 
        border: `1.5px solid ${C.border}`, 
        borderRadius: 12, 
        overflow: "hidden" 
      }}> */}

      {/* 2nd change */}
      {/* <div
  style={{
    flex:1,
    height: isSmallScreen ? "600px" : "100%",
    display:"flex",
    flexDirection:"column",
    minHeight:0,
    background:C.white,
    border:`1.5px solid ${C.border}`,
    borderRadius:12,
    overflow:"hidden",
    width:isSmallScreen ? "100%" : "auto"
  }}
> */}

      {/* third change */}
      <div
        style={{
          flex:1,
          height: isSmallScreen ? "600px" : "100%",
          display:"flex",
          flexDirection:"column",
          minHeight:isSmallScreen ? "600px" : 0,
          background:C.white,
          border:`1.5px solid ${C.border}`,
          borderRadius:12,
          overflow:"hidden",
          width:isSmallScreen ? "100%" : "auto"
        }}
      >
        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}`, background:C.slate, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:16, color:C.text }}>🔍 Analysis</span>
          <Badge>RAG · Hybrid Search · Groq</Badge>
          {messages.length > 0 && (
            <Btn variant="outline" size="sm" style={{marginLeft:"auto"}} onClick={()=>exportToPDF(messages,"chat")}>⬇ Export</Btn>
          )}
        </div>

        {/* Inner Chat Thread message area wrapper */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "16px 22px", 
          display: "flex", 
          flexDirection: "column",
          // Gives explicit height space to threads inside a variable height layout wrapper
          height: isSmallScreen ? "380px" : "auto" 
        }}>
          <ChatThread messages={messages} />
        </div>

        <div style={{ padding:"14px 22px", borderTop:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:10, background: C.white }}>
          {queryError && <Alert type="error">{queryError}</Alert>}
          {/* <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}> */}
          <div
            style={{
              display:"flex",
              gap:10,
              // alignItems:"stretch"
              // alignItems:"center"
              alignItems: "flex-start"
            }}
          >
            <div style={{flex:1}}>
              {/* <Textarea value={query} onChange={e=>setQuery(e.target.value)} rows={2} */}
              <Textarea value={query} onChange={e=>setQuery(e.target.value)} rows={1}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();doQuery()}}}
                placeholder="Ask anything about your documents…" />
            </div>
            {/* <Btn onClick={doQuery} disabled={loading||!query.trim()} style={{alignSelf:"flex-end",padding:"12px 18px"}}> */}
            {/* <Btn
              onClick={doQuery}
              disabled={loading||!query.trim()}
              style={{
                minWidth:110,
                height:"100%"
              }}
            >            */}


            <Btn
              onClick={doQuery}
              disabled={loading||!query.trim()}
              style={{
                minWidth:90,
                height:48,
                marginTop:2
              }}
            > 
            
              {loading?<Spinner/>:"▶ Send"}
            </Btn>
          </div>
          <div style={{ fontSize:12, color:C.muted }}>Enter to send · Shift+Enter for new line · Sources included in every answer</div>
        </div>
      </div>
    </div>
  )
}


// ── Documents Page — Indexed files only ───────────────────────────────────────
function DocumentsPage({ indexedFiles, setIndexedFiles, stats, setStats }) {
  const [deleting, setDeleting] = useState(null)
  const [alert, setAlert]       = useState(null)

  const handleDelete = async (fileId, index) => {
    if (!window.confirm("Delete this file from the knowledge base?")) return
    setDeleting(index)
    try {
      if (fileId) await api.deleteFile(fileId)
      const deleted = indexedFiles[index]
      setIndexedFiles(prev => prev.filter((_,i)=>i!==index))
      setStats(prev => ({ ...prev, files:Math.max(0,prev.files-1), chunks:Math.max(0,prev.chunks-(deleted?.chunks||0)) }))
      setAlert({ type:"success", msg:`"${deleted?.name}" deleted successfully.` })
    } catch(e) { setAlert({ type:"error", msg:"Delete failed: "+e.message }) }
    finally { setDeleting(null) }
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
      <PageHeader title="Documents" sub="All indexed files stored in PostgreSQL · FAISS vector index on disk" />

      {alert && <Alert type={alert.type}>{alert.msg}</Alert>}

      {/* Summary stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {[
          {val:indexedFiles.length, label:"Total files"},
          {val:indexedFiles.reduce((s,f)=>s+(f.chunks||0),0), label:"Total chunks"},
          {val:indexedFiles.reduce((s,f)=>s+(f.size_kb||0),0).toFixed(0)+"KB", label:"Total size"},
        ].map((s,i) => (
          <div key={i} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"16px 18px" }}>
            <div style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:800, fontSize:26, color:C.text }}>{s.val}</div>
            <div style={{ fontSize:13, color:C.muted, marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader icon="📂" title="Indexed Files" desc="Click any file to expand AI summary · Delete to remove from knowledge base" />
        {indexedFiles.length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 0", color:C.muted }}>
            <div style={{fontSize:48,opacity:0.2,marginBottom:12}}>📭</div>
            <div style={{fontSize:15,fontWeight:500}}>No files indexed yet</div>
            <div style={{fontSize:13,marginTop:6}}>Upload PDFs from the Workspace tab</div>
          </div>
        ) : (
          <div>
            {indexedFiles.map((f,i) => (
              <SummaryCard key={f.id||i} file={f}
                onDelete={() => handleDelete(f.id,i)}
                deleting={deleting===i} />
            ))}
            <div style={{ fontSize:13, color:C.muted, textAlign:"right", paddingTop:10, borderTop:`1px solid ${C.border}` }}>
              {indexedFiles.length} file{indexedFiles.length!==1?"s":""} · {indexedFiles.reduce((s,f)=>s+(f.chunks||0),0)} chunks total
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// ── Web Search Page — Full width ──────────────────────────────────────────────
// WEB SEARCH PAGE — Live web search + responsive results grid + history replay


function WebSearchPage({ onSearch, selectedSearch }) {
  // Search state
  const [query, setQuery]     = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError]     = useState(null)
  
  // RESPONSIVE GRID STATE: 1 column on mobile (<768px), 2 columns on desktop
  // Purpose: Prevent horizontal scrolling on small screens by limiting items per row
  const [columns, setColumns] = useState(window.innerWidth < 768 ? 1 : 2)

  // WEB SEARCH HANDLER: Calls backend, saves full results for localStorage persistence
  const doSearch = async () => {
    if (!query.trim()) return
    setLoading(true); setError(null); setResults(null)
    try {
      const data = await api.webSearch(query)
      setResults(data)
      
      const entry = { id: String(Date.now()), query, resultsCount: data.results?.length || 0, time: new Date().toISOString(), results: data.results }
      onSearch(entry) 
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  // REPLAY HISTORY: Display previously searched query + cached results
  
  useEffect(() => {
    if (selectedSearch) {
      setQuery(selectedSearch.query || "")
      setResults({ results: selectedSearch.results || [] })
    }
  }, [selectedSearch])

  // RESPONSIVE GRID LISTENER: Track window width, update columns on resize

  useEffect(() => {
    const onResize = () => setColumns(window.innerWidth < 768 ? 1 : 2)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, height:"100%", overflowX:"hidden", maxWidth:1200, margin:"0 auto", width:"95%", paddingRight:20, paddingLeft:20, boxSizing:"border-box" }}>
      <PageHeader title="Web Search" sub="Live web results only — your uploaded documents are not consulted here" />

      {/* Search input — full width prominent */}
      <Card style={{ padding:24 }}>
        <CardHeader icon="🌐" title="Search the Web" desc="Powered by Serper API · Set SERPER_API_KEY in your .env to enable" />
        <Textarea value={query} onChange={e=>setQuery(e.target.value)} rows={3}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();doSearch()}}}
          placeholder="Search anything on the web…&#10;e.g. Latest AI research trends 2025&#10;e.g. How does LangChain work" />
        {error && <Alert type="error">{error}</Alert>}
        <Btn onClick={doSearch} disabled={loading||!query.trim()} fullWidth style={{padding:"13px 20px",fontSize:15}}>
          {loading?<><Spinner size={18}/>Searching the web…</>:<>🔍 Search Web</>}
        </Btn>
      </Card>

      {/* Results — full width grid */}
      {results?.results?.length > 0 && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:18, color:C.text }}>Results</div>
            <Badge>{results.results.length} found</Badge>
          </div>
          {/* RESPONSIVE GRID: Uses `columns` state to determine layout
              Mobile (<768px): 1 column, Desktop (>=768px): 2 columns
              Prevents horizontal scroll by respecting screen size */}
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${columns},1fr)`, gap:16, width:"100%", boxSizing:"border-box", overflowX:"hidden" }}>
            {results.results.map((r,i) => (

              // Each result card: word-break + overflowWrap prevent long URLs from breaking layout
              <div key={i} style={{ padding:20, background:C.white, border:`1.5px solid ${C.border}`, borderRadius:12, display:"flex", flexDirection:"column", gap:10, wordBreak:"break-word", overflowWrap:"anywhere" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
                  <div style={{ fontSize:15, fontWeight:600, color:C.text, lineHeight:1.5 }}>{r.title}</div>
                  <Badge>{i+1}</Badge>
                </div>
                <div style={{ fontSize:13, color:C.muted, lineHeight:1.8, flex:1 }}>{r.snippet}</div>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer"
                    style={{ fontSize:12, color:C.blue, fontFamily:"'IBM Plex Mono',monospace", overflowWrap:"anywhere", wordBreak:"break-all", display:"block" }}>
                    🔗 {r.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {results && results.results?.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 0", color:C.muted }}>
          <div style={{fontSize:48,marginBottom:14,opacity:0.25}}>🌐</div>
          <div style={{fontSize:16,fontWeight:500}}>No results found</div>
          <div style={{fontSize:14,marginTop:6}}>Try a different search query</div>
        </div>
      )}

      {!results && !loading && (
        <div style={{ textAlign:"center", padding:"60px 0", color:C.muted }}>
          <div style={{fontSize:48,marginBottom:14,opacity:0.2}}>🔎</div>
          <div style={{fontSize:16,fontWeight:500}}>Enter a query above to search the web</div>
          <div style={{fontSize:14,marginTop:6}}>Results are completely independent from your uploaded documents</div>
        </div>
      )}
    </div>
  )
}

// ── Stack Page ────────────────────────────────────────────────────────────────
function StackPage() {
  const stack = [
    {icon:"🤖",name:"Groq · Llama 3.3-70b",role:"LLM",detail:"Free · ultra-fast inference"},
    {icon:"🔗",name:"LangChain 0.2",role:"Framework",detail:"RAG + agent pipeline"},
    {icon:"🧠",name:"Google Embedding-001",role:"Embeddings",detail:"Via Google Generative AI"},
    {icon:"📦",name:"FAISS",role:"Vector DB",detail:"Disk-persisted · cosine"},
    {icon:"🔍",name:"BM25 + Vector",role:"Hybrid Search",detail:"Ensemble 40/60"},
    {icon:"🗄",name:"PostgreSQL",role:"Database",detail:"Sessions + history + files"},
    {icon:"⚡",name:"FastAPI",role:"Backend",detail:"Python 3.11 · Uvicorn"},
    {icon:"⚛",name:"React + Vite",role:"Frontend",detail:"Tailwind v4"},
    {icon:"☁",name:"Render + Vercel",role:"Deploy",detail:"Free tier"},
    {icon:"🌐",name:"Serper API",role:"Web Search",detail:"Optional · 2500 free/mo"},
  ]
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
      <PageHeader title="Tech Stack" sub="Full-stack AI architecture overview" />
      <Card>
        {/* <CardHeader icon="⚙" title="Architecture Components" desc="Production-ready · Render + Vercel deployment" /> */}
        <CardHeader icon="⚙" title="Architecture Components"  />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
          {stack.map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:C.slate, border:`1px solid ${C.border}`, borderRadius:10 }}>
              <div style={{ width:38, height:38, borderRadius:8, background:C.white, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{s.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500,color:C.text}}>{s.name}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:2}}>{s.role} · {s.detail}</div>
              </div>
              <Badge color="green">✓</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ── App Root ──────────────────────────────────────────────────────────────────

// ROOT APP COMPONENT — Main state management, routing, component orchestration

// Manages: active page, file list, chat sessions, web search history, selected search
// Key Features: localStorage persistence for web search, responsive layout

export default function App() {
  // Navigation & page state
  const [active, setActive]             = useState("workspace")
  
  // File & RAG state
  const [indexedFiles, setIndexedFiles] = useState([])
  const [stats, setStats]               = useState({ files:0, chunks:0, queries:0 })
  
  // Chat session state
  const [sessions, setSessions]         = useState([])
  const [sessionId, setSessionId]       = useState(null)
  const [sessionTitle, setSessionTitle] = useState("")
  
  // WEB SEARCH HISTORY STATE (New in v4)
 
  const [webSearchHistory, setWebSearchHistory] = useState([])
  
  // Currently selected history entry from sidebar click (null = new search)
  const [selectedWebSearch, setSelectedWebSearch] = useState(null)

  // MOUNT-TIME INITIALIZATION
  // 1. Load indexed files and stats
  // 2. Load past chat sessions
  // 3. Load persisted web search history from localStorage (survives page reload!)
  useEffect(() => {
    api.files().then(d => {
      if (d.files?.length) {
        setIndexedFiles(d.files)
        const chunks = d.files.reduce((s,f)=>s+(f.chunks||0),0)
        setStats(prev => ({ ...prev, files:d.files.length, chunks }))
      }
    }).catch(()=>{})
    api.sessions().then(d => setSessions(d.sessions||[])).catch(()=>{})
    
    // LOAD WEB SEARCH HISTORY FROM LOCALSTORAGE
    // Key: "webSearchHistory", stored as JSON array
    // Gracefully handles missing/corrupt data with try-catch
    try {
      const stored = localStorage.getItem("webSearchHistory")
      if (stored) setWebSearchHistory(JSON.parse(stored))
    } catch (e) { /* ignore parse errors */ }
  }, [])

  // CHAT SESSION HANDLERS
  
  const handleNewChat = () => {
    setSessionId(null)
    setSessionTitle("")
    setActive("workspace")
  }

  const handleSelectSession = (id) => {
    setSessionId(id)
    const s = sessions.find(s=>s.id===id)
    setSessionTitle(s?.title||"")
    setActive("workspace")
  }

  const handleDeleteSession = async (id) => {
    try {
      await api.deleteSession(id)
      setSessions(prev => prev.filter(s=>s.id!==id))
      if (sessionId===id) { setSessionId(null); setSessionTitle("") }
    } catch(e) { alert("Failed: "+e.message) }
  }

  // WEB SEARCH HISTORY HANDLERS (New in v4)
  
  // Called after successful web search. Saves entry to both state + localStorage.
  
  const handleWebSearch = (entry) => {
    const next = [entry, ...webSearchHistory].slice(0,20) // Add to front, keep 20 max
    setWebSearchHistory(next)
    setSelectedWebSearch(entry) // Display results immediately
    try { localStorage.setItem("webSearchHistory", JSON.stringify(next)) } catch(e) {}
  }

  const handleDeleteWebSearch = (id) => {
    const next = webSearchHistory.filter(item => item.id !== id)
    setWebSearchHistory(next)
    try { localStorage.setItem("webSearchHistory", JSON.stringify(next)) } catch(e) {}
  }

  // Clicked history item in sidebar: find entry, set as selected, switch to websearch view
  const handleSelectWebSearch = (id) => {
    const entry = webSearchHistory.find(item => item.id === id) || null
    setSelectedWebSearch(entry)
    setActive("websearch") // Switch to web search page
  }

  const handleNewSearch = () => {
    setSelectedWebSearch(null)
    setActive("websearch")
  }

  // PAGE ROUTER: Maps active page ID to component with appropriate props
  
  const pages = {
    workspace: (
      <WorkspacePage
        stats={stats} setStats={setStats}
        sessionId={sessionId} setSessionId={setSessionId}
        sessions={sessions} setSessions={setSessions}
      />
    ),
    documents: (
      <DocumentsPage
        indexedFiles={indexedFiles} setIndexedFiles={setIndexedFiles}
        stats={stats} setStats={setStats}
      />
    ),
    websearch: <WebSearchPage onSearch={handleWebSearch} selectedSearch={selectedWebSearch} />,
    stack:     <StackPage />,
  }

  const isWorkspace = active === "workspace"
  const isSmallScreen = window.innerWidth < 1024

  return (
    // <div style={{ display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden" }}>
    <div
      style={{
        display:"flex",
        flexDirection:"column",

        height:"100dvh",

        overflow:"hidden"
      }}
    >
      <Topbar sessionTitle={sessionTitle} onExport={()=>{}} hasMessages={false} />
      <div style={{ display:"flex", flex:1, minHeight:0 }}>
        <Sidebar
          active={active} setActive={setActive} fileCount={indexedFiles.length}
          sessions={sessions} webSearchHistory={webSearchHistory}
          currentSessionId={sessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onDeleteWebSearch={handleDeleteWebSearch}
          onSelectWebSearch={handleSelectWebSearch}
          onNewSearch={handleNewSearch}
        />
        <main
          style={{
            flex:1,
    

            overflowY:isSmallScreen
              ? "auto"
              : (isWorkspace ? "hidden" : "auto"),

            // padding:isWorkspace ? 20 : 28,
            padding:isWorkspace ? 0 : 28,
            background:C.slate,

            display:isWorkspace ? "flex" : "block",
            flexDirection:"column",

            minHeight:0
          }}
        >
          {/* <div style={{ maxWidth:isWorkspace?"100%":820, margin:"0 auto", height:isWorkspace?"100%":"auto" }}> */}
          <div
            style={{
              width:"100%",
              height:isWorkspace ? "100%" : "auto"
            }}
          >
            {pages[active]}
          </div>
        </main>
      </div>
    </div>
  )
}