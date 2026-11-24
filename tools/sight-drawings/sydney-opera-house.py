from lib import *
# Reference photo: File:Sydney Opera House from Circular Quay, 2023, 01.jpg by Kgbo (CC BY-SA 4.0), https://commons.wikimedia.org/wiki/File:Sydney_Opera_House_from_Circular_Quay,_2023,_01.jpg
import math, random
# Drawn from a reference photo (Wikimedia Commons, Sydney Opera House from the eastern promenade,
# 2023): the Concert Hall shells leaning left, the open shells with their glass walls facing us, the
# granite podium and stairs, the curved sea wall in the foreground. Mapping: x, y = 0.833 * photo.
d=D(); rg=random.Random(3); k_=0.833
def T(x,y): return (k_*x,k_*y)
def bez(p0,p1,p2,p3,n=24):
    out=[]
    for i in range(n+1):
        t=i/n; u=1-t; out.append(tuple(u**3*a+3*u*u*t*b+3*u*t*t*c+t**3*e for a,b,c,e in zip(p0,p1,p2,p3)))
    return out
def tP(pts): return [T(*p) for p in pts]
def shell(left, right, bottom=None, ribs=7, w=W1, shade=False, mouth=None):
    """left/right: bezier control quads (photo coords) from base to apex and apex to base."""
    L=tP(bez(*left)); R=tP(bez(*right))
    outline=L+R[1:]+(tP(bez(*bottom))[1:] if bottom else [])
    d.poly(L+R[1:],w); d.occ_poly(outline)
    if bottom: d.poly(tP(bez(*bottom)),W2)
    apex=L[-1]
    # tile ribs: curves from points along the lower edge to the apex, chevrons across them
    base_pts=[L[0]]+(tP(bez(*bottom)) if bottom else [R[-1]])
    n=len(base_pts)
    for k in range(1,ribs):
        bp=base_pts[int(k*(n-1)/ribs)] if bottom else (L[0][0]+(R[-1][0]-L[0][0])*k/ribs, L[0][1]+(R[-1][1]-L[0][1])*k/ribs)
        mx=(bp[0]+apex[0])/2+(apex[1]-bp[1])*0.08; my=(bp[1]+apex[1])/2
        d.path(f"M{bp[0]:.1f} {bp[1]:.1f}Q{mx:.1f} {my:.1f} {apex[0]:.1f} {apex[1]:.1f}",W4)
    for j in range(1,15):   # chevron courses parallel to the left edge
        t=j/15; a=L[int(t*(len(L)-1))]; b=R[len(R)-1-int(t*(len(R)-1))]
        m=((a[0]+b[0])/2,(a[1]+b[1])/2+4)
        d.path(f"M{a[0]:.1f} {a[1]:.1f}L{m[0]:.1f} {m[1]:.1f}L{b[0]:.1f} {b[1]:.1f}",W4)
    if shade: hatch_poly(d,outline,gap=6,angle=70)
    if mouth:
        M=tP(mouth); d.poly(M,W2,True)
        xs=[p[0] for p in M]; ys=[p[1] for p in M]; top=min(ys)
        ins=inside(M)
        for x in range(int(min(xs))+3,int(max(xs)),5):         # glass mullions, clipped to the mouth
            seg=[y for y in range(int(top),int(max(ys))) if ins(x,y)]
            if len(seg)>2: d.line(x,seg[0],x,seg[-1],W4)
        for y in range(int(top)+8,int(max(ys)),12):              # transoms
            seg=[x for x in range(int(min(xs)),int(max(xs))) if ins(x,y)]
            if len(seg)>2: d.line(seg[0],y,seg[-1],y,W4)
# --- background: Kirribilli on the far shore
d.layer='back'
HZ=T(0,505)[1]
for x0,x1,top in ((0,20,420),(22,62,428),(64,96,440),(98,130,455),(132,165,445),(165,190,470)):
    a,b=T(x0,top),T(x1,505); d.rect(a[0],a[1],b[0]-a[0],b[1]-a[1],W4)
    for y in range(int(a[1])+5,int(b[1]),6):
        for x in range(int(a[0])+2,int(b[0])-2,5): d.line(x,y,x+2,y,W4) if rg.random()<0.4 else None
leafy(d,*T(150,450),16,12,seed=2)
d.line(0,HZ,800,HZ,W3)
water(d,HZ+2,600,x0=0,x1=760,seed=9,density=1.1)
# --- shells, back to front
d.new_layer("back_shells")
shell(((222,392),(226,340),(262,300),(298,294)),((298,294),(302,320),(300,350),(300,372)),ribs=5,w=W2)
shell(((252,396),(262,320),(300,262),(350,235)),((350,235),(350,270),(346,300),(344,330)),ribs=6,w=W2)
shell(((625,240),(632,228),(640,214),(651,208)),((651,208),(662,212),(672,222),(676,230)),ribs=3,w=W2)
d.new_layer("tall")
shell(((335,422),(350,300),(380,190),(412,148)),((412,148),(468,156),(526,232),(552,300)),ribs=9)
d.new_layer("concert_front")
shell(((405,408),(450,360),(500,322),(550,300)),((550,300),(545,330),(530,368),(522,390)),ribs=5,w=W2,
      mouth=[(430,402),(520,334),(518,392)])
shell(((448,398),(490,360),(530,330),(548,316)),((548,316),(548,350),(545,380),(542,395)),ribs=4,w=W2)
d.new_layer("hall_shells")
# the open shells facing us: broad hoods whose lower edge frames the glass wall beneath
shell(((545,410),(560,320),(640,240),(728,226)),((728,226),(733,248),(735,270),(735,292)),
      bottom=((735,292),(700,296),(620,352),(578,406)),ribs=8,
      mouth=[(580,410)]+[p for p in bez((578,406),(620,352),(700,296),(735,292),12)]+[(737,410)])
shell(((575,425),(610,350),(690,290),(766,272)),((766,272),(774,286),(779,296),(781,302)),
      bottom=((781,302),(742,306),(660,356),(606,420)),ribs=8,
      mouth=[(608,422)]+[p for p in bez((606,420),(660,356),(742,306),(781,302),12)]+[(781,420)])
shell(((780,414),(786,350),(792,310),(802,296)),((802,296),(820,320),(832,370),(836,416)),ribs=4,w=W2,
      mouth=[(792,414),(806,322),(828,414)])
# --- the podium: granite walls, the broad stair on the right, terrace railings, lamps
d.new_layer("podium")
pod=tP([(180,392),(560,410),(560,425),(960,425),(960,505),(180,505)])
d.poly(pod,W1,True); d.occ_poly(pod)
for y in (432,446,462,478): d.line(*T(180,y),*T(560,y),W4)
for x in range(200,560,40): d.rect(*T(x,438),k_*24,k_*6,W4)
d.poly(tP([(180,392),(180,505)]),W1); d.poly(tP([(192,402),(220,470)]),W3)       # the north-west stair
for k in range(10): y=428+k*4.5; d.line(*T(560+k*12,y),*T(960,y),W4)             # the grand stair
d.line(*T(560,425),*T(700,470),W3)
for x in range(240,960,36): d.line(*T(x,470),*T(x,488),W3); d.path(f"M{T(x,470)[0]-3} {T(x,470)[1]}h6",W4)   # lamps
d.line(*T(180,488),*T(960,488),W2)
d.hatch(*T(180,488),*T(960,505),gap=8,w=W4,angle=60)
# --- the curved sea wall and promenade in the foreground
d.new_layer("seawall")
wall_top=tP(bez((240,505),(600,505),(880,520),(900,560),30)+bez((900,560),(920,620),(860,690),(830,720),20)[1:])
wall_bot=tP(bez((240,515),(600,520),(850,540),(870,575),30)+bez((870,575),(880,620),(830,680),(800,720),20)[1:])
d.poly(wall_top,W1); d.poly(wall_bot,W2)
d.occ_poly(wall_top+[(800,600),(800,T(0,500)[1])])
for a,b in zip(wall_top[::3],wall_bot[::3]): d.line(*a,*b,W4)
d.poly(tP(bez((240,532),(600,540),(840,570),(860,620),30)),W4)
prom=wall_top+[(800,600),(800,T(0,505)[1])]
for y in range(int(T(0,520)[1]),600,9):
    x0=max(p[0] for p in wall_top if abs(p[1]-y)<6) if any(abs(p[1]-y)<6 for p in wall_top) else None
    if x0: d.line(x0+6,y,800,y,W4)
for x,y in ((870,560),(880,600)): d.line(*T(x,y),*T(x,y+50),W3)   # railing posts
d.cloud(80,80,1.2); d.cloud(560,60,1.0); d.cloud(680,150,0.7); d.bird(600,140,0.8)
save(d,"sydney-opera-house")
