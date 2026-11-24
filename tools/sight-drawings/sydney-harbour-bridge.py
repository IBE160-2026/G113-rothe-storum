from lib import *
# Reference photo: File:Sydney Harbour Bridge night.jpg by Diliff (CC BY-SA 3.0), https://commons.wikimedia.org/wiki/File:Sydney_Harbour_Bridge_night.jpg
import math, random
# Drawn from a reference photo (Wikimedia Commons, Sydney Harbour Bridge from Milsons Point at night):
# an oblique view with the near granite pylons on the right, the arch rising from them and receding to
# the far pylon on the left, the deck hung from the arch, the approach truss and the CBD beyond.
# Mapping from photo pixels: x = (x - 380) * 1.4, y = y * 1.4 + 215.
d=D(); rg=random.Random(5)
def T(x,y): return ((x-380)*1.4, y*1.4+215)
def lerp(a,b,t): return a+(b-a)*t
def bez(p0,p1,p2,p3,t):
    u=1-t; return tuple(u**3*a+3*u*u*t*b+3*u*t*t*c+t**3*e for a,b,c,e in zip(p0,p1,p2,p3))
# --- far: the CBD skyline and the north shore
d.layer='back'
WL=T(0,213)[1]
for x0,x1,top in ((358,374,150),(376,392,168),(394,408,158),(410,424,182),(426,440,176),(470,500,196),(505,530,192),(560,590,198)):
    a=T(x0,top); b=T(x1,213)
    d.rect(max(0,a[0]),a[1],b[0]-max(0,a[0]),WL-a[1],W4)
    for y in range(int(a[1])+6,int(WL),7): d.line(max(0,a[0])+2,y,b[0]-2,y,W4) if rg.random()<0.5 else None
d.line(0,WL,800,WL,W3)
# --- the arch truss (drawn as two chords with verticals, diagonals and hangers)
d.new_layer("arch")
top_c=[T(465,172),T(520,68),T(690,40),T(796,96)]
bot_c=[T(470,184),T(540,96),T(690,74),T(792,190)]
deck_far, deck_near = T(445,180), T(960,104)
def deck_y(x):
    t=(x-deck_far[0])/(deck_near[0]-deck_far[0]); return lerp(deck_far[1],deck_near[1],t)
n=60
tops=[bez(*top_c,i/n) for i in range(n+1)]; bots=[bez(*bot_c,i/n) for i in range(n+1)]
d.poly(tops,W1); d.poly(bots,W1)
d.poly([(x,y+3) for x,y in tops],W4); d.poly([(x,y-3) for x,y in bots],W4)
panels=26
for k in range(panels+1):
    t=k/panels; tt=t**0.92
    a=bez(*top_c,tt); b=bez(*bot_c,tt); d.line(*a,*b,W3)
    if k<panels:
        t2=((k+1)/panels)**0.92; a2=bez(*top_c,t2); b2=bez(*bot_c,t2)
        if k%2==0: d.line(*a,*b2,W3)
        else: d.line(*b,*a2,W3)
    # hangers from the lower chord to the deck, where the chord is above it
    if b[1]<deck_y(b[0])-6: d.line(b[0],b[1],b[0],deck_y(b[0])-2,W4)
# the arch below the deck at the near end: the bearing truss down to the abutment
for k in range(4):
    x0=lerp(T(735,0)[0],T(790,0)[0],k/3); d.line(x0,deck_y(x0)+8,lerp(x0,T(792,0)[0],0.6),T(0,190)[1],W3)
d.poly([T(720,128),T(792,190)],W2)
# shading on the underside of the arch: dense ticks along the lower chord
for i in range(0,n,1):
    x,y=bots[i]; d.line(x,y,x,y+4,W4)
# --- the deck: road girder thickening toward the viewer, lamp posts along it
d.new_layer("deck")
fx,fy=deck_far; nx,ny=deck_near
th_far, th_near = 5, 22
d.poly([(fx,fy),(nx,ny),(nx,ny+th_near),(fx,fy+th_far)],W1,True); d.occ_poly([(fx,fy-2),(nx,ny-2),(nx,ny+th_near),(fx,fy+th_far)])
for k in range(1,40):
    t=k/40; x=lerp(fx,nx,t); y=lerp(fy,ny,t); h=lerp(th_far,th_near,t)
    d.line(x,y,x,y+h,W4)
    if k%2==0: d.line(x,y,x,y-lerp(4,10,t),W4)
d.line(fx,fy-4,nx,ny-10,W3)
# approach truss beyond the near pylons (right edge)
for k in range(8):
    x0=T(860+k*14,0)[0]; x1=T(874+k*14,0)[0]; yt=T(0,96)[1]; yb=T(0,140)[1]
    d.line(x0,yt,x1,yb,W3); d.line(x0,yb,x1,yt,W3); d.line(x0,yt,x0,yb,W3)
d.line(T(855,96)[0],T(0,96)[1],800,T(0,96)[1],W2); d.line(T(855,140)[0],T(0,140)[1],800,T(0,140)[1],W2)
for x in (T(880,0)[0],T(930,0)[0]): d.rect(x-6,T(0,140)[1],12,WL-T(0,140)[1],W2)
# --- the far pylon (small, left)
d.new_layer("pylons")
fp=[T(443,212),T(443,160),T(447,154),T(456,154),T(460,160),T(460,212)]; d.poly(fp,W2,True); d.occ_poly(fp)
# --- the near pylons: granite-faced, stepped tops, arched opening, ashlar courses
def pylon(xl,xr,top,base,flip=False,front=True):
    a=T(xl,base); b=T(xr,top); w=b[0]-a[0]
    pts=[(a[0],a[1]),(a[0],b[1]+14),(a[0]+w*0.1,b[1]+8),(a[0]+w*0.1,b[1]),(b[0]-w*0.1,b[1]),(b[0]-w*0.1,b[1]+8),(b[0],b[1]+14),(b[0],a[1])]
    d.poly(pts,W1,True); d.occ_poly(pts)
    for y in range(int(b[1])+20,int(a[1]),11):
        d.line(a[0],y,b[0],y,W4)
        off=((y//11)%2)*12
        for x in range(int(a[0])+8+off,int(b[0])-4,24): d.line(x,y,x,y+11,W4)
    d.line(a[0]+w*0.18,b[1]+16,a[0]+w*0.18,a[1],W3); d.line(b[0]-w*0.18,b[1]+16,b[0]-w*0.18,a[1],W3)   # corner piers
    d.rect(a[0]-3,b[1]+40,w+6,8,W2)
    if front:
        cx_=(a[0]+b[0])/2; d.arch(cx_-11,b[1]+120,22,44,W2); d.hatch(cx_-9,b[1]+82,cx_+9,b[1]+118,gap=3,w=W4)
        d.arch(cx_-11,b[1]+250,22,60,W2); d.hatch(cx_-9,b[1]+196,cx_+9,b[1]+248,gap=3,w=W4)
    sx0=b[0]-w*0.3 if not flip else a[0]; d.hatch(sx0,b[1]+14,sx0+w*0.3,a[1],gap=5,w=W4,angle=82)
pylon(855,892,50,192,front=False)
pylon(795,856,25,198)
# --- the north shore: trees, lamps, the wharf; the harbour
d.new_layer("shore")
for x,r in ((620,26),(650,20),(700,24),(745,22),(900,30)): leafy(d,*T(x,198),r,16,seed=x)
sy=T(0,212)[1]
d.line(T(600,0)[0],sy,800,sy,W2)
d.rect(T(860,0)[0],sy-24,60,24,W3); d.poly([(T(860,0)[0]-4,sy-24),(T(860,0)[0]+30,sy-38),(T(860,0)[0]+64,sy-24)],W3)
d.layer='back'; water(d,WL+3,600,seed=11,density=1.2)
for k in range(5):     # reflections of the pylons
    y=WL+10+k*12; x=T(800,0)[0]+k*3; d.line(x,y,x+70-k*8,y,W3 if k<2 else W4)
d.layer='shore'
d.cloud(100,90,1.2); d.cloud(380,60,0.9); d.bird(250,130); d.bird(272,120,0.7)
save(d,"sydney-harbour-bridge")
