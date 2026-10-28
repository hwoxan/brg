'use client'

import { useMemo, useState } from 'react'
import { Check, Clipboard, Code2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const initialColors = ['#00A1FB', '#01FD75', '#8B5CF6', '#F97316', '#EC4899']

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[character]
  })
}

function isHexColor(value: string) {
  return /^#[\da-f]{6}$/i.test(value)
}

export function RgbGenerator() {
  const [colors, setColors] = useState(initialColors)
  const [colorCount, setColorCount] = useState(2)
  const [text, setText] = useState('NET FREE')
  const [format, setFormat] = useState<'html' | 'css'>('html')
  const [alternateBackground, setAlternateBackground] = useState(false)
  const [copied, setCopied] = useState(false)

  const safeColors = colors.slice(0, colorCount).map((color) =>
    isHexColor(color) ? color : '#000000',
  )
  const gradient = `linear-gradient(90deg, ${safeColors.join(', ')})`
  const generatedCode = useMemo(() => {
    const css = `.rgb-text {\n  background: ${gradient};\n  background-clip: text;\n  color: transparent;\n  font-weight: 700;\n}`

    if (format === 'css') return css

    return `<span class="rgb-text">${escapeHtml(text || 'Seu texto')}</span>\n\n<style>\n${css}\n</style>`
  }, [format, gradient, text])

  function updateColor(index: number, value: string) {
    setColors((current) => current.map((color, colorIndex) => (colorIndex === index ? value : color)))
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Banner RGB, início">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Code2 aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight">BANNER RGB</span>
        </a>
        <span className="rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          FERRAMENTA GRATUITA
        </span>
      </header>

      <main id="inicio" className="mx-auto w-full max-w-6xl px-5 pb-10 pt-7 sm:px-8 sm:pt-12">
        <section className="mx-auto mb-9 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles aria-hidden="true" className="size-3.5 text-primary" />
            Gerador de texto RGB · V1.0
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">BANNER RGB GENERATOR</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Crie textos com gradiente colorido e copie o código pronto para usar no seu site.
          </p>
        </section>

        <section className="overflow-hidden rounded-xl border bg-card shadow-sm" aria-label="Gerador de banner RGB">
          <div className="grid lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="border-b p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="mb-6">
                <h2 className="text-base font-semibold">Personalize seu texto</h2>
                <p className="mt-1 text-sm text-muted-foreground">Escolha as cores e o conteúdo.</p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="rgb-text" className="text-sm font-medium">Texto do banner</label>
                  <input
                    id="rgb-text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Digite seu texto"
                    maxLength={60}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="color-count" className="text-sm font-medium">Quantidade de cores</label>
                  <select
                    id="color-count"
                    value={colorCount}
                    onChange={(event) => setColorCount(Number(event.target.value))}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                  >
                    {[2, 3, 4, 5].map((count) => <option key={count} value={count}>{count} cores</option>)}
                  </select>
                </div>

                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-1 text-sm font-medium">Paleta de cores</legend>
                  {colors.slice(0, colorCount).map((color, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <label htmlFor={`color-picker-${index}`} className="sr-only">Selecionar cor {index + 1}</label>
                      <input
                        id={`color-picker-${index}`}
                        type="color"
                        value={isHexColor(color) ? color : '#000000'}
                        onChange={(event) => updateColor(index, event.target.value.toUpperCase())}
                        className="size-10 cursor-pointer rounded-md border border-input bg-background p-1"
                      />
                      <label htmlFor={`color-value-${index}`} className="sr-only">Código hexadecimal da cor {index + 1}</label>
                      <input
                        id={`color-value-${index}`}
                        value={color}
                        onChange={(event) => updateColor(index, event.target.value.toUpperCase())}
                        maxLength={7}
                        spellCheck={false}
                        className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 font-mono text-sm uppercase shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                      />
                    </div>
                  ))}
                </fieldset>

                <div className="flex flex-col gap-2">
                  <label htmlFor="code-format" className="text-sm font-medium">Formato do código</label>
                  <select
                    id="code-format"
                    value={format}
                    onChange={(event) => setFormat(event.target.value as 'html' | 'css')}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                  >
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                  </select>
                </div>

                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={alternateBackground}
                    onChange={(event) => setAlternateBackground(event.target.checked)}
                    className="size-4 rounded border-input accent-primary focus-visible:ring-3 focus-visible:ring-ring/30"
                  />
                  Ver com outro fundo
                </label>
              </div>
            </aside>

            <div className="flex min-w-0 flex-col gap-6 p-5 sm:p-7">
              <section aria-labelledby="preview-heading">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 id="preview-heading" className="text-sm font-semibold">Prévia ao vivo</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Assim seu texto será exibido.</p>
                  </div>
                  <span className="rounded-md border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">{colorCount} cores</span>
                </div>
                <div className={`flex min-h-48 items-center justify-center overflow-hidden rounded-lg border p-6 transition-colors ${alternateBackground ? 'bg-[linear-gradient(45deg,var(--muted)_25%,transparent_25%,transparent_75%,var(--muted)_75%),linear-gradient(45deg,var(--muted)_25%,transparent_25%,transparent_75%,var(--muted)_75%)] bg-[length:18px_18px] bg-[position:0_0,9px_9px]' : 'bg-background'}`}>
                  <span
                    className="max-w-full break-words text-center text-3xl font-bold tracking-tight sm:text-5xl"
                    style={{ backgroundImage: gradient, backgroundClip: 'text', color: 'transparent', WebkitBackgroundClip: 'text' }}
                  >
                    {text || 'Seu texto'}
                  </span>
                </div>
              </section>

              <section aria-labelledby="code-heading">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 id="code-heading" className="text-sm font-semibold">Código gerado</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Pronto para copiar e colar no seu projeto.</p>
                  </div>
                  <Button type="button" size="sm" onClick={copyCode} aria-label={copied ? 'Código copiado' : 'Copiar código'}>
                    {copied ? <Check data-icon="inline-start" /> : <Clipboard data-icon="inline-start" />}
                    {copied ? 'Copiado' : 'Copiar código'}
                  </Button>
                </div>
                <textarea
                  aria-label={`${format.toUpperCase()} gerado`}
                  readOnly
                  value={generatedCode}
                  spellCheck={false}
                  className="min-h-48 w-full resize-y rounded-lg border bg-muted/50 p-4 font-mono text-xs leading-6 text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/30 sm:text-sm"
                />
                <p className="sr-only" aria-live="polite">{copied ? 'Código copiado para a área de transferência.' : ''}</p>
              </section>
            </div>
          </div>
        </section>

        <footer className="mt-6 text-center text-xs text-muted-foreground">
          Feito para facilitar seus banners <span aria-hidden="true">·</span> <span className="font-medium text-foreground">RGB V1.0</span>
        </footer>
      </main>
    </div>
  )
}
