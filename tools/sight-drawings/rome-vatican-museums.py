from lib import *
# Reference photo: File:Vatican museums, spiral staircase from above - by gnuckx (11641068154).jpg by gnuckx (CC0), https://commons.wikimedia.org/wiki/File:Vatican_museums,_spiral_staircase_from_above_-_by_gnuckx_(11641068154).jpg
import math
# Drawn from reference photos (Wikimedia Commons, the Momo double-helix staircase seen from the top
# landing at an angle): eccentric rings that drift downward as they go deeper, ornamented metal
# balustrade bands with a handrail, radial steps, the small pedestal on the floor of the well.
d=D()
R0,R1,TURNS=470,36,3.3
CX=400
def ctr(r): return 210+(R0-r)*0.5          # deeper rings sit lower in the frame
def P(r,th,ry=0.78): return (CX+r*math.cos(th), ctr(r)+r*ry*math.sin(th))
def rad(t): return R0-(R0-R1)*t**0.85
def spiral(off, dr=0.0, n=900):
    pts=[]
    for i in range(n+1):
        t=i/n; th=off+t*TURNS*2*math.pi; face=0.25+0.75*(1-math.sin(th))/2; r=rad(t)-dr*r_scale(t)*face
        pts.append((t,th,r))
    return pts
def r_scale(t): return (rad(t)/R0)
BAND=34      # balustrade band width at the top (scales with depth)
def draw_band(off):
    outer=spiral(off,0); inner=spiral(off,BAND); rail=spiral(off,5)
    d.poly([P(r,th) for t,th,r in outer if r>R1],W1)
    d.poly([P(r,th) for t,th,r in rail if r>R1],W3)
    d.poly([P(r,th) for t,th,r in inner if r>R1],W2)
    # scrollwork in the band: small circles and S-curves alternating
    for i in range(0,len(outer)-1,6):
        t,th,r=outer[i]
        if r<R1+20: break
        face=0.25+0.75*(1-math.sin(th))/2
        if face<0.55: continue
        rm=r-BAND*r_scale(t)*face*0.55; x,y=P(rm,th); s=max(1.2,6*r_scale(t)*face)
        if (i//6)%2==0: d.circle(x,y,s*0.7,W4)
        else:
            x0,y0=P(rm+s*0.8,th-0.01); x1,y1=P(rm-s*0.8,th+0.012); d.path(f"M{x0:.1f} {y0:.1f}Q{x+s:.1f} {y:.1f} {x1:.1f} {y1:.1f}",W4)
    # the dark bronze face of the balustrade, seen on the far side of each turn: dense ticks
    for i in range(0,len(outer)-1,2):
        (t,th,r),(_,_,ri)=outer[i],inner[i]
        if r<R1+14: break
        face=0.25+0.75*(1-math.sin(th))/2
        if face>0.5:
            x0,y0=P(r-6*r_scale(t),th); x1,y1=P(ri+1,th+0.004); d.line(x0,y0,x1,y1,W4)
    return outer,inner
A=draw_band(0.0); B=draw_band(math.pi)
# steps: radial treads between one band's inner edge and the next band's outer edge
def steps(inner, nxt_outer):
    # nxt_outer is the other spiral; it lies half a turn ahead, so match by angle
    for i in range(0,len(inner)-1,5):
        t,th,r=inner[i]
        if r<R1+18: break
        # radius of the next band (inward) at this angle: half a turn later in the other spiral
        tt=min(1,t+0.5/TURNS); r2=rad(tt)
        if r2>=r-2: continue
        x0,y0=P(r,th); x1,y1=P(r2+2,th); d.line(x0,y0,x1,y1,W4)
        # deeper steps are in shadow: a second line
        if t>0.45 and (i//5)%2==0:
            xm,ym=P((r+r2)/2,th+0.02); d.line(x0,y0,xm,ym,W4)
steps(A[1],B[0]); steps(B[1],A[0])
# the floor of the well with the small round pedestal
fx,fy=P(R1-6,0)[0]-R1+6, ctr(R1-6)
d.path(f"M{CX-R1} {ctr(R1)}a{R1} {R1*0.78} 0 1 0 {2*R1} 0a{R1} {R1*0.78} 0 1 0 {-2*R1} 0",W2)
d.path(f"M{CX-9} {ctr(R1)+4}a9 5 0 1 0 18 0a9 5 0 1 0 -18 0",W2)
d.path(f"M{CX-6} {ctr(R1)+4}V{ctr(R1)-10}M{CX+6} {ctr(R1)+4}V{ctr(R1)-10}",W3)
d.path(f"M{CX-7} {ctr(R1)-10}a7 4 0 1 0 14 0a7 4 0 1 0 -14 0",W3)
d.hatch(CX-R1,ctr(R1)-R1*0.7,CX+R1,ctr(R1)+R1*0.7,gap=4,w=W4,angle=45,clip=lambda x,y: ((x-CX)/R1)**2+((y-ctr(R1))/(R1*0.78))**2<1 and not (abs(x-CX)<10 and abs(y-ctr(R1))<14))
save(d,"rome-vatican-museums")
print(len(d.svg())//1024,"KB")
