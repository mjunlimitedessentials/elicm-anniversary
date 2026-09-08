#!/usr/bin/env python3
"""Lint a Facebook ad pack markdown file before delivering it.

Usage: python3 check_pack.py path/to/ad-pack.md

Checks the things graders and media buyers keep catching:
  - bracket tokens used in the body that are not declared in the find-and-replace table
  - editor notes left inside copy blocks ("delete if", "edit to", "check ≤")
  - headlines over 40 chars and descriptions over 30 chars (tokens counted as 8 chars)
  - second-person personal-attribute phrasing Meta rejects (any field, incl. video lines)
  - two primary texts that open with the same sentence
  - copy that says "Tap Sign Up" under a "Learn More" button (verb/button mismatch)
  - weekday names that don't match the date next to them
Exit code 1 if anything is found. Fix, re-run, deliver.
"""
import re, sys, datetime

TOKEN = re.compile(r"\[([A-Z][A-Z0-9 _'/-]{1,40})\]")
ATTR = re.compile(r"\b(your|you're|are you|do you|does your|is your|have you|not in shape|struggling with|suffer(ing)? from)\b[^.\n!?]{0,40}\b(neck|back|knee|weight|body|belly|fat|pain|hurt|anxiety|depress|debt|credit|broke|divorc|single|over \d\d|under \d\d|pregnan|disab|christian|muslim|jewish|catholic|church-goer|religio|age|old|senior|diabet|cancer|illness|condition|sick)\w*", re.I)
NOTE = re.compile(r"\((?:delete|edit|remove|swap|replace|check|update|confirm|if you|only if|use if)[^)]{0,80}\)|←\s*\w+|\(\s*edit to|delete this line|delete if", re.I)
MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec"
DATE = re.compile(rf"\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Tues|Wed|Thu|Thurs|Fri|Sat|Sun)\.?,?\s+({MONTHS})\.?\s+(\d{{1,2}})(?:,?\s+(\d{{4}}))?", re.I)
WD = {"mon":0,"tue":1,"tues":1,"wed":2,"thu":3,"thurs":3,"fri":4,"sat":5,"sun":6}
MN = {m[:3].lower():i+1 for i,m in enumerate("January February March April May June July August September October November December".split())}

def tok_len(s):  # count tokens as 8 chars so limits are judged after replacement
    return len(TOKEN.sub("XXXXXXXX", s))

def field_value(raw):
    """The value on a headline/description line: first backticked segment if any, else the line, minus markdown."""
    raw = raw.strip()
    m = re.search(r"`([^`]+)`", raw)
    v = m.group(1) if m else re.sub(r"^\d+\.\s*", "", raw)
    return v.strip().strip('"*_ ')

def main(path):
    text = open(path, encoding="utf-8").read()
    problems = []
    # 1 tokens
    table_end = text.find("## 1")
    head = text[:table_end] if table_end > 0 else text[:4000]
    declared = {m.group(1).strip() for m in TOKEN.finditer(head) if "|" in head[max(0, m.start()-3):m.start()+len(m.group(0))+3]}
    used = {}
    for m in TOKEN.finditer(text[table_end:] if table_end > 0 else text):
        used.setdefault(m.group(1).strip(), 0); used[m.group(1).strip()] += 1
    stray = sorted(t for t in used if t not in declared)
    for t in stray:
        problems.append(f"TOKEN not in find-and-replace table: [{t}] (used {used[t]}x)")
    if re.search(r"\[(insert|tbd|confirm|x|n|name|link|date|time)\]", text, re.I):
        problems.append("PLACEHOLDER style: found [insert]/[TBD]/[X]/[Name]/[link]-type placeholder; use declared tokens")
    # 2 notes inside fenced copy blocks
    for block in re.findall(r"```[^\n]*\n(.*?)```", text, re.S):
        for n in NOTE.finditer(block):
            problems.append(f"EDITOR NOTE inside copy block: '{n.group(0).strip()[:60]}'")
    # 3 limits
    for m in re.finditer(r"###\s*Headline[^\n]*\n+([^\n#]+)", text):
        v = field_value(m.group(1))
        if v.startswith("(") : continue
        if v and tok_len(v) > 40: problems.append(f"HEADLINE >40 chars ({tok_len(v)}): {v}")
    for m in re.finditer(r"###\s*Description[^\n]*\n+([^\n#]+)", text):
        v = field_value(m.group(1))
        if v.startswith("("): continue
        if v and tok_len(v) > 30 and not v.lower().startswith(("none","(none","leave")):
            problems.append(f"DESCRIPTION >30 chars ({tok_len(v)}): {v}")
    # 4 personal attributes, every line
    for i, line in enumerate(text.splitlines(), 1):
        low = line.lower()
        if any(k in low for k in ("policy", "never", "nothing in", "avoid", "don't say", "do not say", "no second-person", "rejected", "→", "anywhere")): continue
        if ATTR.search(line):
            problems.append(f"PERSONAL-ATTRIBUTE phrasing line {i}: {line.strip()[:90]}")
    # 5 duplicate openers
    openers = {}
    for m in re.finditer(r"###\s*Primary text[^\n]*\n+```[^\n]*\n(.*?)```", text, re.S):
        first = re.split(r"(?<=[.!?])\s", m.group(1).strip(), 1)[0].strip().lower()
        if len(first) > 12: openers.setdefault(first, 0); openers[first] += 1
    for o, c in openers.items():
        if c > 1: problems.append(f"DUPLICATE OPENER used {c}x: '{o[:70]}'")
    # 6 CTA verb vs button
    for sec in re.split(r"\n## ", text):
        b = re.search(r"###\s*CTA button[^\n]*\n+([^\n]+)", sec)
        if not b: continue
        button = b.group(1).strip().lower()
        said = re.findall(r"tap\s+(sign up|learn more|shop now|book now|get offer|download|send message|register)", sec, re.I)
        for s in said:
            if s.lower() not in button:
                problems.append(f"CTA MISMATCH: copy says 'Tap {s}' but button is '{b.group(1).strip()}'")
    # 7 weekdays
    for m in DATE.finditer(text):
        wd, mon, day, yr = m.groups(); yr = int(yr) if yr else datetime.date.today().year
        try:
            d = datetime.date(yr, MN[mon[:3].lower()], int(day))
        except Exception: continue
        if d.weekday() != WD[wd.lower()[:4] if wd.lower()[:4] in WD else wd.lower()[:3]]:
            problems.append(f"WEEKDAY WRONG: '{m.group(0)}' is actually a {d.strftime('%A')}")
    if problems:
        print(f"{len(problems)} problem(s) in {path}:")
        for p in problems: print("  -", p)
        return 1
    print(f"OK: {path} passed all checks"); return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
