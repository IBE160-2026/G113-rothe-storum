from lib import *
# Reference photo: File:Looking Up at Empire State Building.JPG by BigMac (CC BY-SA 3.0), https://commons.wikimedia.org/wiki/File:Looking_Up_at_Empire_State_Building.JPG
# View from Fifth Avenue, a few blocks away, looking up: the limestone piers converge toward a vanishing point high above
# the frame; the wings step back in setbacks, the central tower rises to the crown and the mast.
import math
d=D()
VX,VY=400,-1250         # vanishing point far above the frame (a gentler upward look)
GY=560
def P(x0,y):             # a vertical line that starts at x0 on the bottom edge, at height y on screen
    return VX+(x0-VX)*(y-VY)/(GY-VY), y
def face(xl,xr,ytop,ybot=GY,piers=10,w=W1,shade=False,floors=True):
    a,b=P(xl,ybot),P(xr,ybot); c,e=P(xr,ytop),P(xl,ytop)
    pts=[a,b,c,e]; d.poly(pts,w,True); d.occ_poly(pts)
    # light limestone piers with recessed window strips between them; floors get closer with height
    for k in range(piers):
        xa=xl+(xr-xl)*(k+0.3)/piers; xb=xl+(xr-xl)*(k+0.7)/piers
        d.line(*P(xa,ybot),*P(xa,ytop+2),W4); d.line(*P(xb,ybot),*P(xb,ytop+2),W4)
        if floors:
            y=ybot-6; h=15
            while y>ytop+3:
                d.line(*P(xa,y),*P(xb,y),W4)
                if (k*7+int(y))%3==0: d.line(*P(xa,y-h*0.5),*P(xb,y-h*0.5),W4)
                y-=h; h=max(3.2,h*0.955)
    if shade: d.hatch(min(p[0] for p in pts),ytop,max(p[0] for p in pts),ybot,gap=6,w=W4,angle=80,clip=inside(pts))
d.layer='back'
d.cloud(70,90,1.2); d.cloud(620,60,1.0); d.cloud(680,170,0.7); d.bird(150,190); d.bird(172,180,0.7)
# the wings: lowest setbacks at the sides
d.new_layer("wings")
face(-60,170,330,piers=7,shade=True); face(630,860,330,piers=7,shade=True)
for xl,xr,yt in ((-60,170,330),(630,860,330)):
    d.line(*P(xl,yt),*P(xr,yt),W2); d.line(*P(xl,yt+8),*P(xr,yt+8),W3)
# the main shaft and its stepped flanks
d.new_layer("shaft")
face(170,270,210,piers=3); face(530,630,210,piers=3)
for xl,xr in ((170,270),(530,630)): d.line(*P(xl,210),*P(xr,210),W2)
d.new_layer("tower")
face(270,530,150,piers=8)
# the recessed central bay above the middle setback, in shadow
rb=[P(358,300),P(442,300),P(442,154),P(358,154)]; d.poly(rb,W2,True); d.hatch(min(p[0] for p in rb),154,max(p[0] for p in rb),300,gap=4,w=W4,angle=86,clip=inside(rb))
# the central spine (projecting bay) with stronger piers
for x0 in (358,442): d.line(*P(x0,GY),*P(x0,300),W2)
d.line(*P(270,150),*P(530,150),W2)
# the crown: setbacks with fins, the mooring mast tip just visible
d.new_layer("crown")
for (xl,xr,yt,yb) in ((296,504,128,150),(322,478,110,128),(344,456,96,110)):
    a,b,c,e=P(xl,yb),P(xr,yb),P(xr,yt),P(xl,yt); d.poly([a,b,c,e],W2,True); d.occ_poly([a,b,c,e])
    for k in range(1,10): x0=xl+(xr-xl)*k/10; d.line(*P(x0,yb),*P(x0,yt),W4)
# the crown: stepped Art Deco setbacks with vertical fins, the cylindrical mooring mast with its
# ribbed lantern, and the broadcast antenna
x0,_=P(400,96)
for (hw,yt,yb) in ((44,76,96),(34,60,76)):
    d.rect(x0-hw,yt,2*hw,yb-yt,W2); d.occ_poly([(x0-hw,yt),(x0+hw,yt),(x0+hw,yb),(x0-hw,yb)])
    for k in range(-5,6): d.line(x0+k*hw/5.5,yt+2,x0+k*hw/5.5,yb,W4)
d.rect(x0-26,54,52,6,W3)
mast=[(x0-14,54),(x0-14,26),(x0+14,26),(x0+14,54)]; d.poly(mast,W2,True); d.occ_poly(mast)
for k in range(-2,3): d.line(x0+k*5.5,28,x0+k*5.5,52,W4)
d.path(f"M{x0-14} 26Q{x0-12} 12 {x0} 10Q{x0+12} 12 {x0+14} 26",W2); d.occ_poly([(x0-14,26),(x0,10),(x0+14,26)])
d.line(x0-16,40,x0+16,40,W3)
d.rect(x0-4,-2,8,12,W3); d.line(x0,-2,x0,-30,W2); d.line(x0-3,-20,x0+3,-20,W3)
# the entrance canopy at street level (bottom edge)
d.new_layer("street")
d.poly([(336,560),(344,528),(456,528),(464,560)],W2,True); d.occ_poly([(336,560),(344,528),(456,528),(464,560)])
for x in range(352,452,12): d.line(x,532,x,558,W4)
# Fifth Avenue: the kerb, a lane line, street lamps and a yellow cab in front
d.line(0,560,800,560,W1); d.line(0,568,800,568,W3)
for x in range(20,800,70): d.line(x,586,x+36,586,W3)
for lx in (90,700):
    d.line(lx,560,lx,470,W2); d.path(f"M{lx} 470q0 -10 14 -10",W2); d.rect(lx+10,458,14,6,W3); d.occ_poly([(lx-3,560),(lx-3,468),(lx+26,456),(lx+26,466),(lx+3,472),(lx+3,560)])
cab=[(520,596),(524,578),(546,576),(556,562),(604,562),(616,576),(640,580),(642,596)]
d.poly(cab,W2,True); d.occ_poly(cab+[(642,600),(520,600)]); d.rect(570,556,18,6,W3)
for wx in (544,622): d.circle(wx,597,8,W2)
d.line(558,576,612,576,W3); d.line(584,564,584,576,W3)
save(d,"new-york-empire-state-building")
