from lib import *
# Reference photo: File:Tower of London viewed from the River Thames.jpg by Bob Collowan (CC BY-SA 3.0), https://commons.wikimedia.org/wiki/File:Tower_of_London_viewed_from_the_River_Thames.jpg
import math, random
# Drawn from a reference photo (Wikimedia Commons, the White Tower seen from the Thames).
# Mapping from photo pixels: x = 0.9 * x - 32, y = 0.9 * y + 50.
d=D(); rg=random.Random(6)
def T(x,y): return (0.82*x+6, 0.82*y+70)
def P(pts): return [T(*p) for p in pts]
def tx(x): return 0.82*x+6
def ty(y): return 0.82*y+70
# --- trees behind, left and right
d.layer='back'
leafy(d,tx(50),ty(310),54,70,seed=1); leafy(d,tx(180),ty(290),62,56,seed=2); leafy(d,tx(845),ty(305),80,80,seed=3)
for x,yb in ((tx(200),ty(380)),(tx(840),ty(415))): d.line(x-4,yb,x-2,yb-60,W2); d.line(x+4,yb,x+2,yb-60,W2)
d.layer='front'
# --- the White Tower
def battl(x0,x1,y,n,h=10):
    d.line(x0,y,x1,y,W2)
    for k in range(n): xa=x0+k*(x1-x0)/n+2; d.rect(xa,y-h,(x1-x0)/n-6,h,W3)
west=P([(305,230),(400,222),(400,410),(305,410)])
south=P([(460,222),(718,222),(718,410),(460,410)])
d.occ_poly(P([(286,412),(286,130),(722,130),(722,412)]))
d.poly(west,W1,True); d.poly(south,W1,True)
battl(tx(305),tx(400),ty(228),6); battl(tx(460),tx(718),ty(222),13)
# west face in shade, narrow lancets
hatch_poly(d,west,gap=6,angle=80)
for x in (330,352,375):
    for y in (290,340): xx,yy=T(x,y); d.arch(xx-3,yy,6,16,W3)
# south face: ashlar texture, pilaster buttresses, three window rows with Caen-stone hoods
x0,x1,y0,y1=tx(460),tx(718),ty(222),ty(410)
for y in range(int(y0)+8,int(y1),7):
    x=x0+rg.uniform(0,8)
    while x<x1-6: ln=rg.uniform(5,12); d.line(x,y,x+ln,y,W4); x+=ln+rg.uniform(4,9)
for px in (500,555,612,662,712):
    a=tx(px)-3.5; d.line(a,y0,a,y1,W3); d.line(a+7,y0,a+7,y1,W3)
    for y in range(int(y0)+6,int(y1),12): d.line(a,y,a+7,y,W4)
for k,cxp in enumerate((478,528,583,637,688)):
    cxw=tx(cxp)
    for dx in (-5,5): d.arch(cxw+dx-3,ty(282),6,12,W3)                 # paired upper lights
    d.arch(cxw-6,ty(338),12,24,W2); d.path(f"M{cxw-10} {ty(338)-16}a10 10 0 0 1 20 0",W3)   # main floor
    d.hatch(cxw-5,ty(338)-22,cxw+5,ty(338)-1,gap=3,w=W4)
    if k: d.arch(cxw-5,ty(395),10,20,W2); d.path(f"M{cxw-9} {ty(395)-14}a9 9 0 0 1 18 0",W3)
for y in (ty(300),ty(352)): d.line(x0,y,x1,y,W4)
# corner turrets and their lead cupolas with weathervanes
def cupola(cxp,base_y,w,tall):
    """Lead bell cupola: flared foot, broad shoulder, narrowing to a lantern; ball and weathervane."""
    x=tx(cxp); y=ty(base_y); hw_=w/2; tall=w*0.82
    d.rect(x-hw_-2,y-4,w+4,4,W3)
    d.path(f"M{x-hw_} {y-4}C{x-hw_*1.06} {y-tall*0.45} {x-hw_*0.62} {y-tall*0.78} {x-hw_*0.16} {y-tall*0.86}"
           f"L{x+hw_*0.16} {y-tall*0.86}C{x+hw_*0.62} {y-tall*0.78} {x+hw_*1.06} {y-tall*0.45} {x+hw_} {y-4}",W2)
    for k in (-0.55,0,0.55): d.path(f"M{x+k*hw_*1.7} {y-4}Q{x+k*hw_*1.4} {y-tall*0.55} {x+k*hw_*0.25} {y-tall*0.85}",W4)
    d.hatch(x+hw_*0.2,y-tall,x+hw_*1.05,y-4,gap=3,w=W4,angle=80,clip=lambda X_,Y_: X_-x<hw_*(1.0-0.85*((y-Y_)/tall)**2.2))
    d.rect(x-4,y-tall*0.86-8,8,8,W3); d.circle(x,y-tall*0.86-13,4,W3)
    top=y-tall*0.86-17; d.line(x,top,x,top-30,W2)
    d.path(f"M{x-13} {top-18}h26l-5 -3m5 3l-5 3",W3); d.rect(x-1,top-30,12,8,W3)   # pointer + banner vane
    d.line(x-7,top-8,x+7,top-8,W4)
def sq_turret(xl,xr,top,bot,cup_w,tall):
    pts=P([(xl,bot),(xl,top),(xr,top),(xr,bot)]); d.poly(pts,W1)
    d.occ_poly(pts)
    battl(tx(xl)-2,tx(xr)+2,ty(top),3,8)
    for y in (top+40,top+90): xx,yy=T((xl+xr)/2,y); d.arch(xx-3,yy,6,14,W3)
    d.hatch(tx(xl+(xr-xl)*0.65),ty(top),tx(xr),ty(bot),gap=6,w=W4,angle=82)
    cupola((xl+xr)/2,top-8,cup_w,tall)
# NE round turret (behind), NW square, SW square tall, SE square
xr_=tx(532); d.path(f"M{tx(505)} {ty(222)}V{ty(185)}M{tx(560)} {ty(222)}V{ty(185)}",W1); d.path(f"M{tx(505)} {ty(185)}q{(tx(560)-tx(505))/2} 6 {tx(560)-tx(505)} 0",W3)
for y in (195,206): d.path(f"M{tx(505)} {ty(y)}q{(tx(560)-tx(505))/2} 4 {tx(560)-tx(505)} 0",W4)
d.arch(xr_-3,ty(205),6,12,W3); cupola(532,185,tx(560)-tx(505)+4,62)
sq_turret(292,340,190,232,44,52)
sq_turret(400,460,152,410,52,64)
sq_turret(648,706,152,222,52,64)
d.line(tx(373),ty(220),tx(373),ty(60),W3); d.path(f"M{tx(373)} {ty(64)}l-10 4l10 6Z",W3)   # flagstaff
# --- curtain wall in front, round wall towers, gateways
d.layer='front'
CW_T1, CW_T2, CW_B = 380, 415, 505
wall=P([(0,CW_T1),(425,CW_T1),(425,CW_T2),(960,CW_T2),(960,CW_B),(0,CW_B)])
d.occ_poly(wall); d.poly(P([(0,CW_T1),(425,CW_T1)]),W2); d.poly(P([(485,CW_T2),(960,CW_T2)]),W2)
battl(tx(90),tx(425),ty(CW_T1),16,9); battl(tx(485),tx(960),ty(CW_T2),22,9)
d.line(*T(0,CW_B),*T(960,CW_B),W1)
for x in range(0,960,6):
    for y in range(CW_T1+10,CW_B,11):
        if (y<CW_T2+6 and x>485): continue
        if rg.random()<0.5: xx,yy=T(x,y); d.line(xx,yy,xx+4,yy,W4)
for xs,yb in (((105,118),440),((255,268),445),((313,326),445),((400,),445),((448,),440),((560,),460)):
    for x in xs: xx,yy=T(x,yb); d.arch(xx-3,yy+12,6,14,W3)
# round wall towers
for xl,xr,top in ((35,95,335),(425,485,340)):
    a,b=tx(xl),tx(xr); yt=ty(top)
    d.path(f"M{a} {ty(CW_B)}V{yt}M{b} {ty(CW_B)}V{yt}",W1); d.occ_poly([(a,ty(CW_B)),(a,yt-12),(b,yt-12),(b,ty(CW_B))])
    for k in range(4): d.rect(a+2+k*(b-a)/4,yt-10,(b-a)/4-4,10,W3)
    d.path(f"M{a} {yt}q{(b-a)/2} 6 {b-a} 0",W2)
    for y in range(int(yt)+12,int(ty(CW_B)),10): d.path(f"M{a} {y}q{(b-a)/2} 4 {b-a} 0",W4)
    d.hatch(a+(b-a)*0.55,yt,b,ty(CW_B),gap=4,w=W4,angle=84)
    xx,yy=T((xl+xr)/2,top+60); d.arch(xx-3,yy,6,14,W3)
# gateways: Traitors' Gate (low, left) and the arch on the right
xx,yy=T(262,505); d.path(f"M{xx-34} {yy}Q{xx} {yy-26} {xx+34} {yy}",W2); d.hatch(xx-30,yy-20,xx+30,yy,gap=4,w=W4)
xx,yy=T(772,500); d.arch(xx-26,yy,52,44,W2); d.hatch(xx-24,yy-42,xx+24,yy,gap=4,w=W4,clip=lambda X_,Y_: (X_-xx)**2+(Y_-(yy-18))**2<26**2 or Y_>yy-18)
# --- the wharf: railing, embankment wall with timber posts, the Thames
y1=ty(505)
d.line(0,y1+4,tx(960),y1+4,W3); d.line(0,y1+12,tx(960),y1+12,W3)
for x in range(0,int(tx(960)),7): d.line(x,y1+4,x,y1+12,W4)
d.line(0,y1+18,tx(960),y1+18,W1)
ew=ty(572)
for x in range(0,800,7):
    pass
for y in range(int(y1+24),int(ew),8): d.line(0,y,tx(960),y,W4)
for xp in range(530,960,42): xx,_=T(xp,0); d.rect(xx-4,y1+22,8,ew-y1-22,W3)
xx,yy=T(287,572); d.path(f"M{xx-62} {yy}Q{xx} {yy-36} {xx+62} {yy}",W2)
d.line(0,ew,800,ew,W1)
d.layer='back'; water(d,ew+2,600,seed=8,density=1.4); d.layer='front'
d.cloud(40,70,0.9); d.cloud(620,40,0.8); d.bird(150,80); d.bird(172,70,0.7)
save(d,"london-tower-of-london")
