from lib import *
# Reference photo: File:Eiffel Tower, full-view looking toward the Trocadero, Exposition Universal, 1900, Paris, France.jpg by Unknown authorUnknown author (Public domain), https://commons.wikimedia.org/wiki/File:Eiffel_Tower,_full-view_looking_toward_the_Trocadero,_Exposition_Universal,_1900,_Paris,_France.jpg
import math
# Tower proportions taken from a reference photo (Wikimedia Commons, 1890s photochrom from the Champ
# de Mars, public domain). The background through the arch is today's Palais de Chaillot and the
# foreground today's lawns (the 1889 palace and fountain in the photo no longer exist).
# Mapping: x = 0.47 * (x - 480) + 400, y = 0.47 * (y - 90) + 16.
d=D()
S=0.47
def T(x,y): return (S*(x-480)+400, S*(y-90)+16)
def tY(y): return S*(y-90)+16
cx=400
prof=[(105,8),(200,25),(300,30),(400,35),(500,42),(600,52),(650,60),(680,66),(750,82),(820,105),(880,138),(950,165),(1000,180),(1060,205)]
def hw(y):
    for (a,wa),(b,wb) in zip(prof,prof[1:]):
        if a<=y<=b: return (wa+(wb-wa)*(y-a)/(b-a))*S
    return prof[-1][1]*S
def gap(y):   # half-width of the opening between the front legs
    if 680<=y<=820: t=(y-680)/140; return 60*S*t**0.9
    if 880<=y<=1060: return (118+(150-118)*(y-880)/180)*S
    return 0
P1T,P1B,P2T,P2B,G=820,880,650,680,1060
# --- background seen through the arch: Palais de Chaillot, trees, the Seine embankment
d.layer='back'
H=tY(1030)
d.line(0,H,800,H,W4)
for sg in (-1,1):
    d.path(f"M{cx+sg*20} {H}V{H-26}H{cx+sg*48}V{H}",W4)
    d.path(f"M{cx+sg*48} {H-14}Q{cx+sg*110} {H-20} {cx+sg*160} {H-4}",W4); d.path(f"M{cx+sg*48} {H-22}Q{cx+sg*110} {H-28} {cx+sg*160} {H-12}",W4)
    for k in range(9): x=cx+sg*(56+k*12); d.line(x,H-21+k*0.8,x,H-12+k*1.2,W4)
for x,r in ((90,40),(160,34),(640,36),(710,42),(770,30)): leafy(d,x,H-26,r,r*0.8,seed=x)
# --- the tower
d.new_layer("tower")
ys=list(range(105,1061,4))
for sg in (-1,1):
    d.poly([(cx+sg*hw(y),tY(y)) for y in ys],W1)
    d.poly([(cx+sg*(hw(y)-3),tY(y)) for y in ys if y>200],W4)
# legs between the platforms: inner edges and lattice
for sg in (-1,1):
    d.poly([(cx+sg*gap(y),tY(y)) for y in range(680,821,4)],W1)
    d.poly([(cx+sg*gap(y),tY(y)) for y in range(880,1061,4)],W1)
def lattice(y0,y1,inner,step):
    y=y0
    while y<y1:
        y2=min(y1,y+step(y))
        for sg in (-1,1):
            a0,a1=cx+sg*(hw(y)-3),cx+sg*(hw(y2)-3); b0,b1=cx+sg*(inner(y)+3),cx+sg*(inner(y2)+3)
            if abs(a0-b0)>4:
                d.line(a0,tY(y),b1,tY(y2),W4); d.line(b0,tY(y),a1,tY(y2),W4); d.line(a1,tY(y2),b1,tY(y2),W4)
                d.line((a0+b0)/2,tY(y),(a1+b1)/2,tY(y2),W4)
        y=y2
lattice(682,820,gap,lambda y: 18)
lattice(882,1058,gap,lambda y: 22)
# the upper shaft: single lattice column with X panels and horizontal ties
y=205
while y<648:
    y2=y+max(14,hw(y)/S*0.7); a,b=hw(y)-3,hw(y2)-3
    d.line(cx-a,tY(y),cx+b,tY(y2),W4); d.line(cx+a,tY(y),cx-b,tY(y2),W4); d.line(cx-b,tY(y2),cx+b,tY(y2),W4)
    y=y2
d.line(cx,tY(205),cx,tY(648),W4)
for y in (420,435): d.line(cx-hw(y)-2,tY(y),cx+hw(y)+2,tY(y),W3)       # the intermediate ring
d.rect(cx-hw(428)-3,tY(420),2*hw(428)+6,tY(435)-tY(420),W4)
# the great arch between the legs, with its lace
def archpts(lift,n=40):
    pts=[]
    for k in range(n+1):
        th=math.pi*k/n; x=cx-math.cos(th)*(gap(1060)-4-lift*0.3); y=tY(1060)-(tY(1060)-tY(905+lift))*math.sin(th)**0.62
        pts.append((x,y))
    return pts
A=archpts(0); B=archpts(18)
d.poly(A,W2); d.poly(B,W3)
for k in range(1,40): d.line(*A[k],*B[k],W4)
# first platform: deck with a frieze of arches, railing, small pavilions
pw=hw(P1B)+8
d.rect(cx-pw,tY(P1T)+6,2*pw,tY(P1B)-tY(P1T)-6,W1)
n=22
for k in range(n): x=cx-pw+3+k*(2*pw-6)/n; d.arch(x,tY(P1B)-3,(2*pw-6)/n-2,9,W4)
d.line(cx-pw,tY(845),cx+pw,tY(845),W3)
d.line(cx-pw-3,tY(P1T),cx+pw+3,tY(P1T),W2)
for k in range(40): x=cx-pw+k*(2*pw)/39; d.line(x,tY(P1T),x,tY(P1T)+6,W4)
for k in range(9): x=cx-pw+12+k*(2*pw-24)/8; d.path(f"M{x-7} {tY(P1T)}q7 -8 14 0",W3)   # crown of small domes
# second platform
qw=hw(P2B)+5
d.rect(cx-qw,tY(P2T)+4,2*qw,tY(P2B)-tY(P2T)-4,W1)
for k in range(12): x=cx-qw+k*2*qw/12; d.line(x,tY(P2T)+4,x+2*qw/24,tY(P2B),W4)
d.line(cx-qw-2,tY(P2T),cx+qw+2,tY(P2T),W2)
for k in range(20): x=cx-qw+k*2*qw/19; d.line(x,tY(P2T),x,tY(P2T)+4,W4)
# summit: campanile, lantern, flagstaff
d.rect(cx-hw(200)-2,tY(195),2*hw(200)+4,5,W2)
d.rect(cx-11,tY(150),22,tY(195)-tY(150),W2)
for k in range(4): d.line(cx-8+k*5.3,tY(155),cx-8+k*5.3,tY(190),W4)
d.path(f"M{cx-12} {tY(150)}Q{cx} {tY(118)} {cx+12} {tY(150)}",W2)
d.rect(cx-4,tY(118),8,8,W3); d.line(cx,tY(118),cx,tY(90)-2,W2)
# masonry feet
for sg in (-1,1):
    xo,xi=cx+sg*(hw(G)+6),cx+sg*(gap(G)-6); a,b=min(xo,xi),max(xo,xi)
    d.rect(a,tY(G)-8,b-a,12,W2); d.line(a,tY(G)-2,b,tY(G)-2,W4)
d.occ_poly([(cx+sg*hw(y),tY(y)) for sg in (-1,) for y in ys]+[(cx+hw(y),tY(y)) for y in ys[::-1]])
# --- trees and the Champ de Mars lawns
d.new_layer("ground")
for x,r in ((40,44),(110,38),(178,30),(620,32),(690,40),(760,44)):
    tree(d,x,tY(1068),r*1.2,r)
G2=tY(1068)
d.line(0,G2,800,G2,W1)
for sg in (-1,1):
    lawn=[(cx+sg*40,G2+4),(cx+sg*380,G2+4),(cx+sg*420,600),(cx+sg*90,600)]
    d.poly(lawn,W2)
    y=G2+10; k=0
    while y<600:
        t=(y-G2)/(600-G2); d.line(cx+sg*(40+50*t+6),y,cx+sg*(380+40*t-4),y,W4); y+=5+k*1.5; k+=1
d.line(cx-40,G2+4,cx-90,600,W3); d.line(cx+40,G2+4,cx+90,600,W3)
d.cloud(70,90,1.2); d.cloud(600,70,1.0); d.bird(230,120); d.bird(252,110,0.7)
save(d,"paris-eiffel-tower")
