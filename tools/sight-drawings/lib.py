"""Small helper for hand-built line drawings (800x600, currentColor)."""
import math, os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","..","public","assets","sights")
HEAD=('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">'
      '<style>:root{color:#0a1826}@media (prefers-color-scheme:dark){:root{color:#f4efe1}}</style>')
W1, W2, W3, W4 = 4.5, 2.6, 1.6, 1   # outline, structure, detail, texture
def f(v): return f"{v:.1f}".rstrip("0").rstrip(".")
class D:
    def __init__(s): s.layers={'back':{},'front':{}}; s.order=['back','front']; s.occs={'back':[],'front':[]}; s.layer='front'
    def new_layer(s, name):
        """Add a depth layer in front of all existing ones (it hides everything drawn earlier)."""
        s.layers[name]={}; s.order.append(name); s.occs[name]=[]; s.layer=name
    @property
    def occ(s): return s.occs['front']
    def path(s, d, w=W2): s.layers[s.layer].setdefault(w,[]).append(d)
    def occlude(s, d): s.occs[s.layer].append(d)   # hides every layer drawn before this one
    def occ_poly(s, pts):
        s.occs[s.layer].append('M'+'L'.join(f'{f(x)} {f(y)}' for x,y in pts)+'Z')
    def occ_circle(s,cx,cy,r,ry=None):
        ry=ry or r
        s.occs[s.layer].append(f'M{f(cx-r)} {f(cy)}a{f(r)} {f(ry)} 0 1 0 {f(2*r)} 0a{f(r)} {f(ry)} 0 1 0 {f(-2*r)} 0Z')
    def line(s, x1,y1,x2,y2, w=W2): s.path(f"M{f(x1)} {f(y1)}L{f(x2)} {f(y2)}", w)
    def poly(s, pts, w=W2, close=False):
        d="M"+"L".join(f"{f(x)} {f(y)}" for x,y in pts)+("Z" if close else ""); s.path(d,w)
    def rect(s,x,y,wd,h,w=W2): s.poly([(x,y),(x+wd,y),(x+wd,y+h),(x,y+h)],w,True)
    def arch(s,x,y,wd,h,w=W2,closed=False):
        """Round-headed opening, bottom-left (x,y), width wd, total height h."""
        r=wd/2; d=f"M{f(x)} {f(y)}V{f(y-h+r)}A{f(r)} {f(r)} 0 0 1 {f(x+wd)} {f(y-h+r)}V{f(y)}"
        if closed: d+="Z"
        s.path(d,w)
    def circle(s,cx,cy,r,w=W2): s.path(f"M{f(cx-r)} {f(cy)}a{f(r)} {f(r)} 0 1 0 {f(2*r)} 0a{f(r)} {f(r)} 0 1 0 {f(-2*r)} 0",w)
    def hatch(s, x0,y0,x1,y1, gap=9, w=W3, angle=45, clip=None):
        """Diagonal hatching inside a box; clip(x,y)->bool keeps points inside a shape."""
        a=math.radians(angle); dx,dy=math.cos(a),-math.sin(a)
        L=abs(x1-x0)+abs(y1-y0); k=-L
        while k<L:
            # line through (x0+k, y1) in direction (dx,dy); sample and keep inside segments
            px,py=x0+k,y1; seg=[]; t=0
            while t<2*L:
                x,y=px+dx*t,py+dy*t
                ok=x0<=x<=x1 and y0<=y<=y1 and (clip is None or clip(x,y))
                if ok: seg.append((x,y))
                elif len(seg)>1: s.line(*seg[0],*seg[-1],w); seg=[]
                else: seg=[]
                t+=2
            if len(seg)>1: s.line(*seg[0],*seg[-1],w)
            k+=gap
    def cloud(s,x,y,sc=1.0):
        s.path(f"M{f(x)} {f(y)}q{f(8*sc)} {f(-22*sc)} {f(30*sc)} {f(-14*sc)}q{f(12*sc)} {f(-24*sc)} {f(38*sc)} {f(-10*sc)}"
               f"q{f(26*sc)} {f(-6*sc)} {f(30*sc)} {f(20*sc)}q{f(18*sc)} {f(2*sc)} {f(16*sc)} {f(4*sc)}", W3)
    def bird(s,x,y,sc=1.0):
        s.path(f"M{f(x-9*sc)} {f(y-3*sc)}q{f(5*sc)} {f(-4*sc)} {f(9*sc)} {f(3*sc)}q{f(4*sc)} {f(-7*sc)} {f(9*sc)} {f(-3*sc)}",W3)
    def svg(s):
        """Painter's order with nested masks: everything drawn so far is masked by the next layer's
        occluders, then that layer is drawn on top. Each occluder is written once."""
        defs=[]; content=""
        def strokes(name):
            out=""
            for w in (W1,W2,W3,W4):
                ps=s.layers[name].get(w)
                if ps: out+=f'<g fill="none" stroke="currentColor" stroke-width="{f(w)}" stroke-linecap="round" stroke-linejoin="round"><path d="{"".join(ps)}"/></g>'
            return out
        for i,name in enumerate(s.order):
            if i>0 and s.occs[name] and content:
                defs.append(f'<mask id="m{i}" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="600"><rect width="800" height="600" fill="#fff"/>'
                            f'<path d="{"".join(s.occs[name])}" fill="#000" stroke="#000" stroke-width="6"/></mask>')
                content=f'<g mask="url(#m{i})">{content}</g>'
            content+=strokes(name)
        return HEAD+(f"<defs>{''.join(defs)}</defs>" if defs else "")+content+"</svg>"

def tree(d, x, base, h, r, w=W2, bumps=7):
    """Leafy tree: bumpy round canopy on a short trunk; base is ground y. Hides the back layer."""
    cy=base-h; seg=[]
    for i in range(bumps):
        a0=math.pi*0.75+i*(1.5*math.pi)/bumps; a1=a0+(1.5*math.pi)/bumps
        x0,y0=x+r*math.cos(a0),cy+r*0.9*math.sin(a0); x1,y1=x+r*math.cos(a1),cy+r*0.9*math.sin(a1)
        if i==0: seg.append(f"M{f(x0)} {f(y0)}")
        br=r*0.42; seg.append(f"A{f(br)} {f(br)} 0 0 1 {f(x1)} {f(y1)}")
    d.path("".join(seg),w)
    d.path(f"M{f(x-r*0.25)} {f(cy+r*0.75)}L{f(x-3)} {f(base)}M{f(x+r*0.25)} {f(cy+r*0.75)}L{f(x+3)} {f(base)}",w)
    d.path(f"M{f(x)} {f(cy+r*0.8)}l{f(-r*0.3)} {f(-r*0.35)}M{f(x)} {f(cy+r*0.9)}l{f(r*0.32)} {f(-r*0.3)}",W3)
    d.occ_circle(x,cy,r*1.12,r*1.0); d.occ_poly([(x-r*0.3,cy+r*0.7),(x+r*0.3,cy+r*0.7),(x+4,base),(x-4,base)])
def pine(d, x, base, h, r):
    """Italian stone pine: tall bare trunk, flat umbrella crown."""
    cy=base-h
    d.path(f"M{f(x-3)} {f(base)}C{f(x-4)} {f(base-h*0.4)} {f(x+6)} {f(base-h*0.7)} {f(x+2)} {f(cy+8)}"
           f"M{f(x+5)} {f(base)}C{f(x+4)} {f(base-h*0.4)} {f(x+12)} {f(base-h*0.7)} {f(x+8)} {f(cy+8)}",W2)
    d.path(f"M{f(x+4)} {f(cy+10)}l{f(-r*0.5)} {f(-6)}M{f(x+6)} {f(cy+10)}l{f(r*0.45)} {f(-5)}",W3)
    s=[f"M{f(x-r)} {f(cy+6)}"]; n=6
    for i in range(n):
        x1=x-r+(i+1)*2*r/n; s.append(f"Q{f(x-r+(i+0.5)*2*r/n)} {f(cy-14-6*(1 if i in (2,3) else 0))} {f(x1)} {f(cy+(-2 if i<n-1 else 6))}")
    s.append(f"Q{f(x)} {f(cy+16)} {f(x-r)} {f(cy+6)}"); d.path("".join(s),W2)
    d.occ_circle(x+4,cy,r*1.05,18); d.occ_poly([(x-4,base),(x-2,cy),(x+12,cy),(x+8,base)])

def inside(poly):
    """Point-in-polygon test, for hatch clipping."""
    def f_(x,y):
        c=False; n=len(poly)
        for i in range(n):
            x1,y1=poly[i]; x2,y2=poly[(i+1)%n]
            if (y1>y)!=(y2>y) and x<(x2-x1)*(y-y1)/(y2-y1+1e-9)+x1: c=not c
        return c
    return f_
def hatch_poly(d, poly, gap=6, w=None, angle=45):
    xs=[p[0] for p in poly]; ys=[p[1] for p in poly]
    d.hatch(min(xs),min(ys),max(xs),max(ys),gap=gap,w=w or W4,angle=angle,clip=inside(poly))
def water(d, y0, y1, x0=0, x1=800, seed=1, density=1.0):
    """Horizontal ripple dashes, denser toward the viewer."""
    import random; r=random.Random(seed); y=y0+4; k=0
    while y<y1:
        gapx=int((60-40*(y-y0)/(y1-y0))/density); x=x0+r.randint(0,30)
        while x<x1:
            ln=r.randint(10,34); d.line(x,y,min(x+ln,x1),y,W4); x+=ln+r.randint(gapx//2+6,gapx+14)
        y+=8+(y-y0)*0.04; k+=1
def windows(d, x0, y0, cols, rows, w, h, dx, dy, ww=None, arch=False):
    for c in range(cols):
        for r_ in range(rows):
            x=x0+c*dx; y=y0+r_*dy
            if arch: d.arch(x,y+h,w,h,ww or W4)
            else: d.rect(x,y,w,h,ww or W4)
def reflect(d, segs, axis, squash=0.6, w=None):
    """Mirror line segments [(x1,y1,x2,y2)] below the water line as broken dashes."""
    for x1,y1,x2,y2 in segs:
        ry1=axis+(axis-y1)*squash; ry2=axis+(axis-y2)*squash
        n=max(1,int(abs(ry2-ry1)/10))
        for i in range(0,n,2):
            t0,t1=i/n,(i+1)/n
            d.line(x1+(x2-x1)*t0,ry1+(ry2-ry1)*t0,x1+(x2-x1)*t1,ry1+(ry2-ry1)*t1,w or W4)

def cobbles(d, y0, y1, vx=400, x0=0, x1=800, rows=7):
    """Cobbled pavement in perspective toward a vanishing x; rows get taller toward the viewer."""
    y=y0; k=0; h=6
    while y<y1:
        y2=min(y1,y+h); d.line(x0,y2,x1,y2,W4)
        bw=14+k*5; off=(k%2)*bw/2
        x=x0-off
        while x<x1:
            if x>x0: d.line(x,y,x+(x-vx)*0.04,y2,W4)
            x+=bw
        y=y2; h*=1.35; k+=1

def rubble(d, clip, x0, y0, x1, y1, seed=1, density=1.0, w=None):
    """Irregular stone masonry: short slightly tilted strokes in rough courses inside clip(x,y)."""
    import random; r=random.Random(seed); y=y0+4
    while y<y1:
        x=x0+r.uniform(0,10)
        while x<x1:
            ln=r.uniform(6,14)
            if clip(x,y) and clip(x+ln,y): d.line(x,y+r.uniform(-1,1),x+ln,y+r.uniform(-1.5,1.5),w or W4)
            if r.random()<0.35 and clip(x,y) and clip(x,y+7): d.line(x,y,x+r.uniform(-1,1),y+6,w or W4)
            x+=ln+r.uniform(3,9)/density
        y+=r.uniform(6,9)/density
def bare_tree(d, x, base, h, seed=1, spread=1.0, lean=0.0):
    """Leafless deciduous tree (plane/oak): tapering double-line trunk, curved recursive branches."""
    import random; r=random.Random(seed)
    tw=h*0.05
    top=(x+lean*h*0.2, base-h*0.42)
    d.path(f"M{f(x-tw)} {f(base)}C{f(x-tw*0.8)} {f(base-h*0.2)} {f(top[0]-tw*0.6)} {f(top[1]+h*0.1)} {f(top[0]-tw*0.4)} {f(top[1])}",W2)
    d.path(f"M{f(x+tw)} {f(base)}C{f(x+tw*0.8)} {f(base-h*0.2)} {f(top[0]+tw*0.6)} {f(top[1]+h*0.1)} {f(top[0]+tw*0.4)} {f(top[1])}",W2)
    d.path(f"M{f(x-tw*0.2)} {f(base-h*0.06)}q{f(tw*0.3)} {f(-h*0.1)} 0 {f(-h*0.2)}",W4)   # bark
    def br(x0,y0,ang,ln,depth):
        bend=r.uniform(-0.25,0.25)
        x1=x0+ln*math.cos(ang); y1=y0-ln*math.sin(ang)
        cx_=x0+ln*0.5*math.cos(ang+bend); cy_=y0-ln*0.5*math.sin(ang+bend)
        w=W2 if depth>=4 else W3 if depth>=3 else W4
        d.path(f"M{f(x0)} {f(y0)}Q{f(cx_)} {f(cy_)} {f(x1)} {f(y1)}",w)
        if depth==0: return
        n=2 if depth>2 else 3
        for i in range(n):
            da=(i-(n-1)/2)*0.55*spread+r.uniform(-0.2,0.2)
            br(x1,y1,ang+da,ln*r.uniform(0.6,0.75),depth-1)
    for a in (1.15,1.55,1.95,2.3):
        br(top[0],top[1],a+lean*0.2+r.uniform(-0.1,0.1),h*0.22,5)

def leafy(d, cx, cy, rx, ry, seed=1, w=None):
    """Large leafy crown: lumpy outline made of many small arcs, with interior leaf clusters and shade."""
    import random; r=random.Random(seed); n=int(14+rx/6); pts=[]
    for i in range(n):
        a=2*math.pi*i/n; k=1+r.uniform(-0.1,0.12); pts.append((cx+rx*k*math.cos(a), cy+ry*k*math.sin(a)))
    seg=[f"M{f(pts[0][0])} {f(pts[0][1])}"]
    for i in range(1,n+1):
        x,y=pts[i%n]; bx=rx*0.22; seg.append(f"A{f(bx)} {f(bx)} 0 0 1 {f(x)} {f(y)}")
    d.path("".join(seg),w or W2); d.occ_poly(pts)
    for _ in range(int(rx*ry/180)):
        a=r.uniform(0,2*math.pi); t=r.uniform(0.15,0.85); x=cx+rx*t*math.cos(a); y=cy+ry*t*math.sin(a)
        d.path(f"M{f(x-5)} {f(y)}a5 4 0 0 1 10 0",W4)
    d.hatch(cx,cy-ry*0.2,cx+rx,cy+ry,gap=4,w=W4,angle=70,clip=lambda x,y:((x-cx)/rx)**2+((y-cy)/ry)**2<0.8 and x>cx+rx*0.1)

def save(d, name):
    """Write the drawing to public/assets/sights/<name>.svg."""
    with open(os.path.join(OUT,name+".svg"),"w") as fh: fh.write(d.svg())
