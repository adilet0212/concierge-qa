# Mock rounds

Three timed rounds that feel like the real thing: a video call where **you share your screen**,
read unfamiliar code, and think out loud while you find and fix bugs.

Each round has three exercises of rising difficulty (●○○, ●●○, ●●●) and takes about 20 minutes.
**Do not open the round folders before you start the round.** The point is that the code is new to you.

## Set up like a real screen share
- Close chat apps and notifications; share one window (your editor), not the whole desktop.
- Increase the editor font size (Ctrl/Cmd + `+`) so it is readable on a small video tile.
- Open a terminal panel in the editor so you can run the test without switching windows.
- Start a 20-minute timer. If you can, record yourself (or ask a friend to watch).

## During the round
Follow the 7 steps in [HOW_TO_DEBUG_IN_INTERVIEW.md](../HOW_TO_DEBUG_IN_INTERVIEW.md) out loud:
restate the intent → read → trace with an example → edge cases → root cause → fix + how you'd test → anything else.

Suggested time split: 5 minutes, 7 minutes, 8 minutes. Read the exercise README first, then the
code, and only run the test after you've said what you think is wrong:

```bash
npm run bug-hunt -- r1-a
```

## After the round
Check [ANSWERS.md](../ANSWERS.md) (section "Mock rounds"). Score yourself on:
1. Did I restate what the code should do before diving in?
2. Did I trace a real input out loud?
3. Did I name the **root cause** (not just the symptom)?
4. Did I say how I'd test the fix?
5. Did I keep talking when I was unsure?

| Round | Folder |
|---|---|
| 1 | [round-1](round-1/README.md) |
| 2 | [round-2](round-2/README.md) |
| 3 | [round-3](round-3/README.md) |
