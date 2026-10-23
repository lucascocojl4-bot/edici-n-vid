"""Corta el vídeo en bruto (se queda con las últimas tomas, sin pausas) y
genera public/clip.mp4 + src/data/captions.json con tiempos por palabra.
Uso: python3 scripts/montaje.py <video_bruto> <carpeta_trabajo>"""
import json, re, subprocess, sys, wave
import numpy as np

SRC, WORK = sys.argv[1], sys.argv[2]
FPS = 30

# (inicio, fin, texto) en segundos del vídeo en bruto: solo las tomas finales.
SEGS = [
    (8.63, 23.09, "Él es Álvaro Cuello, futbolista profesional, y así fue cómo convertimos su ingreso en una estructura que trabaja y crece sola, mientras él se enfoca en rendir al máximo en el fútbol. Cuando empezamos a trabajar juntos, Álvaro tenía un problema en la dirección de sus ingresos. El dinero"),
    (23.43, 24.08, "entraba,"),
    (24.45, 30.29, "pero no había un sistema que lo hiciera crecer, entonces o se gastaba o se mantenía estancado."),
    (30.76, 33.20, "Lo que hicimos fue ordenar su ahorro mensual en tres partes."),
    (34.26, 36.94, "Una parte la invertimos para construir patrimonio a largo plazo,"),
    (37.86, 43.30, "otra la invertimos para que crezca para objetivos a corto plazo, como cambiar el auto, como hacer cosas en su casa, etcétera."),
    (45.87, 52.41, "Y una tercera parte que le va a dar un piso de estabilidad, que si algo cambia en su carrera, no cambia toda su estructura financiera ni su calidad de vida."),
    (58.64, 62.23, "Hoy Álvaro tiene una estructura que trabaja en paralelo"),
    (63.17, 64.85, "y que está creciendo para su futuro."),
    (70.81, 75.65, "Así que si no tenés una estructura clara para que tu dinero crezca en paralelo,"),
    (76.35, 80.33, "Comenta acá abajo la palabra Álvaro y te mando una clase sobre cómo lo hicimos con él."),
]
PRE, POST = 0.07, 0.10  # holgura dentro del silencio

def syl(w):
    n = 0
    for x in re.findall(r"[aeiouáéíóúü]+", w.lower()):
        n += 1 + len(re.findall(r"(?<=[aeoáéó])(?=[aeoáéó])", x))
    return max(n, 1)

L = np.load(f"{WORK}/L.npy")  # banda 300-3000 Hz en dB, 100 cuadros/s

def snap(t, r=0.12):
    a, b = int((t - r) * 100), int((t + r) * 100)
    return (a + int(np.argmin(L[a:b]))) / 100

def nuclei(a, b):
    s = L[int(a * 100):int(b * 100)]
    out, last = [], -99
    for i in range(3, len(s) - 3):
        if s[i] == s[i - 3:i + 4].max():
            lo2 = max(s[max(0, i - 15):i].min(), s[i + 1:i + 16].min())
            if s[i] - lo2 > 2 and i - last >= 8:
                out.append(a + i / 100); last = i
    return np.array(out)

segs, t_final, words_out = [], 0.0, []
for i, (a, b, text) in enumerate(SEGS):
    a2 = round((a - PRE) * FPS) / FPS
    b2 = round((b + POST) * FPS) / FPS
    dur = b2 - a2
    toks = text.split()
    sy = [syl(t) for t in toks]
    nuc = nuclei(a, b)
    n = sum(sy)
    print(f"seg{i}: {a}-{b} palabras={len(toks)} sílabas={n} núcleos={len(nuc)}")
    # sílaba k -> instante de su núcleo (interpolando por cuantiles)
    pos = lambda k: np.interp((k + 0.5) / n * len(nuc) - 0.5, np.arange(len(nuc)), nuc)
    k = 0
    for tok, s in zip(toks, sy):
        t0 = pos(k) - 0.10 if k else a
        t1 = pos(k + s - 1) + 0.14
        words_out.append({"text": tok, "start": t0 - a2 + t_final, "end": min(t1, b + 0.05) - a2 + t_final, "seg": i})
        k += s
    segs.append({"src": [a2, b2], "start": t_final, "dur": dur})
    t_final += dur

# evita solapes
for p, q in zip(words_out, words_out[1:]):
    if p["end"] > q["start"]: p["end"] = q["start"]
json.dump({"segments": segs, "words": words_out, "duration": t_final},
          open("src/data/captions.json", "w"), ensure_ascii=False, indent=1)

# ffmpeg: concat con fundidos de audio de 15 ms
fc, ins = [], ""
for i, s in enumerate(segs):
    a, b = s["src"]
    fc.append(f"[0:v]trim={a:.4f}:{b:.4f},setpts=PTS-STARTPTS,fps={FPS}[v{i}]")
    fc.append(f"[0:a]atrim={a:.4f}:{b:.4f},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st={b-a-0.015:.4f}:d=0.015[a{i}]")
    ins += f"[v{i}][a{i}]"
fc.append(f"{ins}concat=n={len(segs)}:v=1:a=1[v][a]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-filter_complex", ";".join(fc),
                "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "14", "-preset", "medium",
                "-pix_fmt", "yuv420p", "-g", "30", "-c:a", "aac", "-b:a", "192k", "public/clip.mp4"], check=True)
print("duración final", round(t_final, 2))
