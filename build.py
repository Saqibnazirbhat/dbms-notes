import base64, os, re, sys, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
FONTS = os.path.join(HERE, 'fonts')
OUT = os.path.join(HERE, 'index.html')

order = ['head.html', 'nav.js'] + \
        [f for f in ('w%d.js' % i for i in range(1, 9)) if os.path.exists(os.path.join(SRC, f))] + \
        ['tail.js']
parts = []
for f in order:
    parts.append(open(os.path.join(SRC, f), encoding='utf-8').read())
html = '\n'.join(parts)

fontmap = {
    '__FONT_ROMAN__': 'et-book-roman-line-figures.woff',
    '__FONT_ITALIC__': 'et-book-display-italic-old-style-figures.woff',
    '__FONT_BOLD__': 'et-book-bold-line-figures.woff',
}
for token, fn in fontmap.items():
    b64 = base64.b64encode(open(os.path.join(FONTS, fn), 'rb').read()).decode('ascii')
    html = html.replace(token, 'data:font/woff;base64,' + b64)
for t in fontmap:
    if t in html:
        sys.exit('ERROR: unreplaced font token ' + t)

# entity-escape non-ASCII outside <style>/<script>; those regions must already be ASCII
def regions(s):
    out, pos = [], 0
    for m in re.finditer(r'<(style|script)\b[^>]*>.*?</\1>', s, re.S):
        if m.start() > pos:
            out.append(('h', s[pos:m.start()]))
        out.append((m.group(1), m.group(0)))
        pos = m.end()
    out.append(('h', s[pos:]))
    return out

reb = []
for kind, chunk in regions(html):
    if kind == 'style':
        bad = sorted({c for c in chunk if ord(c) >= 128})
        if bad:
            sys.exit('ERROR: non-ASCII in <style>: %r (use CSS \\XXXX)' % bad)
        reb.append(chunk)
    elif kind == 'script':
        reb.append(''.join(c if ord(c) < 128 else '\\u%04x' % ord(c) for c in chunk))
    else:
        reb.append(''.join(c if ord(c) < 128 else '&#%d;' % ord(c) for c in chunk))
html = ''.join(reb)
if any(ord(c) >= 128 for c in html):
    sys.exit('ERROR: non-ASCII survived')

# The chapters carry their own <title>; lift it into <head> for the standalone page
# and strip it from the body, so the document is valid and tabs are labelled.
m = re.search(r'<title>(.*?)</title>\s*', html, re.S)
title = m.group(1).strip() if m else 'DBMS Notes'
body = html[:m.start()] + html[m.end():] if m else html

STANDALONE = (
    '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
    '<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    '<title>' + title + '</title>\n'
    '<style>*{margin:0;padding:0}</style>\n'
    '</head>\n<body>\n' + body + '\n</body>\n</html>\n')

# index.html: a complete, self-contained page. Works from disk and on GitHub Pages.
open(OUT, 'w', encoding='ascii').write(STANDALONE)
# artifact.html: the same content as a fragment, for hosts that supply their own
# <head> and <body> wrapper.
open(os.path.join(HERE, 'artifact.html'), 'w', encoding='ascii').write(html)

print('built %s  %s  (%.0f KB)' % (OUT, ', '.join(order), os.path.getsize(OUT) / 1024))

# balance check on the markup regions
for tag in ('section', 'figure', 'div', 'dl', 'article', 'pre', 'table'):
    o = len(re.findall(r'<%s[ >]' % tag, html))
    c = len(re.findall(r'</%s>' % tag, html))
    if o != c:
        print('  WARN <%s> open=%d close=%d' % (tag, o, c))
