from lib import *
# Reference photo: File:Tivoli Copenhagen Main Entrance.jpg by Sissew (Public domain), https://commons.wikimedia.org/wiki/File:Tivoli_Copenhagen_Main_Entrance.jpg
# The main entrance on Vesterbrogade (1890): the domed gate arch between two brick pavilions, the
# perimeter wall running off to both sides, strings of light bulbs along every cornice and arch, and
# the park behind: trees, the Chinese Tower and the 'mountain' of the wooden roller coaster
# Rutschebanen (1914).
import math, random
d=D(); rg=random.Random(4)
G=470                                     # pavement line at the foot of the buildings
def bulbs(pts, step=11):
    """Light bulbs (small circles) spaced along a polyline."""
    for (x0,y0),(x1,y1) in zip(pts,pts[1:]):
        n=max(1,int(math.hypot(x1-x0,y1-y0)/step))
        for k in range(n): d.circle(x0+(x1-x0)*k/n,y0+(y1-y0)*k/n,1.6,W4)
def arc_pts(cx,cy,r,a0=math.pi,a1=0,n=24): return [(cx+r*math.cos(a0+(a1-a0)*k/n), cy-r*math.sin(a0+(a1-a0)*k/n)) for k in range(n+1)]
d.layer='back'
d.cloud(40,70,1.1); d.cloud(600,40,0.9); d.bird(540,110); d.bird(560,100,0.7)
# --- the park behind the wall: Rutschebanen's mountain with its track, the Chinese Tower, trees
mtn=[(0,232),(30,150),(58,172),(92,112),(124,156),(150,138),(182,186),(210,214)]
d.poly(mtn,W2)
for (x0,y0),(x1,y1) in zip(mtn,mtn[1:]): d.line((x0+x1)/2,(y0+y1)/2,(x0+x1)/2+5,(y0+y1)/2+14,W4)
d.hatch(0,112,210,232,gap=6,w=W4,angle=60,clip=lambda x,y: y>max(yy for xx,yy in mtn if abs(xx-x)<34)+6)
def trk(x): return 128+30*math.sin((x+20)/30)
d.poly([(x,trk(x)) for x in range(0,206,4)],W2); d.poly([(x,trk(x)+6) for x in range(0,206,4)],W3)
for x in range(0,206,8): d.line(x,trk(x),x,trk(x)+6,W4)
for x in range(0,206,14): d.line(x,trk(x)+6,x,232,W4)
for k in range(3): x=70+k*14; y=trk(x)-1; d.poly([(x-6,y),(x-5,y-8),(x+5,y-8),(x+6,y)],W3,True)
d.rect(86,84,12,28,W3); d.poly([(84,84),(92,70),(100,84)],W3)              # the little rock tower
# the Chinese Tower above the trees on the right
cx=690
for k,(hw,y) in enumerate(((44,236),(36,204),(28,174),(20,148))):
    d.path(f"M{cx-hw-8} {y}Q{cx-hw*0.4} {y-6} {cx} {y-20}Q{cx+hw*0.4} {y-6} {cx+hw+8} {y}",W2)
    d.line(cx-hw-8,y,cx-hw-4,y-6,W3); d.line(cx+hw+8,y,cx+hw+4,y-6,W3)
    d.rect(cx-hw*0.6,y,hw*1.2,10,W3)
    for x in range(int(cx-hw*0.6)+4,int(cx+hw*0.6),6): d.line(x,y+2,x,y+10,W4)
d.line(cx,128,cx,104,W2); d.circle(cx,100,3,W3)
d.new_layer("trees")
for x,y,rx,ry,sd in ((293,318,34,30,1),(507,316,34,30,2),(772,292,40,34,3),(30,300,36,26,6)):
    leafy(d,x,y,rx,ry,seed=sd)
# --- the perimeter wall along Vesterbrogade, to both sides of the pavilions
d.new_layer("wall")
for x0,x1 in ((0,70),(730,800)):
    wl=[(x0,G),(x0,330),(x1,330),(x1,G)]; d.poly(wl,W2,True); d.occ_poly(wl+[(x1,320),(x0,320)])
    d.rect(x0,322,x1-x0,8,W2)
    for y in range(338,G,9): d.line(x0,y,x1,y,W4)
    for y in range(338,G,18):
        for x in range(x0+(8 if (y//18)%2 else 0),x1,16): d.line(x,y,x,y+9,W4)
    for x in (x0+8,x1-14): d.rect(x,330,6,G-330,W3)                         # brick piers
    bulbs([(x0,322),(x1,322)])
# --- the two pavilions (1889-90): red brick, arched windows, hipped slate roofs, ornamental gables
def pavilion(x0,x1):
    d.new_layer(f"pav{x0}")
    w=x1-x0; ev=230; mid=(x0+x1)/2
    body=[(x0,G),(x0,ev),(x1,ev),(x1,G)]; d.poly(body,W1,True); d.occ_poly(body)
    roof=[(x0-6,ev),(x0+22,ev-36),(x1-22,ev-36),(x1+6,ev)]; d.poly(roof,W1,True); d.occ_poly(roof)
    for k in range(1,int((w-44)/8)): x=x0+22+k*8; d.line(x,ev-36,x+(x-mid)*0.12,ev-2,W4)
    gab=[(mid-36,ev),(mid-36,ev-34),(mid-20,ev-50),(mid,ev-58),(mid+20,ev-50),(mid+36,ev-34),(mid+36,ev)]
    d.poly(gab,W2,True); d.occ_poly(gab); d.circle(mid,ev-28,9,W3); d.circle(mid,ev-28,4,W4)
    for sx in (-1,1): d.path(f"M{mid+sx*36} {ev-34}q{sx*10} 4 {sx*6} 14",W3)        # scroll volutes
    for xx in (x0+2,x1-14): d.rect(xx,ev-48,12,14,W3); d.path(f"M{xx} {ev-48}q6 -8 12 0",W3)   # corner urns
    d.line(x0-4,ev,x1+4,ev,W1); d.line(x0,ev+8,x1,ev+8,W3)
    bulbs([(x0-4,ev+3),(x1+4,ev+3)]); bulbs(gab[1:-1],9)
    # upper floor: three tall round-headed windows
    for k in range(3):
        wx=mid-48+k*36; d.arch(wx-11,ev+92,22,62,W2); d.arch(wx-7,ev+88,14,54,W4)
        d.line(wx,ev+36,wx,ev+88,W4); d.line(wx-11,ev+95,wx+11,ev+95,W3)
    for k in range(2): x=x0+10+k*(w-30); d.arch(x,ev+90,12,40,W3)
    # first-floor cornice with bulbs, then the ground-floor arcade
    d.line(x0,ev+112,x1,ev+112,W2); d.line(x0,ev+118,x1,ev+118,W4); bulbs([(x0,ev+115),(x1,ev+115)])
    for k in range(3):
        ax=x0+18+k*(w-36)/3; aw=(w-36)/3-14
        d.arch(ax,G,aw,G-ev-138,W2); bulbs(arc_pts(ax+aw/2,G-(G-ev-138)+aw/2,aw/2+5),8)
        d.rect(ax+4,G-56,aw-8,52,W4)
    # brick courses as tone between the openings
    for y in range(ev+12,ev+108,7): d.line(x0+2,y,x0+8,y,W4); d.line(x1-8,y,x1-2,y,W4)
    for y in range(ev+124,G,10): d.line(x0+2,y,x0+16,y,W4); d.line(x1-16,y,x1-2,y,W4)
pavilion(70,270); pavilion(530,730)
# the low colonnades linking the pavilions to the gate
d.new_layer("links")
for x0,x1 in ((270,316),(484,530)):
    lk=[(x0,G),(x0,348),(x1,348),(x1,G)]; d.poly(lk,W2,True); d.occ_poly(lk)
    d.line(x0,356,x1,356,W3); bulbs([(x0,351),(x1,351)])
    for x in range(x0+6,x1,14): d.line(x,360,x,G,W3)
    d.hatch(x0+1,360,x1-1,G-1,gap=9,w=W4,angle=60,clip=lambda x,y: True)
# --- the gate: a great round arch under a ribbed dome with a lantern and a flagpole
d.new_layer("gate")
gx=400; gl,gr=316,484
body=[(gl,G),(gl,272),(gr,272),(gr,G)]; d.poly(body,W1,True); d.occ_poly(body)
dome=[(gl+10,272)]+[(gx+78*math.cos(a),262-62*math.sin(a)) for a in [math.pi*(1-k/24) for k in range(25)]]+[(gr-10,272)]
d.poly(dome,W1); d.occ_poly(dome+[(gr-10,272),(gl+10,272)])
for k in range(-4,5): d.path(f"M{gx+k*14} 272Q{gx+k*12} {226-abs(k)*2} {gx+k*3} 202",W4)   # ribs
for y in (246,226,212): d.path(f"M{gx-70+(246-y)*0.8} {y+14}Q{gx} {y-8} {gx+70-(246-y)*0.8} {y+14}",W4)          # tile courses
d.rect(gl+6,256,gr-gl-12,16,W2); d.rect(gx-34,260,68,10,W3)                         # name panel (blank)
bulbs(dome[1:-1],10)
d.rect(gx-10,186,20,14,W2); d.poly([(gx-12,186),(gx,176),(gx+12,186)],W2); d.line(gx,176,gx,96,W2)   # lantern, flagpole
d.path(f"M{gx} 96q14 6 26 0q-12 -8 -26 -10",W3)
# the arch and its piers with pilasters and niches
R=56; d.arch(gx-R,G,2*R,G-300,W1); d.arch(gx-R-10,G,2*R+20,G-290,W2)
bulbs(arc_pts(gx,300+R,R+5),9)
for px in (gl+8,gr-30):
    d.rect(px,286,22,G-286,W3); d.arch(px+4,410,14,40,W4); d.rect(px+2,330,18,8,W4)
d.line(gl,286,gr,286,W2); bulbs([(gl,280),(gr,280)])
# view through the arch: lamps, a flower bed and the trees of the garden
d.line(gx-R,440,gx+R,440,W4)
for x in (gx-38,gx+38): d.line(x,G,x,424,W3); d.circle(x,420,4,W3)
leafy(d,gx,398,40,28,seed=9); d.line(gx-3,424,gx-4,G,W3); d.line(gx+3,424,gx+4,G,W3)
# --- Vesterbrogade: kerb, the pedestrian crossing, a lamp post and a bicycle
d.new_layer("street")
d.line(0,G,800,G,W1); d.line(0,G+14,800,G+14,W2)
for k in range(6): y=G+26+k*18; d.poly([(30-k*14,y),(250-k*10,y),(258-k*10,y+10),(26-k*14,y+10)],W3,True)
for x in range(300,800,90): d.line(x,G+70,x+46,G+70,W3)
d.line(296,G+14,296,320,W2); d.path("M296 324q0 -16 22 -16",W2); d.rect(312,308,14,6,W3)
d.occ_poly([(292,G+14),(292,320),(330,304),(330,314),(300,322),(300,G+14)])
for wx in (600,646):
    d.circle(wx,G+6,12,W3)
d.poly([(600,G+6),(618,G-12),(646,G+6),(628,G-14),(618,G-12)],W3); d.line(628,G-14,632,G-22,W3); d.line(614,G-16,622,G-16,W3)
d.layer='back'
for y in range(G+90,600,14): d.line(0,y,800,y,W4) if y%28==0 else None
save(d,"copenhagen-tivoli")
