from lib import *
# Reference photo: File:Rome Colosseum exterior panorama.jpg by Nicholas Hartmann (CC BY-SA 4.0), https://commons.wikimedia.org/wiki/File:Rome_Colosseum_exterior_panorama.jpg
import math, random
# Drawn from a reference photo (Wikimedia Commons, the Colosseum from the west, 2019): the surviving
# full-height outer wall on the left ending in Valadier's sloping brick buttress, the lower inner ring
# with two arcades and its brick top with square windows, the broken outer ring in front.
# Mapping from photo pixels: x = 0.833 * x, y = 0.833 * y + 170.
d=D(); rg=random.Random(9)
k_=0.833
def tx(x): return k_*x
def ty(y): return k_*y+170
HZ=360; Dz=900
# --- inner ring as a receding cylinder
CXr, R = 560, 285
def ring(t, y):
    z=R*(1-math.cos(t-0.05)); s=1/(1+z/Dz)
    return tx(CXr+R*math.sin(t)*s), ty(HZ+(y-HZ)*s)
TA, TB = -0.72, 1.28
def band(y, ta=TA, tb=TB, w=W2, n=50):
    d.poly([ring(ta+(tb-ta)*i/n,y) for i in range(n+1)],w)
# background trees right and left
d.layer='back'
leafy(d,tx(905),ty(300),60,46,seed=3); leafy(d,tx(30),ty(300),50,60,seed=4)
d.new_layer("inner")
N=17
edges=[TA+(TB-TA)*i/N for i in range(N+1)]
outline=[ring(TA,415)]+[ring(t,160) for t in [TA+(TB-TA)*i/40 for i in range(41)]]+[ring(TB,415)]
d.poly([ring(TA,415),ring(TA,160)],W2); d.poly([ring(TB,415),ring(TB,240)],W1)
band(160,w=W1); band(205); band(212,w=W4); band(310); band(322,w=W4); band(415,w=W1)
d.occ_poly(outline)
for i in range(N):
    t0,t1=edges[i],edges[i+1]; tm=(t0+t1)/2
    for (yb,yt) in ((410,338),(305,240)):
        a=ring(t0+(t1-t0)*0.18,yb); b=ring(t1-(t1-t0)*0.18,yb); top=ring(tm,yt)
        w_=b[0]-a[0]; h=a[1]-top[1]
        if w_<3: continue
        d.arch(a[0],a[1],w_,h,W2)
        d.hatch(a[0]+1,top[1]+w_/2,b[0]-1,a[1]-1,gap=4,w=W4,angle=80)
    # piers with engaged half-columns
    for y0,y1 in ((410,325),(305,214)):
        p,q=ring(t0,y0),ring(t0,y1); d.line(p[0],p[1],q[0],q[1],W3)
    # brick upper band: square windows on alternate bays, coursing
    if i%2==1:
        a=ring(tm-0.02,178); b=ring(tm+0.02,194); d.rect(a[0],a[1],max(2,b[0]-a[0]),b[1]-a[1],W2)
    for y in (170,184,198):
        p,q=ring(t0,y),ring(t1,y)
        if rg.random()<0.6: d.line(p[0],p[1],q[0],q[1],W4)
# --- the tall surviving outer wall on the left, with the buttress
d.new_layer("outer")
L0,L1,TOPY=90,205,30
def ox(x,y):   # slight curve of the outer wall toward the left edge
    return tx(x)
frag=[(tx(90),ty(420)),(tx(88),ty(80)),(tx(140),ty(30)),(tx(160),ty(40)),(tx(170),ty(105)),(tx(205),ty(300)),(tx(212),ty(420))]
d.poly(frag,W1,True); d.occ_poly(frag)
for y in (140,215,240,310,335):
    d.path(f"M{tx(92)} {ty(y)}Q{tx(140)} {ty(y-12)} {tx(185+ (y-100)*0.08)} {ty(y-16)}",W2 if y in (215,310) else W3)
# arches per storey, narrowing toward the left edge (the wall curves away)
for (yb,yt) in ((415,345),(305,245),(210,148)):
    xs=[(96,112),(118,140),(148,176),(182,204)]
    for x0,x1 in xs:
        if yt<200 and x1>170: continue
        a=(tx(x0),ty(yb-4)); w_=tx(x1)-tx(x0); h=ty(yb)-ty(yt)
        d.arch(a[0],a[1],w_,h,W2); d.hatch(a[0]+1,a[1]-h+w_/2,a[0]+w_-1,a[1]-1,gap=4,w=W4,angle=80)
    for x0,_ in xs[1:]: d.line(tx(x0-3),ty(yb),tx(x0-3),ty(yt+4),W3)
# attic storey: pilasters and small windows, corbels
for x in (104,128,152): d.line(tx(x),ty(140),tx(x+6),ty(50),W3)
for x in (112,138): d.rect(tx(x),ty(95),5,9,W3)
# Valadier's brick buttress: sloping wedge with brick courses
but=[(tx(170),ty(105)),(tx(205),ty(300)),(tx(212),ty(420)),(tx(186),ty(420)),(tx(180),ty(300))]
d.poly(but,W2,True)
for y in range(110,420,9):
    p0=tx(170+(y-105)*0.18) if y<300 else tx(205); d.line(p0-6 if y>300 else p0-8,ty(y),p0,ty(y),W4)
hatch_poly(d,[(tx(172),ty(110)),(tx(204),ty(300)),(tx(210),ty(418)),(tx(188),ty(418)),(tx(182),ty(300))],gap=5,angle=75)
# travertine texture on the fragment
for _ in range(160):
    x=rg.uniform(tx(92),tx(178)); y=rg.uniform(ty(50),ty(415))
    if inside(frag)(x,y): d.line(x,y,x+rg.uniform(3,7),y,W4)
# --- the broken outer ring in front (lower), with its own sloping buttress
d.new_layer("front_ring")
fr=[(tx(205),ty(420)),(tx(205),ty(195)),(tx(260),ty(185)),(tx(300),ty(200)),(tx(345),ty(198)),(tx(385),ty(215)),(tx(392),ty(305)),(tx(440),ty(305)),(tx(480),ty(332)),(tx(480),ty(420))]
d.poly(fr,W1); d.occ_poly(fr+[(tx(205),ty(420))])
for y in (215,240,310,335): d.line(tx(205),ty(y),tx(392 if y<300 else 480),ty(y+4),W3)
for (yb,yt,xs) in ((415,350,((222,262),(290,332),(372,404),(436,466))),(305,245,((222,262),(290,332),(340,384)))):
    for x0,x1 in xs:
        a=(tx(x0),ty(yb)); w_=tx(x1)-tx(x0); h=ty(yb)-ty(yt)
        d.arch(a[0],a[1],w_,h,W2); d.hatch(a[0]+1,a[1]-h+w_/2,a[0]+w_-1,a[1]-1,gap=4,w=W4,angle=80)
for x in (210,276,350,420,476): d.line(tx(x),ty(415),tx(x),ty(340),W3); d.line(tx(x)+3,ty(415),tx(x)+3,ty(340),W4)
fb=[(tx(350),ty(420)),(tx(350),ty(305)),(tx(392),ty(305)),(tx(440),ty(420))]
d.poly(fb,W2,True); d.occ_poly(fb); hatch_poly(d,fb,gap=5,angle=70)
for y in range(310,420,9): d.line(tx(352),ty(y),tx(392+(y-305)*0.42),ty(y),W4)
for _ in range(120):
    x=rg.uniform(tx(205),tx(480)); y=rg.uniform(ty(200),ty(415))
    if inside(fr)(x,y): d.line(x,y,x+rg.uniform(3,7),y,W4)
# --- ground: the paved piazza in perspective, a lamp standard, kerb
d.new_layer("ground")
G=ty(420)
d.line(0,G,800,G,W1)
cobbles(d,G+2,600,vx=tx(600))
d.occ_poly([(0,G+1),(800,G+1),(800,600),(0,600)])
lx=tx(75)
d.path(f"M{lx-3} {ty(445)}V{ty(190)}M{lx+3} {ty(445)}V{ty(190)}",W2); d.rect(lx-6,ty(440),12,ty(445)-ty(440)+8,W3)
for sg in (-1,1):
    d.path(f"M{lx} {ty(200)}q{sg*14} -10 {sg*28} 0",W3); d.path(f"M{lx+sg*28-6} {ty(200)}h12l-3 10h-6Z",W3)
d.path(f"M{lx-6} {ty(190)}h12l-3 -12h-6Z",W3); d.line(lx,ty(178),lx,ty(170),W3)
d.cloud(560,70,1.0); d.cloud(80,60,0.8); d.bird(420,100); d.bird(442,90,0.7)
save(d,"rome-colosseum")
