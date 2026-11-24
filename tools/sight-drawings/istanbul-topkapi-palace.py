from lib import *
# Reference photo: File:Bâb-üs Selâm.jpg by Maksym Kozlenko (CC BY-SA 4.0), https://commons.wikimedia.org/wiki/File:B%C3%A2b-%C3%BCs_Sel%C3%A2m.jpg
import math, random
# Drawn from a reference photo (Wikimedia Commons, Bab-us Selam / Gate of Salutation, frontal view).
# Mapping: x = 64 + 0.7 * x_photo, y = 0.7 * y_photo.
d=D(); G=578
rg=random.Random(4)
def X(x): return 64+0.7*x
def Y(y): return 0.7*y
# --- side walls of rubble masonry (behind the towers)
d.layer='back'
for x0,x1,top in ((0,X(118),Y(625)),(X(885),800,Y(545))):
    d.rect(x0,top,x1-x0,G-top,W2); d.line(x0,top+5,x1,top+5,W3)
    rubble(d,lambda x,y,x0=x0,x1=x1,top=top: x0<x<x1 and top+8<y<G,x0,top+8,x1,G,seed=int(x0)+1,density=0.9)
d.layer='front'
# --- the two octagonal towers
def tower(edges, flip=False):
    xl,xa,xb,xr=edges; cx=(xa+xb)/2
    top=Y(310); ring_=Y(515); cb0,cb1=Y(372),Y(410)
    d.occ_poly([(xl-6,G),(xl-6,Y(40)),(xr+6,Y(40)),(xr+6,G)])
    for x in (xl,xr): d.line(x,G,x,top,W1)
    for x in (xa,xb): d.line(x,G,x,top,W3)
    # ashlar courses: tall blocks, staggered joints
    for y in range(int(top+8),G,12):
        d.line(xl+1,y,xr-1,y,W4)
        off=((y//12)%2)*10
        for x in range(int(xl)+6+off,int(xr)-4,22): d.line(x,y,x,y+12,W4)
    # string course, slit windows
    d.line(xl-3,ring_,xr+3,ring_,W2); d.line(xl-2,ring_+4,xr+2,ring_+4,W3)
    for y in (Y(600),Y(700),Y(760)):
        for x in (cx-14,cx+16): d.line(x,y,x,y+7,W3)
    # corbelled band of small arches under the cornice, small arched windows above it
    d.line(xl,cb1,xr,cb1,W2)
    n=7; 
    for k in range(n):
        x0=xl+2+k*(xr-xl-4)/n; w_=(xr-xl-4)/n-3; d.arch(x0,cb1-1,w_,12,W3); d.line(x0+w_/2,cb1-1,x0+w_/2,cb1+6,W4)
    d.line(xl,cb0,xr,cb0,W3)
    for x in (cx-24,cx+18): d.arch(x,Y(362),12,22,W2); d.hatch(x+1,Y(362)-20,x+11,Y(362)-1,gap=3,w=W4)
    # shadowed face
    sx0,sx1=(xb,xr) if not flip else (xl,xa)
    d.hatch(sx0,top,sx1,G,gap=5,w=W4,angle=82)
    # projecting cornice and the octagonal cap
    d.poly([(xl-8,top),(xl-2,top-6),(xr+2,top-6),(xr+8,top)],W1)
    apex=(cx,Y(118))
    for x,w in ((xl+2,W1),(xa,W3),(xb,W3),(xr-2,W1)): d.line(x,top-6,*apex,w)
    for k in range(1,9):                                   # lead sheet joints
        t=k/9; y=top-6-(top-6-apex[1])*t
        d.line(xl+2+(cx-xl-2)*t,y,xr-2-(xr-2-cx)*t,y,W4)
    sh=[(xb,top-6),apex,(xr-2,top-6)] if not flip else [(xl+2,top-6),apex,(xa,top-6)]
    hatch_poly(d,sh,gap=4,angle=80)
    # gilded finial: stacked balls and a spike
    d.line(cx,apex[1],cx,apex[1]-42,W2)
    for k,r_ in enumerate((6,4.5,3.5)): d.circle(cx,apex[1]-8-k*10,r_,W3)
tower((X(115),X(150),X(255),X(295)))
tower((X(682),X(712),X(850),X(890)),flip=True)
# --- the central wall: merlons, corbel arcade, the great arch
WL_,WR_=X(278),X(694)
mb, mt = Y(500), Y(452)
d.line(WL_,mb,WR_,mb,W2)
for k in range(9):
    x0=WL_+6+k*(WR_-WL_-12)/9; w_=(WR_-WL_-12)/9-8
    d.poly([(x0,mb),(x0,mt),(x0+w_*0.3,mt),(x0+w_*0.3,mt-4),(x0+w_/2,mt-10),(x0+w_*0.7,mt-4),(x0+w_*0.7,mt),(x0+w_,mt),(x0+w_,mb)],W2)
    d.line(x0,mt+6,x0+w_,mt+6,W4)
    d.line(x0+w_/2,mt+14,x0+w_/2,mt+24,W3)                 # arrow slit
for k in range(14):
    x0=WL_+4+k*(WR_-WL_-8)/14; w_=(WR_-WL_-8)/14-3; d.arch(x0,Y(540),w_,14,W3)
    d.line(x0+w_/2,Y(540),x0+w_/2,Y(546),W4)
d.line(WL_,Y(545),WR_,Y(545),W2)
for y in range(int(Y(560)),G,12):                        # ashlar courses
    d.line(WL_,y,WR_,y,W4)
    off=((y//12)%2)*12
    for x in range(int(WL_)+8+off,int(WR_),26):
        if not (X(380)<x<X(590)): d.line(x,y,x,y+12,W4)
for x,y in ((X(330),Y(600)),(X(620),Y(600)),(X(330),Y(700)),(X(640),Y(720))): d.circle(x,y,2,W4)   # lamp hooks
# great arch: frame, deep recess, inner doorway
d.path(f"M{X(380)} {G}V{Y(640)}C{X(380)} {Y(560)} {X(590)} {Y(560)} {X(590)} {Y(640)}V{G}",W1)
d.path(f"M{X(392)} {G}V{Y(645)}C{X(392)} {Y(578)} {X(578)} {Y(578)} {X(578)} {Y(645)}V{G}",W3)
d.hatch(X(394),Y(580),X(576),Y(640),gap=5,w=W4,angle=60,clip=lambda x,y: ((x-X(485))/(X(578)-X(485)))**2+((y-Y(645))/(Y(645)-Y(585)))**2<1)
d.rect(X(452),Y(614),X(536)-X(452),Y(648)-Y(614),W2); d.rect(X(458),Y(620),X(530)-X(458),Y(642)-Y(620),W4)   # blank panel
d.circle(X(494),Y(662),7,W3); d.circle(X(494),Y(662),3,W4)
d.path(f"M{X(452)} {G}V{Y(700)}Q{X(452)} {Y(672)} {X(494)} {Y(668)}Q{X(536)} {Y(672)} {X(536)} {Y(700)}V{G}",W2)
d.path(f"M{X(462)} {G}V{Y(704)}Q{X(462)} {Y(682)} {X(494)} {Y(678)}Q{X(526)} {Y(682)} {X(526)} {Y(704)}V{G}",W3)
d.hatch(X(464),Y(682),X(524),G,gap=4,w=W4,angle=90)
for x0 in (X(418),X(545)): d.rect(x0,Y(694),X(445)-X(420),Y(736)-Y(694),W3); d.rect(x0+3,Y(698),X(445)-X(420)-6,Y(732)-Y(698),W4)
d.line(X(380),Y(640),X(392),Y(645),W3); d.line(X(590),Y(640),X(578),Y(645),W3)
# flagpole and flag on the parapet
d.line(X(481),mt,X(481),Y(362),W2); d.path(f"M{X(481)} {Y(366)}q-4 14 -2 30q2 -10 6 -14q-2 -8 -4 -16Z",W3)
# --- surroundings: bare plane tree on the left, shrub on the right, lawn and path
d.layer='front'
d.layer='back'
bare_tree(d,X(20),G,330,seed=7,spread=1.1,lean=0.3)
bare_tree(d,X(930),G,300,seed=9,spread=1.0,lean=-0.4)
d.layer='front'
for k in range(18):
    x=X(905)+k*4.5; d.path(f"M{x} {G}q{rg.uniform(-6,6)} -{rg.uniform(24,50)} {rg.uniform(-4,8)} -{rg.uniform(50,90)}",W4)
d.line(0,G,800,G,W1)
d.path(f"M{X(380)} {G}L{X(330)} 600M{X(590)} {G}L{X(640)} 600",W3)
for x in range(0,800,16):
    if not (X(340)<x<X(630)): d.path(f"M{x} 596q2 -8 -1 -12M{x+5} 596q1 -7 3 -10",W4)
d.bird(X(400),Y(250)); d.bird(X(430),Y(230),0.7)
save(d,"istanbul-topkapi-palace")
