"""Sintetiza los SFX (suaves y cortos) en public/sfx/*.wav"""
import wave, numpy as np
SR = 44100
rng = np.random.default_rng(7)
t = lambda d: np.arange(int(SR * d)) / SR

def save(name, x, peak=0.8):
    x = x / (np.abs(x).max() + 1e-9) * peak
    with wave.open(f"public/sfx/{name}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())

def lp(x, fc):  # paso bajo de un polo
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y

def hp(x, fc): return x - lp(x, fc)

# click: tic de interfaz muy corto
for nm, f in (("click", 2400), ("click2", 1700)):
    tt = t(0.06)
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 140) + 0.5 * hp(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 250)
    save(nm, x * (1 - np.exp(-tt * 3000)), 0.7)

# pop: golpe grave suave
tt = t(0.22); fr = 170 * np.exp(-tt * 14) + 60
save("pop", np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt * 18) * (1 - np.exp(-tt * 2500)), 0.8)

# woosh ligero: ruido con barrido de filtro
d = 0.7; tt = t(d); n = rng.standard_normal(len(tt))
env = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 2.2
fc = 350 + 4200 * np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 1.5
y = np.zeros_like(n); s = 0.0
for i, v in enumerate(n):
    a = np.exp(-2 * np.pi * fc[i] / SR); s = (1 - a) * v + a * s; y[i] = s
save("woosh", hp(y, 250) * env, 0.75)

# campanita premium
tt = t(1.6)
x = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) for f, a, k in
        ((1046.5, 1, 3.2), (1568, 0.55, 4.0), (2093, 0.3, 5.5), (3136, 0.12, 8)))
save("chime", x * (1 - np.exp(-tt * 900)), 0.8)

# glitch breve (ruido escalonado, sin estridencia)
tt = t(0.22); n = rng.standard_normal(len(tt))
step = np.repeat(n[::180], 180)[:len(tt)]
g = (np.sign(step) * 0.5 + 0.5 * n * 0.3) * (np.sin(2 * np.pi * 90 * tt) > -0.2)
save("glitch", lp(g, 5000) * np.exp(-tt * 12), 0.7)
