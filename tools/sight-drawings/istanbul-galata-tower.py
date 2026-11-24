from lib import *
# Reference photo: File:Istanbul asv2020-02 img48 Galata Tower.jpg by A.Savin (FAL), https://commons.wikimedia.org/wiki/File:Istanbul_asv2020-02_img48_Galata_Tower.jpg
import math
# Drawn from a reference photo (Wikimedia Commons, see the reference line above),
# proportions measured from it: y = 22 + (y_photo - 45) * 0.47.
d=D(); cx=400
def hwb(y): return 74+(y-342)*0.026          # body tapers slightly toward the top
BODY_T, BODY_B = 342, 600
# --- the body: rubble stone cylinder
body=[(cx-hwb(y),y) for y in range(BODY_T,BODY_B+1,6)]+[(cx+hwb(y),y) for y in range(BODY_B,BODY_T-1,-6)]
d.poly([(cx-hwb(y),y) for y in range(BODY_T,BODY_B+1,6)],W1); d.poly([(cx+hwb(y),y) for y in range(BODY_T,BODY_B+1,6)],W1)
d.occ_poly(body)
clipb=lambda x,y: abs(x-cx)<hwb(y)-3 and BODY_T+14<y<BODY_B
rubble(d,clipb,cx-90,BODY_T+14,cx+90,BODY_B,seed=3)
for y in (400,470,530): d.path(f"M{cx-hwb(y)} {y}Q{cx} {y+8} {cx+hwb(y)} {y}",W4)       # brick lacing courses
d.hatch(cx+hwb(BODY_T)*0.4,BODY_T,cx+hwb(BODY_B),BODY_B,gap=5,w=W4,angle=82,clip=lambda x,y: cx+hwb(y)*0.4<x<cx+hwb(y)-2 and y>BODY_T+12)
# small arched windows: a ring just under the corbel band, two larger ones below, a few loops lower
def win(dx,y,w,h,heavy=False):
    sc=math.cos(math.asin(max(-0.95,min(0.95,dx/hwb(y))))); ww=w*sc
    d.arch(cx+dx-ww/2,y,ww,h,W2 if heavy else W3); d.hatch(cx+dx-ww/2+1,y-h+ww/2,cx+dx+ww/2-1,y-1,gap=3,w=W4)
for dx in (-64,-36,-12,12,36,62): win(dx,362,6,11)
win(-14,396,11,20,True); win(44,394,11,20,True)
for dx,y in ((-50,452),(20,488),(-20,540)): win(dx,y,6,11)
# --- corbel band (heavy moulding) with corbels
def ring(y,hw_,w=W2,sag=7):
    d.path(f"M{cx-hw_} {y}Q{cx} {y+2*sag} {cx+hw_} {y}",w)
ring(330,78,W1); ring(336,77,W3); ring(342,76,W2)
for k in range(-7,8):
    a=k/7*1.3; x=cx+77*math.sin(a); y=337+7*math.cos(a)
    d.line(x,y,x,y+5,W4)
# --- the loggia: six deep relieving arches over narrow arched windows, piers between
LT, LB = 274, 330
d.line(cx-75,LB,cx-75,LT,W1); d.line(cx+75,LB,cx+75,LT,W1)
d.occ_poly([(cx-80,LB+4),(cx-80,LT-60),(cx+80,LT-60),(cx+80,LB+4)])
for k in range(-3,3):
    a0,a1=(k+0.1)/3.2*1.35,(k+0.9)/3.2*1.35
    x0,x1=cx+74*math.sin(a0),cx+74*math.sin(a1); w_=x1-x0; yb=LB-2+5*math.cos((a0+a1)/2)
    d.arch(x0,yb,w_,LB-LT-4,W2)                                 # relieving arch
    d.hatch(x0+1,LT+w_/2,x1-1,yb-30,gap=6,w=W4,angle=75)          # its shadowed recess
    iw=w_*0.42; d.arch((x0+x1)/2-iw/2,yb-2,iw,30,W3)              # window
    d.line((x0+x1)/2,yb-26,(x0+x1)/2,yb-4,W4)
ring(LT,75,W3)
# --- balcony: projecting slab on brackets, iron railing
ring(266,82,W1); ring(272,81,W3)
for k in range(-8,9):
    a=k/8*1.4; x=cx+80*math.sin(a); y=272+7*math.cos(a); d.path(f"M{x} {y}l{-2*math.sin(a)} 6",W4)
d.line(cx-82,266,cx-82,254,W2); d.line(cx+82,266,cx+82,254,W2)
ring(254,82,W2)
for k in range(-14,15):
    a=k/14*1.42; x=cx+82*math.sin(a); y=254+7*math.cos(a); d.line(x,y,x,y+12,W4)
for k in range(-7,7):
    a=(k+0.5)/7*1.42; x=cx+82*math.sin(a); y=258+7*math.cos(a); d.path(f"M{x-4} {y+4}q4 -6 8 0",W4)  # railing scrolls
# --- drum and cornice
d.line(cx-68,254,cx-68,236,W2); d.line(cx+68,254,cx+68,236,W2)
for k in range(-6,7):
    a=k/6*1.3; x=cx+67*math.sin(a); d.arch(x-3,250+4*math.cos(a),6,10,W4)
ring(236,72,W1); ring(231,70,W3)
# --- the cone: straight, steep, lead sheathed, two small dormers
AP=(cx,84)
d.poly([(cx-70,231),AP,(cx+70,231)],W1)
d.occ_poly([(cx-72,236),AP,(cx+72,236)])
for k in range(-6,7):
    if k: d.line(cx+k*70/6.4,231+7*math.cos(k/6*1.3)-1,cx+k*1.2,90,W4)
for y in range(110,231,14):                  # horizontal sheet joints
    hw_=70*(y-84)/(231-84); d.path(f"M{cx-hw_} {y}Q{cx} {y+hw_*0.08} {cx+hw_} {y}",W4)
d.hatch(cx+4,84,cx+70,231,gap=4,w=W4,angle=78,clip=inside([AP,(cx+70,231),(cx+20,234)]))
for dx,y in ((-22,178),(10,174)):
    d.rect(cx+dx,y,10,14,W3); d.poly([(cx+dx-2,y),(cx+dx+5,y-8),(cx+dx+12,y)],W3)
# finial: ball, collar, spike
d.line(cx,84,cx,22,W2); d.circle(cx,72,5,W2); d.path(f"M{cx-3} 62q3 -8 6 0",W3); d.line(cx-3,46,cx+3,46,W3)
# --- Karaköy apartment blocks in front, hiding the base (left taller, right lower)
def block(x0,x1,top,floors,roof='flat',seed=0):
    d.poly([(x0,600),(x0,top),(x1,top),(x1,600)],W2); d.occ_poly([(x0-2,600),(x0-2,top-14),(x1+2,top-14),(x1+2,600)])
    if roof=='tile': d.poly([(x0-4,top),(x0+10,top-12),(x1-10,top-12),(x1+4,top)],W2)
    else: d.line(x0-3,top+4,x1+3,top+4,W3); d.line(x0-3,top,x1+3,top,W3)
    fh=(600-top)/floors; n=max(2,int((x1-x0)/26))
    for f_ in range(floors):
        y=top+10+f_*fh
        for k in range(n):
            wx=x0+8+k*(x1-x0-12)/n; ww=(x1-x0-12)/n-10
            if y+fh*0.55<600: d.rect(wx,y,ww,fh*0.55,W4); d.line(wx-1,y+fh*0.55+2,wx+ww+1,y+fh*0.55+2,W4)
    if seed: d.hatch(x0+1,top+1,x1-1,600,gap=7,w=W4,angle=60)
block(-6,130,404,7,'tile'); block(120,214,470,5,'flat',1); block(200,292,500,4,'tile')
block(296,360,544,3,'flat'); block(440,520,520,4,'flat',1); block(508,640,486,5,'tile'); block(632,720,520,4,'flat'); block(712,806,454,6,'tile',1)
# behind the tower, low rooftops on the hill (back layer)
d.layer='back'
for x0,x1,top in ((0,120,380),(110,250,420),(560,700,430),(690,800,400)):
    d.rect(x0,top,x1-x0,600-top,W4)
    for k in range(int((x1-x0)/22)): d.rect(x0+6+k*22,top+10,8,12,W4)
d.layer='front'
for x,y,sc in ((180,150,1.2),(212,130,0.9),(606,120,1.1),(640,160,0.8),(560,190,0.7)): d.bird(x,y,sc)
save(d,"istanbul-galata-tower")
