from lib import *
# Reference photo: File:Cour Napoléon at night - Louvre.jpg by Benh LIEU SONG (CC BY 2.5), https://commons.wikimedia.org/wiki/File:Cour_Napol%C3%A9on_at_night_-_Louvre.jpg
import math
# Drawn from a reference photo (Wikimedia Commons, Cour Napoleon and the Louvre Pyramid at dusk,
# panorama). The equestrian statue in the photo is left out (no people). Mapping: x = 0.87*(x-20),
# y = 0.87*y + 160.
d=D()
S=0.87
def T(x,y): return (S*(x-20), S*y+160)
def tP(pts): return [T(*p) for p in pts]
def L(x0,y0,x1,y1,w=W3): d.line(*T(x0,y0),*T(x1,y1),w)
# --- the Sully wing behind the pyramid
d.layer='back'
d.poly(tP([(318,300),(318,232),(632,232),(632,300)]),W2,True)
d.poly(tP([(318,232),(330,222),(620,222),(632,232)]),W2)
for y in (250,275): 
    for x in range(326,630,13): d.rect(*T(x,y-12),S*6,S*14,W4)
L(318,262,632,262,W4)
for x in (348,600): d.rect(*T(x-14,212),S*28,S*20,W3)
# --- receding wings with mansard roofs, dormers and a small domed pavilion each
def wing(xn,xf,top_n,top_f,sg):
    base=300
    pts=[(xn,base),(xn,top_n),(xf,top_f),(xf,base)]
    d.poly(tP(pts),W2,True); d.occ_poly(tP(pts))
    roof=[(xn,top_n),(xn+(xf-xn)*0.02,top_n-26),(xf,top_f-12),(xf,top_f)]
    d.poly(tP(roof),W2,True); d.occ_poly(tP(roof))
    n=12
    for k in range(n):
        t=(k+0.5)/n; tt=t**1.2; x=xn+(xf-xn)*tt; yt=top_n+(top_f-top_n)*tt; h=(base-yt)
        ww=abs(xf-xn)/n*0.4*(1-0.5*tt)
        for f in (0.18,0.5,0.78): d.rect(*T(x-ww/2,yt+h*f),S*ww,S*h*0.16,W4)
        L(x,yt-2,x,yt-(26-14*tt)*0.7,W4)                                 # dormer
        d.line(*T(x-ww*0.6,yt-(26-14*tt)*0.7),*T(x+ww*0.6,yt-(26-14*tt)*0.7),W4)
    for f in (0.36,0.68): L(xn,top_n+(base-top_n)*f,xf,top_f+(base-top_f)*f,W4)
    # small pavilion part-way along
    xp=xn+(xf-xn)*0.42; yp=top_n+(top_f-top_n)*0.42; wp=abs(xf-xn)*0.18
    pv=[(xp-wp/2,base),(xp-wp/2,yp-8),(xp+wp/2,yp-8),(xp+wp/2,base)]; d.poly(tP(pv),W2,True); d.occ_poly(tP(pv))
    d.path(f"M{T(xp-wp/2,yp-8)[0]} {T(xp-wp/2,yp-8)[1]}C{T(xp-wp/2,yp-40)[0]} {T(xp-wp/2,yp-40)[1]} {T(xp-wp*0.2,yp-44)[0]} {T(xp-wp*0.2,yp-44)[1]} {T(xp,yp-46)[0]} {T(xp,yp-46)[1]}C{T(xp+wp*0.2,yp-44)[0]} {T(xp+wp*0.2,yp-44)[1]} {T(xp+wp/2,yp-40)[0]} {T(xp+wp/2,yp-40)[1]} {T(xp+wp/2,yp-8)[0]} {T(xp+wp/2,yp-8)[1]}",W2)
    d.occ_poly(tP([(xp-wp/2,yp-8),(xp-wp/2,yp-40),(xp,yp-46),(xp+wp/2,yp-40),(xp+wp/2,yp-8)]))
    for k in range(3): d.rect(*T(xp-wp*0.3+k*wp*0.22,yp+10),S*wp*0.12,S*28,W4)
d.new_layer("wings")
wing(172,320,196,232,-1); wing(788,632,196,232,1)
# --- the two corner pavilions with their square domes and sculpted pediments
d.new_layer("pavilions")
def pavilion(x0,x1):
    cx=(x0+x1)/2; w=x1-x0
    body=[(x0,300),(x0,150),(x1,150),(x1,300)]; d.poly(tP(body),W1,True); d.occ_poly(tP(body))
    for y in (205,250): L(x0,y,x1,y,W3)
    for k in range(6):                                                    # paired columns
        x=x0+w*(k+0.5)/6; L(x-3,298,x-3,252,W3); L(x+3,298,x+3,252,W3); L(x-3,248,x-3,207,W4); L(x+3,248,x+3,207,W4)
    for k in range(5):
        x=x0+w*(k+1)/6; d.arch(*T(x-6,296),S*12,S*30,W3); d.rect(*T(x-5,214),S*10,S*24,W4)
    # attic with the sculpted pediment
    d.rect(*T(x0+w*0.15,118),S*w*0.7,S*32,W2)
    d.poly(tP([(x0+w*0.12,118),(cx,90),(x1-w*0.12,118)]),W2,True)
    for k in range(-3,4): d.path(f"M{T(cx+k*11-4,116)[0]} {T(cx+k*11-4,116)[1]}q{S*4} {-S*(18-abs(k)*4)} {S*8} 0",W4)
    for x in (x0+w*0.28,x0+w*0.72): d.arch(*T(x-8,148),S*16,S*24,W3)
    # square dome: bulging slate sides, flat top, lantern and chimneys
    db,dt=118,70
    d.path(f"M{T(x0+8,db)[0]} {T(x0+8,db)[1]}C{T(x0+2,db-28)[0]} {T(x0+2,db-28)[1]} {T(x0+24,dt+6)[0]} {T(x0+24,dt+6)[1]} {T(x0+44,dt)[0]} {T(x0+44,dt)[1]}L{T(x1-44,dt)[0]} {T(x1-44,dt)[1]}C{T(x1-24,dt+6)[0]} {T(x1-24,dt+6)[1]} {T(x1-2,db-28)[0]} {T(x1-2,db-28)[1]} {T(x1-8,db)[0]} {T(x1-8,db)[1]}",W1)
    d.occ_poly(tP([(x0+8,db),(x0+2,db-28),(x0+44,dt),(x1-44,dt),(x1-2,db-28),(x1-8,db)]))
    for k in range(1,5): t=k/5; L(x0+8+(44-8)*t*0.9,db-(db-dt)*t,x1-8-(44-8)*t*0.9,db-(db-dt)*t,W4)
    for k in range(-2,3): L(cx+k*w*0.16,db,cx+k*w*0.09,dt,W4)
    d.hatch(*T(cx+w*0.1,dt),*T(x1-2,db),gap=4,w=W4,angle=78)
    for x in (x0+w*0.2,x1-w*0.2): d.rect(*T(x-5,dt-18),S*10,S*18,W3)
    d.rect(*T(cx-8,dt-14),S*16,S*14,W3); L(cx,dt-14,cx,dt-26,W3)
pavilion(25,172); pavilion(788,935)
# --- the pyramid, the pyramidions, and the paved court
d.new_layer("pyramid")
A=(478,172); Lc=(350,300); Rc=(606,300)
d.poly(tP([Lc,A,Rc]),W1,True); d.occ_poly(tP([Lc,A,Rc]))
n=18
for i in range(1,n):
    t=i/n
    a=(Lc[0]+(A[0]-Lc[0])*t,Lc[1]+(A[1]-Lc[1])*t); b=(Rc[0]+(A[0]-Rc[0])*t,Rc[1]+(A[1]-Rc[1])*t); c=(Lc[0]+(Rc[0]-Lc[0])*t,300)
    L(*a,*b,W4)
    L(*c,Rc[0]+(A[0]-Rc[0])*(1-t),Rc[1]+(A[1]-Rc[1])*(1-t),W4)
    L(*c,Lc[0]+(A[0]-Lc[0])*t,Lc[1]+(A[1]-Lc[1])*t,W4)
L(478,172,478,300,W3)
d.rect(*T(440,284),S*76,S*16,W2); d.hatch(*T(442,285),*T(514,299),gap=3,w=W4)
for x0 in (195,718):
    d.poly(tP([(x0,300),(x0+20,277),(x0+40,300)]),W2,True); d.occ_poly(tP([(x0,300),(x0+20,277),(x0+40,300)]))
    for k in range(1,4): L(x0+k*10,300,x0+20,277,W4)
d.new_layer("court")
G=T(0,302)[1]
d.line(0,G,800,G,W1)
cobbles(d,G+1,600,vx=T(478,0)[0])
for x,y in ((85,322),(478,328),(864,322)):
    a=T(x-10,y); d.rect(a[0],a[1],S*20,S*12,W2); d.line(a[0]-14,a[1]+16,a[0]+S*20+14,a[1]+16,W4)
d.cloud(150,70,1.1); d.cloud(560,50,0.9); d.bird(330,110); d.bird(352,100,0.7)
save(d,"paris-louvre")
