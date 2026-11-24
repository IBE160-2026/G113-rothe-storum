from lib import *
# Reference photo: File:New York City (New York, USA), Statue of Liberty -- 2012 -- 6818.jpg by Dietmar Rabich (CC BY-SA 4.0), https://commons.wikimedia.org/wiki/File:New_York_City_(New_York,_USA),_Statue_of_Liberty_--_2012_--_6818.jpg
import math, random
# Drawn from a reference photo (Wikimedia Commons, the statue from the water at dusk, frontal).
# Mapping from photo pixels: x = 400 + (x - 465) * 0.46, y = 20 + (y - 100) * 0.46.
d=D(); rg=random.Random(2)
S=0.46
def T(x,y): return (400+(x-465)*S, 20+(y-100)*S)
def P(pts): return [T(*p) for p in pts]
def C(*xy):   # format a run of photo-space points for a path
    out=[]
    for i in range(0,len(xy),2): x,y=T(xy[i],xy[i+1]); out.append(f"{x:.1f} {y:.1f}")
    return " ".join(out)
# --- far: harbour horizon, faint Jersey City and Manhattan skyline, trees on the island
d.layer='back'
HY=T(0,1060)[1]
d.line(0,HY,800,HY,W4)
x=0
while x<230:
    w=rg.randint(10,22); h=rg.randint(8,46); d.rect(x,HY-h,w,h,W4); x+=w+rg.randint(1,4)
for x0 in (600,640): d.path(f"M{x0} {HY}l10 -24l14 0l-6 24M{x0+10} {HY-24}l24 -6",W4)   # container cranes
d.new_layer("trees")
leafy(d,*T(90,1040),62,30,seed=5); leafy(d,*T(860,1050),70,30,seed=6); leafy(d,*T(180,1060),40,22,seed=7)
# --- Fort Wood and the lower wall, the quay
d.new_layer("fort")
fort_top=P([(195,1065),(300,1030),(625,1030),(740,1065),(740,1112),(195,1112)])
d.poly(fort_top,W2,True); d.occ_poly(fort_top)
for x in (300,625): d.line(*T(x,1030),*T(x,1112),W3)
d.poly(P([(350,1062),(465,1030),(580,1062)]),W3)                      # the star point facing us
for x,y in ((215,1095),(250,1095),(700,1095),(665,1095)): d.rect(*T(x,y),4,5,W3)
lower=P([(-500,1112),(1500,1112),(1500,1235),(-500,1235)])
d.poly(lower,W1,True); d.occ_poly(lower)
for y in range(1125,1235,13):
    a,b=T(-500,y); c,_=T(1500,y)
    x=0
    while x<800:
        ln=rg.uniform(8,20)
        if rg.random()<0.7: d.line(x,b,x+ln,b,W4)
        x+=ln+rg.uniform(4,10)
for x,w in ((190,50),(712,50)): d.rect(*T(x,1140),w*S,40*S,W3)

qy=T(0,1235)[1]; sw=T(0,1300)[1]
d.line(0,qy,800,qy,W2)
for x in range(0,800,9): d.line(x,qy,x,qy-8,W4)
d.line(0,qy-8,800,qy-8,W3)
d.rect(0,qy+2,800,sw-qy-2,W2); d.line(0,qy+12,800,qy+12,W4)
d.layer='back'; water(d,sw+2,600,seed=3,density=1.6)
# --- pedestal (Richard Morris Hunt): base, shaft with rustication, loggia, cornice, balcony
d.new_layer("pedestal")
def rect_p(x0,y0,x1,y1,w=W2):
    pts=P([(x0,y0),(x1,y0),(x1,y1),(x0,y1)]); d.poly(pts,w,True); d.occ_poly(pts); return pts
rect_p(298,1030,632,1065,W2)
rect_p(340,1000,585,1030,W2)
base=P([(345,1000),(365,925),(560,925),(580,1000)]); d.poly(base,W1,True); d.occ_poly(base)
for y in range(935,1000,12): d.line(*T(350+(1000-y)*0.25,y),*T(575-(1000-y)*0.25,y),W4)
rect_p(365,770,560,925,W1)
for y in range(780,925,11):               # rusticated courses and corner quoins
    d.line(*T(368,y),*T(557,y),W4)
    for xq in ((370,398),(527,555)):
        d.line(*T(xq[0]+((y//11)%2)*8,y),*T(xq[0]+((y//11)%2)*8,y+11),W4)
for xs in ((398,527),):
    for x in xs: d.line(*T(x,780),*T(x,925),W3)
# loggia: three openings between four columns, the lit windows
for k in range(4): xx=405+k*36; d.line(*T(xx,790),*T(xx,852),W3); d.line(*T(xx+6,790),*T(xx+6,852),W3)
for k in range(3):
    a=T(414+k*36,795); b=T(437+k*36,848); d.rect(a[0],a[1],b[0]-a[0],b[1]-a[1],W2)
d.rect(*T(400,852),(525-400)*S,8*S,W3); d.rect(*T(400,782),(525-400)*S,8*S,W3)
d.circle(*T(462,885),6,W3)
rect_p(357,745,568,770,W2)
for x in range(360,568,8): d.line(*T(x,762),*T(x,770),W4)
rect_p(375,700,545,745,W2)
for x in range(380,545,14): d.line(*T(x,705),*T(x,740),W4)
rect_p(385,685,540,700,W2)
d.hatch(T(527,0)[0],T(0,770)[1],T(560,0)[0],T(0,925)[1],gap=4,w=W4,angle=84)
d.hatch(T(505,0)[0],T(0,700)[1],T(545,0)[0],T(0,745)[1],gap=4,w=W4,angle=84)
# --- the statue (a monument; face left blank)
d.new_layer("statue")
robe=f"M{C(396,312)}C{C(388,350,404,390,404,430)}C{C(406,480,400,560,402,610)}C{C(403,646,406,670,408,684)}L{C(528,684)}C{C(530,650,526,610,530,566)}C{C(534,524,532,494,528,472)}C{C(524,420,522,380,518,356)}C{C(512,336,502,326,488,322)}L{C(446,322)}C{C(430,318,418,304,414,292)}Z"
d.path(robe,W1)
rp=[T(396,312),T(402,430),T(402,610),T(408,684),T(528,684),T(530,566),T(528,472),T(518,356),T(488,322),T(446,322),T(414,292)]
d.occ_poly(rp)
# folds: the diagonal stola, long vertical folds below, a few curved breaks
d.path(f"M{C(398,330)}C{C(440,370,490,420,532,470)}",W2)
d.path(f"M{C(402,348)}C{C(444,392,488,436,530,488)}",W4)
for x0,x1 in ((410,412),(428,432),(447,452),(466,472),(486,494),(506,514),(522,528)):
    d.path(f"M{C(x0,430+(x0-400)*0.35)}C{C(x0-6,520,x1+4,600,x1,682)}",W3 if x0 in (428,466,506) else W4)
for y in (560,620): d.path(f"M{C(404,y)}q{8} 5 {16} 0q8 -4 16 1",W4)
d.hatch(*T(470,330),*T(540,684),gap=4,w=W4,angle=80,clip=inside(rp))
d.path(f"M{C(404,684)}q4 -6 10 0M{C(470,684)}q4 -5 10 0",W3)                       # feet / broken shackle
# raised right arm and torch
arm=f"M{C(394,312)}C{C(388,280,392,220,392,190)}L{C(390,168)}L{C(412,166)}C{C(416,200,420,260,428,296)}"
d.path(arm,W1); ap=[T(394,312),T(390,240),T(390,168),T(412,166),T(420,260),T(428,296)]; d.occ_poly(ap)
d.path(f"M{C(398,290)}C{C(402,250,404,220,404,190)}",W4)                            # sleeve fold
d.rect(*T(392,148),20*S,20*S,W2)                                                    # handle
cup=P([(378,130),(422,130),(414,148),(386,148)]); d.poly(cup,W2,True); d.occ_poly(cup)
for x in range(381,421,5): d.line(*T(x,130),*T(x+1,140),W4)
d.line(*T(376,128),*T(424,128),W3)
d.path(f"M{C(400,128)}C{C(388,118,396,104,400,96)}C{C(404,104,412,118,400,128)}Z",W2); d.path(f"M{C(400,124)}q-2 -6 0 -14",W4)
# left arm and the tablet
tab=P([(522,398),(576,384),(582,462),(540,480)]); d.poly(tab,W2,True); d.occ_poly(tab)
d.line(*T(528,404),*T(574,392),W4); d.line(*T(530,412),*T(578,400),W4)
d.path(f"M{C(520,360)}C{C(540,380,548,420,546,452)}",W2)
# head, veil of hair, crown and rays
hx,hy=T(467,304)
d.path(f"M{hx-7} {hy+9}C{hx-9} {hy-2} {hx-7} {hy-10} {hx} {hy-11}C{hx+7} {hy-10} {hx+9} {hy-2} {hx+7} {hy+9}C{hx+4} {hy+13} {hx-4} {hy+13} {hx-7} {hy+9}Z",W2)
d.occ_poly([(hx-12,hy+14),(hx-12,hy-14),(hx+12,hy-14),(hx+12,hy+14)])
d.path(f"M{hx-9} {hy-4}q-3 12 2 18M{hx+9} {hy-4}q3 12 -2 18",W4)
cx_,cy_=T(467,268)
d.path(f"M{cx_-11} {cy_+5}q11 -7 22 0",W2); d.path(f"M{cx_-11} {cy_+9}q11 -7 22 0",W3)
for k in range(5): d.rect(cx_-8+k*3.6,cy_+1,2,3,W4)
for k in range(7):
    a=math.radians(200+k*23.3); r0,r1=11,32 if k in (2,3,4) else 27
    p0=(cx_+r0*math.cos(a),cy_+r0*math.sin(a)); p1=(cx_+r1*math.cos(a),cy_+r1*math.sin(a))
    nx,ny=-math.sin(a)*1.1,math.cos(a)*1.1
    d.poly([(p0[0]+nx,p0[1]+ny),p1,(p0[0]-nx,p0[1]-ny)],W3)
d.bird(560,100); d.bird(584,88,0.7); d.cloud(600,50,1.0); d.cloud(80,90,0.9)
save(d,"new-york-statue-of-liberty")
