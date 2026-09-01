'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  FlaskConical,
  RotateCcw,
  Sparkles,
  Waves,
} from 'lucide-react'

type Step = 'entry' | 'choice' | 'lab' | 'quiz' | 'result'
type Liquid = 'lemon' | 'soap' | 'fizz'

const subjects = ['数学', '物理', '生物', '化学']

const liquids: {
  id: Liquid
  label: string
  note: string
  color: string
}[] = [
  { id: 'lemon', label: 'レモン汁', note: 'B1 / 酸性', color: '#e6495f' },
  { id: 'soap', label: '石鹸水', note: 'B2 / アルカリ性', color: '#9bd03f' },
  {
    id: 'fizz',
    label: '重曹＋クエン酸',
    note: 'B3 / シュワシュワ',
    color: '#f1c453',
  },
]

export default function Page() {
  const [step, setStep] = useState<Step>('entry')
  const [selected, setSelected] = useState<Liquid | null>(null)
  const [mixed, setMixed] = useState(false)
  const [answered, setAnswered] = useState(false)

  const reset = () => {
    setStep('entry')
    setSelected(null)
    setMixed(false)
    setAnswered(false)
  }

  const mix = (liquid: Liquid) => {
    setSelected(liquid)
    setMixed(true)
  }

  const currentStep = ['entry', 'choice', 'lab', 'quiz', 'result'].indexOf(step)

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f4f7f3;
          color: #18312b;
          font-family: Arial, 'Hiragino Kaku Gothic ProN', 'Yu Gothic',
            sans-serif;
        }

        button {
          font: inherit;
        }

        .beaker {
          position: relative;
          width: 150px;
          height: 190px;
          overflow: hidden;
          border: 5px solid #18312b;
          border-top: 0;
          border-radius: 8px 8px 28px 28px;
          background: rgb(255 255 255 / 72%);
          transform: perspective(400px) rotateX(-2deg);
        }

        .beaker::before {
          position: absolute;
          z-index: 2;
          top: -9px;
          right: -14px;
          left: -14px;
          height: 14px;
          border: 5px solid #18312b;
          border-radius: 8px;
          background: white;
          content: '';
        }

        .liquid {
          position: absolute;
          inset: 66px 0 0;
          background: #8b77b8;
          transition: background 600ms ease, inset 600ms ease;
        }

        .beaker-lemon .liquid {
          inset: 45px 0 0;
          background: #e6495f;
        }

        .beaker-soap .liquid {
          inset: 45px 0 0;
          background: #9bd03f;
        }

        .beaker-fizz .liquid {
          inset: 38px 0 0;
          background: #f1c453;
        }

        .beaker-line {
          position: absolute;
          top: 85px;
          right: 20px;
          left: 20px;
          border-top: 2px solid rgb(24 49 43 / 30%);
        }

        .lab-shake {
          animation: shake 500ms ease-in-out;
        }

        .bubbles {
          position: absolute;
          z-index: 3;
          inset: 16% 35%;
        }

        .bubbles i {
          position: absolute;
          bottom: 10%;
          left: calc(var(--i) * 7%);
          width: 13px;
          height: 13px;
          border: 2px solid white;
          border-radius: 999px;
          animation: bubble 1.5s ease-in infinite;
          animation-delay: calc(var(--i) * -0.09s);
        }

        @keyframes bubble {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.5);
          }

          35% {
            opacity: 0.9;
          }

          100% {
            opacity: 0;
            transform: translateY(-190px) scale(1.2);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }

          25% {
            transform: translateX(-5px) rotate(-1deg);
          }

          75% {
            transform: translateX(5px) rotate(1deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <main className="min-h-screen bg-[#f4f7f3] text-[#18312b]">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-10">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#18312b] p-2 text-[#e5f36b]">
              <FlaskConical size={20} />
            </div>
            <span className="font-mono text-sm font-bold tracking-widest">
              LAB NOTE / 01
            </span>
          </div>

          <button
            onClick={reset}
            className="flex items-center gap-2 text-sm text-[#557069] hover:text-[#18312b]"
          >
            <RotateCcw size={16} />
            最初から
          </button>
        </header>

        <div className="mx-auto max-w-6xl px-5 pb-14 md:px-10">
          <div className="mb-8 flex items-center gap-2 text-xs font-bold tracking-wider text-[#78918a]">
            {['ENTRY', 'CHOOSE', 'EXPERIMENT', 'QUIZ'].map((label, index) => (
              <span
                key={label}
                className={index <= currentStep ? 'text-[#18312b]' : ''}
              >
                {index > 0 && (
                  <span className="mx-2 text-[#c9d5d0]">/</span>
                )}
                {label}
              </span>
            ))}
          </div>

          {step === 'entry' && (
            <section className="animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="max-w-3xl py-10 md:py-20">
                <p className="mb-5 font-mono text-sm font-bold text-[#de5962]">
                  HAND-ON LEARNING STUDIO
                </p>

                <h1 className="text-balance text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
                  身近なふしぎを、
                  <br />
                  <span className="text-[#de5962]">手で解き明かす。</span>
                </h1>

                <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-[#557069]">
                  操作して、変化を見て、考えてみよう。中学の学びと未来の仕事がつながる体験型ラボ。
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {subjects.map((subject, index) => (
                  <button
                    key={subject}
                    onClick={() =>
                      subject === '化学' && setStep('choice')
                    }
                    className={`group flex min-h-36 flex-col justify-between rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-lg ${
                      subject === '化学'
                        ? 'border-[#18312b] bg-[#18312b] text-white'
                        : 'border-[#d6e1dc] bg-white text-[#78918a]'
                    }`}
                  >
                    <span className="font-mono text-xs">
                      0{index + 1}
                    </span>

                    <span className="flex items-center justify-between text-2xl font-bold">
                      {subject}
                      <ChevronRight
                        className="opacity-50 transition group-hover:translate-x-1"
                        size={22}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 'choice' && (
            <section className="mx-auto max-w-3xl py-12 md:py-20">
              <button
                onClick={() => setStep('entry')}
                className="mb-12 flex items-center gap-2 text-sm text-[#557069]"
              >
                <ArrowLeft size={16} />
                分野選択に戻る
              </button>

              <p className="font-mono text-sm font-bold text-[#de5962]">
                CHEMISTRY / 物質の変化
              </p>

              <h2 className="mt-4 text-4xl font-black md:text-6xl">
                具体的に、
                <br />
                どちらを試したい？
              </h2>

              <button
                onClick={() => setStep('lab')}
                className="mt-12 flex w-full items-center justify-between rounded-2xl bg-[#e5f36b] p-6 text-left shadow-sm transition hover:shadow-lg"
              >
                <span>
                  <span className="mb-2 block font-mono text-xs font-bold">
                    EXPERIMENT 01
                  </span>
                  <strong className="text-xl md:text-2xl">
                    A液とB液を混ぜろ！
                  </strong>
                  <span className="mt-2 block text-sm text-[#557069]">
                    「色変わり」＆「モコモコ泡」実験室
                  </span>
                </span>

                <ChevronRight size={28} />
              </button>
            </section>
          )}

          {step === 'lab' && (
            <section className="py-8">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-sm font-bold text-[#de5962]">
                    EXPERIMENT 01 / MIXING LAB
                  </p>

                  <h2 className="mt-3 text-4xl font-black md:text-5xl">
                    A液とB液を混ぜろ！
                  </h2>

                  <p className="mt-3 text-[#557069]">
                    棚から液体をつかんで、ビーカーへ。最後にぐるぐる混ぜよう。
                  </p>
                </div>

                {mixed && (
                  <span className="rounded-full bg-[#e5f36b] px-4 py-2 text-sm font-bold">
                    変化を観察中
                  </span>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                <div className="rounded-3xl bg-[#dce9e3] p-6">
                  <p className="mb-5 font-mono text-xs font-bold text-[#557069]">
                    SHELF / B LIQUIDS
                  </p>

                  <div className="grid gap-3">
                    {liquids.map((liquid) => (
                      <button
                        key={liquid.id}
                        onClick={() => mix(liquid.id)}
                        className="flex items-center gap-4 rounded-2xl bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <span
                          className="h-12 w-12 rounded-full border-4 border-white shadow-inner"
                          style={{ backgroundColor: liquid.color }}
                        />

                        <span>
                          <strong className="block">
                            {liquid.label}
                          </strong>
                          <small className="font-mono text-xs text-[#78918a]">
                            {liquid.note}
                          </small>
                        </span>

                        <span className="ml-auto text-xs text-[#78918a]">
                          注ぐ
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className={`relative flex min-h-[390px] items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-[#adc4ba] bg-white ${
                    mixed ? 'lab-shake' : ''
                  }`}
                >
                  <div className="absolute left-6 top-5 font-mono text-xs font-bold text-[#78918a]">
                    BEAKER / A液
                  </div>

                  {mixed && selected === 'fizz' && (
                    <div className="bubbles" aria-hidden="true">
                      {Array.from({ length: 15 }).map((_, index) => (
                        <i
                          key={index}
                          style={
                            {
                              '--i': index,
                            } as React.CSSProperties
                          }
                        />
                      ))}
                    </div>
                  )}

                  <div
                    className={`beaker ${
                      mixed ? `beaker-${selected}` : ''
                    }`}
                  >
                    <div className="liquid" />
                    <div className="beaker-line" />
                  </div>

                  <div className="absolute bottom-6 text-center text-sm font-bold text-[#557069]">
                    {!mixed
                      ? '液体を選んでビーカーに注ぐ'
                      : selected === 'lemon'
                        ? '鮮やかな赤色に変化！'
                        : selected === 'soap'
                          ? '怪しい緑色に変化！'
                          : 'シュワシュワ泡が溢れ出す！'}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl bg-[#18312b] p-5 text-center text-white md:flex-row md:justify-between md:text-left">
                <span className="flex items-center gap-3 text-sm">
                  <Waves className="text-[#e5f36b]" size={20} />
                  指で画面をぐるぐるなぞって、混ぜ合わせよう
                </span>

                <button
                  disabled={!mixed}
                  onClick={() => setStep('quiz')}
                  className="rounded-xl bg-[#e5f36b] px-5 py-3 font-bold text-[#18312b] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  実験終了 → 問題へ
                </button>
              </div>
            </section>
          )}

          {step === 'quiz' && (
            <section className="mx-auto max-w-3xl py-12 md:py-20">
              <p className="font-mono text-sm font-bold text-[#de5962]">
                CONNECT THE DOTS / SCIENCE × WORK
              </p>

              <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
                レモン汁は「何性」の
                <br />
                性質を持っているでしょう？
              </h2>

              <div className="mt-10 grid gap-3">
                {['酸性', 'アルカリ性', '中性'].map((answer, index) => (
                  <button
                    key={answer}
                    disabled={answered}
                    onClick={() => {
                      setAnswered(true)
                      setStep('result')
                    }}
                    className="flex items-center gap-4 rounded-2xl border border-[#d6e1dc] bg-white p-5 text-left text-lg font-bold transition hover:border-[#18312b] hover:bg-[#f0f6a8]"
                  >
                    <span className="font-mono text-sm text-[#de5962]">
                      （{['ア', 'イ', 'ウ'][index]}）
                    </span>
                    {answer}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 'result' && (
            <section className="mx-auto max-w-3xl py-12 md:py-20">
              <div className="mb-8 flex items-center gap-3 font-bold text-[#4d8b51]">
                <span className="rounded-full bg-[#d9efcf] p-2">
                  <Check size={20} />
                </span>
                正解！
              </div>

              <h2 className="text-4xl font-black md:text-6xl">
                答えは（ア）の
                <br />
                <span className="text-[#de5962]">酸性</span>！
              </h2>

              <div className="mt-10 rounded-3xl bg-[#e5f36b] p-6 text-base leading-8 md:p-8">
                <p className="mb-3 flex items-center gap-2 font-bold">
                  <Sparkles size={18} />
                  ここが社会（仕事）に繋がる！
                </p>

                紫キャベツの汁は、酸性のものを混ぜると「赤色」に、アルカリ性（石鹸水など）を混ぜると「緑色や黄色」に変わる魔法のインジケーター（指示薬）なんだ。コスメの開発者は、この仕組みを使って「肌に優しいシャンプー（弱酸性）」などを作っているんだよ！
              </div>

              <button
                onClick={reset}
                className="mt-8 flex items-center gap-2 rounded-xl bg-[#18312b] px-5 py-3 font-bold text-white"
              >
                もう一度体験する
                <RotateCcw size={16} />
              </button>
            </section>
          )}
        </div>
      </main>
    </>
  )
}
