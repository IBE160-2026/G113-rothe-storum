from lib import *
# Reference photo: File:Exterior of the British Museum-London.jpg by Yair Haklai (CC BY-SA 4.0), https://commons.wikimedia.org/wiki/File:Exterior_of_the_British_Museum-London.jpg
# Overall layout also checked against File:British Museum - panoramic (20496222784).jpg (Luke Massey &
# the Greater London National Park City, CC BY 2.0); an aerial version drawn from it was not used.
# The south front seen from the forecourt: the central portico with its sculpted pediment, the long
# Ionic colonnade behind it, and the two projecting colonnaded wings on either side.
import math
d=D()
F,HY,EY=1300,430,1.7                     # focal length, horizon y, eye height (m)
def P(X,Y,Z): return (400+F*X/Z, HY-F*(Y-EY)/Z)
def column(X,Z,y0=3.0,y1=17.0,r=0.75,w=W2):
    """Ionic column at world (X,Z): plinth, fluted tapering shaft, volute capital."""
    bx,by=P(X,y0,Z); tx,ty=P(X,y1,Z); rr=F*r/Z
    sh=[(bx-rr,by-rr*0.6),(tx-rr*0.85,ty+rr*1.1),(tx+rr*0.85,ty+rr*1.1),(bx+rr,by-rr*0.6)]
    d.line(*sh[0],*sh[1],w); d.line(*sh[3],*sh[2],w)
    for k in (-0.45,0,0.45): d.line(bx+rr*k,by-rr*0.6,tx+rr*0.85*k,ty+rr*1.1,W4)
    d.rect(bx-rr*1.3,by-rr*0.6,rr*2.6,rr*0.6,W3)                          # base
    d.rect(tx-rr*1.35,ty,rr*2.7,rr*0.5,W3)                                # abacus
    for sx in (-1,1): d.circle(tx+sx*rr*1.05,ty+rr*0.85,rr*0.36,W4)       # volutes
    d.line(tx-rr*0.85,ty+rr*1.1,tx+rr*0.85,ty+rr*1.1,W4)
    d.occ_poly([(bx-rr*1.4,by),(tx-rr*1.4,ty),(tx+rr*1.4,ty),(bx+rr*1.4,by)])
def entab(X0,X1,Z,y0=17.0,y1=21.0,w=W2):
    a=P(X0,y1,Z); b=P(X1,y0,Z); d.rect(a[0],a[1],b[0]-a[0],b[1]-a[1],w)
    for t in (0.35,0.6): y=a[1]+(b[1]-a[1])*t; d.line(a[0],y,b[0],y,W4)
    y=a[1]+(b[1]-a[1])*0.18
    for x in range(int(a[0])+3,int(b[0]),max(3,int(F*0.5/Z))): d.line(x,a[1]+1,x,y,W4)   # dentils
    d.occ_poly([(a[0],a[1]),(b[0],a[1]),(b[0],b[1]),(a[0],b[1])])
ZB,ZP,ZW=150,144,126                     # main front, portico front, wing fronts
d.layer='back'
d.cloud(60,80,1.2); d.cloud(560,50,1.0); d.cloud(690,150,0.8); d.bird(250,120); d.bird(272,110,0.7)
# --- the back wall behind the main colonnade: windows with pediment heads, rusticated base
d.new_layer("wall")
a=P(-26,24,ZB+5); b=P(26,1.5,ZB+5); d.rect(a[0],a[1],b[0]-a[0],b[1]-a[1],W2)
d.occ_poly([(a[0],a[1]),(b[0],a[1]),(b[0],b[1]),(a[0],b[1])])
for X in [x+0.5 for x in range(-24,25,4)]:
    if abs(X)<6: continue
    p=P(X-0.9,13,ZB+5); q=P(X+0.9,6,ZB+5); d.rect(p[0],p[1],q[0]-p[0],q[1]-p[1],W3)
    d.line(p[0],p[1]+(q[1]-p[1])*0.5,q[0],p[1]+(q[1]-p[1])*0.5,W4); d.line((p[0]+q[0])/2,p[1],(p[0]+q[0])/2,q[1],W4)
    d.poly([(p[0]-2,p[1]-1),((p[0]+q[0])/2,p[1]-6),(q[0]+2,p[1]-1)],W4)
d.hatch(a[0],a[1],b[0],b[1],gap=7,w=W4,angle=88)
# main entablature and attic over the colonnade
d.new_layer("main")
entab(-26,26,ZB); a=P(-26,23.5,ZB); b=P(26,21,ZB); d.rect(a[0],a[1],b[0]-a[0],b[1]-a[1],W3)
for X in (-23.8,-19.8,-15.8,15.8,19.8,23.8): column(X,ZB)
st=P(-26,3,ZB); en=P(26,3,ZB); d.line(st[0],st[1],en[0],en[1],W2)
# --- the projecting wings: inner colonnades in perspective, from the back to the front
for sgn in (-1,1):
    d.new_layer(f"wing{sgn}")
    X=sgn*26
    roof=[P(X,23.5,ZB),P(X,23.5,ZW),P(X+sgn*30,23.5,ZW),P(X+sgn*30,1.5,ZW),P(X,1.5,ZW),P(X,1.5,ZB)]
    # the recessed walls behind the wing colonnades (in shadow), with tall windows
    Xw=X+sgn*3
    iw=[P(Xw,21,ZB+3),P(Xw,21,ZW+3),P(Xw,1.5,ZW+3),P(Xw,1.5,ZB+3)]; d.poly(iw,W3,True); hatch_poly(d,iw,gap=5,angle=80)
    fw=[P(X,21,ZW+3),P(X+sgn*18,21,ZW+3),P(X+sgn*18,1.5,ZW+3),P(X,1.5,ZW+3)]; d.poly(fw,W3,True); hatch_poly(d,fw,gap=6,angle=88)
    for k in range(3):
        Xc=X+sgn*(4.05+k*4.9); p=P(Xc-0.9,13,ZW+3); q=P(Xc+0.9,6,ZW+3)
        d.rect(min(p[0],q[0]),p[1],abs(q[0]-p[0]),q[1]-p[1],W3); d.poly([(min(p[0],q[0])-2,p[1]-1),((p[0]+q[0])/2,p[1]-7),(max(p[0],q[0])+2,p[1]-1)],W4)
    d.occ_poly(iw); d.occ_poly(fw)
    for Z in range(ZB-2,ZW,-4): column(X,Z)
    a=P(X,21,ZB); b=P(X,21,ZW); c=P(X,17,ZW); e=P(X,17,ZB); d.poly([a,b,c,e],W2,True); d.occ_poly([a,b,c,e])
    a2=P(X,23.5,ZB); b2=P(X,23.5,ZW); d.poly([a2,b2,b,a],W3,True); d.occ_poly([a2,b2,b,a])
    g0=P(X,3,ZB); g1=P(X,3,ZW); d.line(*g0,*g1,W2)
    # the wing front: four columns, entablature, attic
    d.new_layer(f"wingfront{sgn}")
    X0,X1=(X,X+sgn*18)
    for k in range(4): column(X0+sgn*(1.6+k*4.9),ZW,w=W2)
    entab(min(X0,X1),max(X0,X1),ZW,w=W1)
    a=P(min(X0,X1),24,ZW); b=P(max(X0,X1),21,ZW); d.rect(a[0],a[1],b[0]-a[0],b[1]-a[1],W2); d.occ_poly([(a[0],a[1]),(b[0],a[1]),(b[0],b[1]),(a[0],b[1])])
    p=P(min(X0,X1),3,ZW); q=P(max(X0,X1),0,ZW); d.rect(p[0],p[1],q[0]-p[0],q[1]-p[1],W2)
    for t in (0.33,0.66): d.line(p[0],p[1]+(q[1]-p[1])*t,q[0],p[1]+(q[1]-p[1])*t,W4)
    d.occ_poly([(p[0],p[1]),(q[0],p[1]),(q[0],q[1]),(p[0],q[1])])
# --- the central portico: eight columns, entablature, pediment with sculpture, steps
d.new_layer("portico")
for k in range(8): column(-11.9+k*3.4,ZP,w=W1 if k in (0,7) else W2)
entab(-13.4,13.4,ZP,w=W1)
L=P(-14.2,21,ZP); R=P(14.2,21,ZP); A=P(0,27,ZP)
d.poly([L,A,R],W1,True); d.occ_poly([L,A,R])
li=(L[0]+16,L[1]-3); ri=(R[0]-16,R[1]-3); ai=(A[0],A[1]+7); d.poly([li,ai,ri],W3,True)
# the sculpture group "The Progress of Civilisation": standing and reclining figures
import random; rg=random.Random(3)
for k in range(17):
    t=(k+0.5)/17; x=li[0]+(ri[0]-li[0])*t; top=li[1]-(li[1]-ai[1])*(1-abs(2*t-1))
    h=(li[1]-top)*0.72
    if h>10:
        d.circle(x,li[1]-h+3,2.2,W4); d.line(x+3,li[1]-h+8,x+6+rg.uniform(-2,3),li[1]-h+rg.uniform(-2,6),W4) if k%3==0 else None; d.path(f"M{x-3:.1f} {li[1]-h+6:.1f}Q{x-5:.1f} {li[1]-h*0.4:.1f} {x-4:.1f} {li[1]-1:.1f}L{x+4:.1f} {li[1]-1:.1f}Q{x+5:.1f} {li[1]-h*0.4:.1f} {x+3:.1f} {li[1]-h+6:.1f}",W4)
    else:
        d.path(f"M{x-7:.1f} {li[1]-1:.1f}q4 -{h:.1f} 12 -{h*0.6:.1f}",W4)
d.line(A[0],A[1],A[0],A[1]-8,W3)
# steps up to the portico
for k in range(7):
    p=P(-15-k*0.4,3-k*0.43,ZP+k*0.8); q=P(15+k*0.4,3-k*0.43,ZP+k*0.8); d.line(p[0],p[1],q[0],q[1],W3 if k%2 else W2)
p=P(-17.8,0,ZP+5.6); q=P(17.8,0,ZP+5.6); d.line(*p,*q,W2)
door=[P(-2,3,ZB+4.5),P(-2,10,ZB+4.5),P(2,10,ZB+4.5),P(2,3,ZB+4.5)]
d.layer='wall'; d.poly(door,W2,True); d.line(door[0][0],door[1][1]+6,door[2][0],door[1][1]+6,W3)
d.layer='portico'
# --- the forecourt: lawns, a paved path to the steps, the lamp standards and the railings
d.new_layer("court")
for sgn in (-1,1):
    lawn=[P(sgn*4,0,ZP+7),P(sgn*60,0,ZP+7),P(sgn*60,0,35),P(sgn*4,0,35)]
    d.poly(lawn,W3,True)
    for Z in range(ZP,36,-8): p=P(sgn*4,0,Z); q=P(sgn*60,0,Z); d.line(*p,*q,W4)
for X in (-4,4): d.line(*P(X,0,ZP+7),*P(X,0,35),W3)
for Z in (120,96,78,64,53,45,39): p=P(-4,0,Z); q=P(4,0,Z); d.line(*p,*q,W4)
def lamp(X,Z):
    b=P(X,0,Z); t=P(X,6.5,Z); s=F/Z
    d.line(b[0]-0.12*s,b[1],t[0]-0.08*s,t[1],W2); d.line(b[0]+0.12*s,b[1],t[0]+0.08*s,t[1],W2)
    d.rect(b[0]-0.35*s,b[1]-0.9*s,0.7*s,0.9*s,W3)
    for dx,dy in ((-0.9,5.4),(0.9,5.4),(0,6.9)):
        cx,cy=P(X+dx,dy,Z); d.line(t[0],t[1]+0.8*s,cx,cy+0.35*s,W3); d.circle(cx,cy,0.32*s,W2); d.occ_circle(cx,cy,0.34*s)
    d.occ_poly([(b[0]-0.4*s,b[1]),(t[0]-0.15*s,t[1]),(t[0]+0.15*s,t[1]),(b[0]+0.4*s,b[1])])
lamp(-7,60); lamp(7,60)
d.line(0,HY+F*EY/34,800,HY+F*EY/34,W2)
for x in range(0,800,10): d.line(x,HY+F*EY/34,x,HY+F*EY/34-14,W4)
d.line(0,HY+F*EY/34-14,800,HY+F*EY/34-14,W3)
d.new_layer("lamp"); lamp(-8.5,30)
d.layer='back'; cobbles(d,HY+F*EY/34+2,600,rows=8)
save(d,"london-british-museum")
