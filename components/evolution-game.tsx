'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CloudRain, Droplets, Hammer, RotateCcw, ShieldCheck, Waves } from 'lucide-react'

type Material = 'soil' | 'concrete'
type Mode = 'build' | 'rain' | 'failed' | 'won'
type Block = { material: Material; hp: number }

const W = 900
const H = 520
const cols = 12
const rows = 3
const maxBlocks = cols * rows

export function EvolutionGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blocksRef = useRef<(Block | null)[]>(Array(maxBlocks).fill(null))
  const rafRef = useRef<number | null>(null)
  const startRef = useRef(0)
  const rainStartRef = useRef(0)
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number }[]>([])
  const [material, setMaterial] = useState<Material>('soil')
  const [mode, setMode] = useState<Mode>('build')
  const [elapsed, setElapsed] = useState(0)
  const [strength, setStrength] = useState(0)
  const [budget, setBudget] = useState(0)

  const reset = useCallback(() => {
    blocksRef.current = Array(maxBlocks).fill(null)
    particlesRef.current = []
    setMode('build'); setElapsed(0); setStrength(0); setBudget(0)
  }, [])

  const paint = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== 'build') return
    const canvas = canvasRef.current; if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * W
    const y = ((event.clientY - rect.top) / rect.height) * H
    const gx = Math.floor((x - 310) / 46); const gy = Math.floor((y - 352) / 38)
    if (gx < 0 || gx >= cols || gy < 0 || gy >= rows) return
    const index = gy * cols + gx
    if (!blocksRef.current[index]) {
      blocksRef.current[index] = { material, hp: material === 'concrete' ? 5 : 2 }
      setBudget((v) => v + (material === 'concrete' ? 8 : 3))
      setStrength((v) => v + (material === 'concrete' ? 13 : 6))
    }
  }, [material, mode])

  const startRain = () => { if (mode !== 'build') return; setMode('rain'); rainStartRef.current = performance.now(); startRef.current = performance.now() }

  useEffect(() => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return
    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#d8c9a7'; ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#a9d0d2'; ctx.fillRect(0, 292, W, 228)
      ctx.fillStyle = '#78b5bc'; ctx.fillRect(0, 327, 900, 193)
      ctx.strokeStyle = '#4d929e'; ctx.lineWidth = 2
      for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(20 + i * 140, 350 + Math.sin(now / 500 + i) * 5); ctx.quadraticCurveTo(70 + i * 140, 340, 125 + i * 140, 350); ctx.stroke() }
      ctx.fillStyle = '#496b58'; ctx.fillRect(0, 284, 900, 10)
      ctx.fillStyle = '#385747'; ctx.font = '700 14px sans-serif'; ctx.fillText('上流', 24, 277); ctx.fillText('暮らしのある町', 690, 277)
      ctx.fillStyle = '#f3ead7'; ctx.fillRect(610, 200, 150, 78); ctx.fillStyle = '#ca765d'; ctx.fillRect(630, 218, 36, 60); ctx.fillRect(687, 211, 42, 67); ctx.fillStyle = '#fff3c8'; ctx.fillRect(638, 229, 12, 15); ctx.fillRect(696, 221, 13, 17)
      ctx.fillStyle = '#e6edf0'; ctx.fillRect(790, 185, 66, 93); ctx.fillStyle = '#d9a44b'; ctx.fillRect(799, 196, 48, 30); ctx.fillStyle = '#496b58'; ctx.font = '700 11px sans-serif'; ctx.fillText('学校', 811, 214)
      ctx.fillStyle = '#304f59'; ctx.font = '22px sans-serif'; ctx.fillText('♟  ♟  ♟', 640, 322)
      ctx.strokeStyle = '#d79b3b'; ctx.setLineDash([7, 5]); ctx.strokeRect(300, 344, 570, 122); ctx.setLineDash([])
      ctx.fillStyle = '#856a45'; ctx.font = '700 12px sans-serif'; ctx.fillText('ここに堤防をつくる', 310, 338)
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const b = blocksRef.current[r * cols + c]; const x = 310 + c * 46, y = 352 + r * 38; ctx.strokeStyle = '#e7d8b8'; ctx.strokeRect(x, y, 42, 34); if (b) { ctx.fillStyle = b.material === 'concrete' ? '#71808a' : '#a47943'; ctx.fillRect(x + 2, y + 2, 38, 30); ctx.fillStyle = b.material === 'concrete' ? '#aebac0' : '#c09555'; ctx.fillRect(x + 8, y + 8, 8, 6) } }
      if (mode === 'rain' || mode === 'failed' || mode === 'won') { const t = Math.min(10000, now - rainStartRef.current); ctx.fillStyle = `rgba(39,83,107,${Math.min(.6, t / 18000)})`; ctx.fillRect(0, 292, W, Math.max(0, t / 80)); ctx.strokeStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 70; i++) { const x = (i * 97 + now / 8) % W; const y = (i * 43 + now / 4) % 300; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 5, y + 13); ctx.stroke() } }
      particlesRef.current.forEach((p) => { p.x += p.vx; p.y += p.vy; p.life -= .018; ctx.fillStyle = `rgba(239,177,64,${p.life})`; ctx.fillRect(p.x, p.y, 5, 5) }); particlesRef.current = particlesRef.current.filter((p) => p.life > 0)
      if (mode === 'rain') { const seconds = Math.floor((now - rainStartRef.current) / 1000); setElapsed(seconds); if (seconds >= 10) { if (strength >= 50 && blocksRef.current.filter(Boolean).length >= 10) setMode('won'); else setMode('failed') } }
      if (mode === 'won' && particlesRef.current.length < 80) for (let i = 0; i < 12; i++) particlesRef.current.push({ x: 520 + Math.random() * 230, y: 190, vx: Math.random() * 4 - 2, vy: Math.random() * 3 + 1, life: 1 })
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw); return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [mode, strength])

  return <main className="levee-app"><header className="levee-header"><div className="levee-brand"><span className="brand-mark"><Waves size={19} /></span><div><strong>まちをまもれ！</strong><small>LEVEe DEFENSE / FIELD 01</small></div></div><button className="reset-link" onClick={reset}><RotateCcw size={15} /> 最初から</button></header><div className="levee-shell"><section className="levee-intro"><div><p className="eyebrow">HAND-ON DISASTER PREVENTION LAB</p><h1>水のちからを、<br /><em>堤防で受け止めろ。</em></h1><p>川があふれる前に、町を守る堤防を設計しよう。<br />材料を選び、建設ゾーンをクリックして配置します。</p></div><div className="goal-card"><ShieldCheck size={22} /><span>MISSION</span><strong>10秒間、町を守る</strong></div></section><div className="sim-grid"><aside className="control-panel"><div className="panel-title"><Hammer size={18} /><span>建設コントロール</span></div><div className="status-box"><span>STATUS</span><strong className={mode}>{mode === 'build' ? '建設準備中' : mode === 'rain' ? '大雨が接近中' : mode === 'won' ? '防衛成功' : '堤防が決壊'}</strong><small>{mode === 'rain' ? `${elapsed} / 10 秒` : '建設ゾーンに配置してください'}</small></div><p className="control-label">材料を選ぶ</p><button className={`material ${material === 'soil' ? 'selected' : ''}`} onClick={() => setMaterial('soil')}><span className="material-swatch soil" /><span><b>土のう</b><small>安価 / 強度 +6</small></span><strong>¥3</strong></button><button className={`material ${material === 'concrete' ? 'selected' : ''}`} onClick={() => setMaterial('concrete')}><span className="material-swatch concrete" /><span><b>コンクリート</b><small>頑丈 / 強度 +13</small></span><strong>¥8</strong></button><div className="readouts"><div><small>予算</small><b>¥{budget} <i>/ ¥100</i></b></div><div><small>堤防の強度</small><b>{strength} <i>/ 50</i></b></div></div><div className="meter"><span style={{ width: `${Math.min(100, strength * 2)}%` }} /></div><button className="rain-button" disabled={mode !== 'build'} onClick={startRain}><CloudRain size={17} /> 雨を降らせる</button><button className="clear-button" disabled={mode !== 'build'} onClick={reset}>堤防をリセット</button></aside><section className="stage-panel"><div className="stage-toolbar"><span><Droplets size={16} /> RIVER TOWN / LIVE VIEW</span><small>クリックまたはドラッグで配置</small></div><canvas ref={canvasRef} width={W} height={H} onPointerDown={paint} onPointerMove={(e) => e.buttons === 1 && paint(e)} aria-label="堤防建設シミュレーター" /><div className="stage-note"><span>ヒント</span> 強度50以上、10ブロック以上の堤防なら町を守れます。</div>{mode === 'won' && <div className="result success"><ShieldCheck size={22} /><div><strong>町を守りきった！</strong><span>堤防が10秒間、洪水を受け止めました。</span></div><button onClick={reset}>もう一度</button></div>}{mode === 'failed' && <div className="result failure"><Waves size={22} /><div><strong>堤防が決壊しました</strong><span>材料を追加して、もう一度設計してみよう。</span></div><button onClick={reset}>再挑戦</button></div>}</section></div></div></main>
}
