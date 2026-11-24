from lib import *
# Reference photo: File:Kaminarimon1500.jpg by ? (Public domain), https://commons.wikimedia.org/wiki/File:Kaminarimon1500.jpg
import math, random
# Drawn from a reference photo (Wikimedia Commons, Kaminarimon of Senso-ji from the street): one big
# tiled hip-and-gable roof with deep eaves and bracket sets, four columns, latticed side bays, the
# giant lantern in the central bay, a blank signboard (no text drawn), the police box on the right
# and a brick building on the left. Mapping: x = 0.81 * x + 11, y = 0.81 * y.
d=D(); rg=random.Random(8)
def T(x,y): return (0.81*x+11, 0.81*y)
def tP(pts): return [T(*p) for p in pts]
def L(x0,y0,x1,y1,w=W3): d.line(*T(x0,y0),*T(x1,y1),w)
# --- neighbours: brick building on the left, the koban on the right (back layer)
d.layer='back'
d.poly(tP([(0,520),(0,0),(120,0),(120,40),(200,40),(200,520)]),W2)
for y in range(20,520,14):
    off=(y//14)%2*12
    for x in range(off,200,24):
        if rg.random()<0.55: L(x,y,x+14,y,W4)
for x0,y0 in ((20,160),(70,160),(20,230),(70,230),(140,290),(140,340),(20,300)): d.rect(*T(x0,y0),0.81*34,0.81*36,W3)
d.rect(*T(150,370),0.81*58,0.81*150,W3); d.circle(*T(162,395),8,W3)
d.poly(tP([(5,395),(55,395),(55,520),(5,520)]),W3)            # stone pillar
d.layer='front'
d.new_layer("koban")
kb=tP([(678,615),(678,430),(700,400),(760,375),(880,372),(955,410),(960,615)])
d.poly(kb,W2,True); d.occ_poly(kb)
d.path(f"M{T(690,432)[0]} {T(690,432)[1]}Q{T(820,330)[0]} {T(820,330)[1]} {T(950,420)[0]} {T(950,420)[1]}",W2)
for k in range(1,8): x=690+k*32; L(x,432-30*math.sin(math.pi*k/8),x,450-30*math.sin(math.pi*k/8),W4)
d.rect(*T(690,432),0.81*260,0.81*22,W3); d.rect(*T(700,455),0.81*240,0.81*14,W3)
for x0 in (705,770,905): d.rect(*T(x0,478),0.81*55,0.81*120,W3)
L(770,478,770,598,W2); L(835,478,835,598,W2)
# --- the gate: columns, beams, side bays
d.new_layer("gate")
G=510
cols=[(213,240),(350,380),(607,640),(760,792)]
for x0,x1 in cols:
    d.rect(*T(x0,300),0.81*(x1-x0),0.81*(G-300),W1); d.occ_poly(tP([(x0,G),(x0,300),(x1,300),(x1,G)]))
    L(x0+(x1-x0)*0.7,305,x0+(x1-x0)*0.7,G-4,W4)
    d.rect(*T(x0-6,G-12),0.81*(x1-x0+12),0.81*12,W3)                 # base stones
    d.hatch(*T(x0+(x1-x0)*0.62,302),*T(x1,G),gap=4,w=W4,angle=84)
for y in (300,318,340,360): L(195,y,800,y,W2 if y in (300,340) else W3)
for x0,x1 in ((240,350),(640,760),(380,607)):                          # latticed transom panels
    for x in range(x0+6,x1,9): L(x,322,x,338,W4)
for x0,x1 in ((242,348),(642,758)):                                    # side bays: lattice screens
    for x in range(x0,x1,9): L(x,372,x,488,W4)
    for y in range(372,488,9): L(x0,y,x1,y,W4)
    d.hatch(*T(x0,372),*T(x1,488),gap=6,w=W4,angle=60)
    for x in range(x0,x1,8): L(x,488,x,503,W3)                         # low fence
    L(x0,488,x1,488,W3); L(x0,503,x1,503,W3)
# --- the roof: deep eaves, bracket sets, tiled slope, ridge with end tiles, gable
d.new_layer("roof")
eave=[(35,250),(90,262),(300,266),(600,256),(880,232),(935,188)]
def Q(p0,c,p1,n=16):
    return [((1-t)**2*p0[0]+2*(1-t)*t*c[0]+t*t*p1[0],(1-t)**2*p0[1]+2*(1-t)*t*c[1]+t*t*p1[1]) for t in [i/n for i in range(n+1)]]
left_edge=Q((150,84),(118,196),(35,250)); right_edge=Q((915,24),(902,120),(935,188))
eave_pts=Q((35,250),(400,290),(935,188),24)
roof=tP([(150,84),(915,24)]+right_edge[1:]+eave_pts[::-1][1:]+left_edge[::-1][1:-1])
d.poly(roof,W1,True); d.occ_poly(roof+tP([(35,262),(935,240)]))
d.poly(tP(Q((40,256),(400,298),(930,196),24)),W3)
# bracket band under the eaves
d.poly(tP([(40,262),(300,276),(600,268),(880,246),(925,226)]),W2)
for x in range(50,920,14):
    y=262+(x-40)*0.0+ (14 if x<300 else 12 - (x-600)*0.05 if x>600 else 10)
    yb=262+ (14 if x<300 else 6)
    L(x,(250 if x<300 else 256 - (x-600)*0.08 if x>600 else 260)+12,x,(250 if x<300 else 256-(x-600)*0.08 if x>600 else 260)+30,W4)
for x0 in (210,345,605,760):                                         # bracket clusters over the columns
    for k in range(3): d.rect(*T(x0+k*10-4,276+k*6),0.81*(36-k*10),0.81*7,W3)
# tile rows from ridge to eave, sagging (concave slope)
for k in range(1,60):
    t=k/60; xr=150+(915-150)*t; yr=84+(24-84)*t
    ex,ey=eave_pts[int(t*(len(eave_pts)-1))]
    cxm,cym=(xr+ex)/2,(yr+ey)/2+16
    p0,c,p1=T(xr,yr+6),T(cxm,cym),T(ex,ey-6)
    d.path(f"M{p0[0]:.1f} {p0[1]:.1f}Q{c[0]:.1f} {c[1]:.1f} {p1[0]:.1f} {p1[1]:.1f}",W4)
for j in range(1,8):                                                  # tile courses follow the sag
    t=j/8
    a_=(150+(105-150)*t,84+(212-84)*t+6*math.sin(math.pi*t)); b_=(915+(925-915)*t,24+(170-24)*t)
    m=((a_[0]+b_[0])/2,(a_[1]+b_[1])/2+t*14)
    p0,c,p1=T(*a_),T(*m),T(*b_); d.path(f"M{p0[0]:.1f} {p0[1]:.1f}Q{c[0]:.1f} {c[1]:.1f} {p1[0]:.1f} {p1[1]:.1f}",W4)
d.poly(tP([(150,78),(915,18)]),W1); d.poly(tP([(150,90),(915,30)]),W3)  # ridge
for x,y in ((150,84),(915,24)): d.poly(tP([(x-10,y+6),(x-6,y-14),(x+8,y-18),(x+10,y+6)]),W2)   # onigawara end tiles
d.poly(tP(left_edge),W2)
d.poly(tP([(140,110),(118,190)]),W4)
d.poly(tP(right_edge),W2)
# signboard (blank)
d.rect(*T(430,268),0.81*116,0.81*40,W2); d.rect(*T(436,273),0.81*104,0.81*30,W4)
# --- the lantern
d.new_layer("lantern")
cx=T(506,0)[0]; LT,LB=T(0,322)[1],T(0,478)[1]; hw=0.81*72
lan=[(cx-hw*0.72,LT+10),(cx-hw*1.0,(LT+LB)/2),(cx-hw*0.72,LB-8),(cx+hw*0.72,LB-8),(cx+hw*1.0,(LT+LB)/2),(cx+hw*0.72,LT+10)]
d.path(f"M{cx-hw*0.72} {LT+10}C{cx-hw*1.08} {LT+40} {cx-hw*1.08} {LB-40} {cx-hw*0.72} {LB-8}L{cx+hw*0.72} {LB-8}C{cx+hw*1.08} {LB-40} {cx+hw*1.08} {LT+40} {cx+hw*0.72} {LT+10}Z",W1)
d.occ_poly(lan)
d.rect(cx-hw*0.75,LT,hw*1.5,12,W2); d.hatch(cx-hw*0.75,LT,cx+hw*0.75,LT+12,gap=3,w=W4)
d.rect(cx-hw*0.8,LB-10,hw*1.6,14,W2); d.hatch(cx-hw*0.8,LB-10,cx+hw*0.8,LB+4,gap=3,w=W4)
d.rect(cx-hw*0.5,LB+4,hw,9,W2); d.circle(cx,LB+18,3,W3)
for k in range(1,14):
    y=LT+12+k*(LB-LT-22)/14; t=abs(y-(LT+LB)/2)/((LB-LT)/2); w_=hw*(1.04-0.3*t*t)
    d.path(f"M{cx-w_} {y}Q{cx} {y+4} {cx+w_} {y}",W4)
d.rect(cx-hw*0.4,LT+26,hw*0.8,LB-LT-56,W4)                            # blank panel (no characters)
d.hatch(cx+hw*0.3,LT+12,cx+hw*1.05,LB-10,gap=4,w=W4,angle=78,clip=inside(lan))
d.line(cx,T(0,300)[1],cx,LT,W3)
# --- street: kerb, pavement, a lamp post on the left
d.new_layer("street")
L(0,G,960,G,W1)
for y in (625,660,690): L(0,y,960,y,W3 if y==690 else W4)
for x in range(0,960,40): L(x,625,x-10,690,W4)
for x0 in (0,225,505,700):
    L(x0,604,x0+210,604,W3); L(x0,640,x0+210,640,W4)
    for x in (x0,x0+105,x0+210): L(x,604,x,676,W3)
lx=115
L(lx-3,640,lx-3,375,W2); L(lx+3,640,lx+3,375,W2)
d.poly(tP([(lx-14,375),(lx-10,352),(lx+10,352),(lx+14,375)]),W2,True); d.rect(*T(lx-6,340),0.81*12,0.81*12,W3)
d.poly(tP([(920,30),(940,30),(946,62),(914,62)]),W2,True); L(930,62,930,80,W3); L(930,80,960,80,W3)   # lamp at the gate corner
d.bird(*T(560,60)); d.bird(*T(590,50),0.7)
save(d,"tokyo-senso-ji")
