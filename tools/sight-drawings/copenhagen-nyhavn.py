from lib import *
# Reference photo: File:Colourful façades - Nyhavn (Panorama) (34784192335).jpg by Jorge Láscar from Melbourne, Australia (CC BY 2.0), https://commons.wikimedia.org/wiki/File:Colourful_fa%C3%A7ades_-_Nyhavn_(Panorama)_(34784192335).jpg
# The north side of Nyhavn as a flat elevation: a row of wide, low 17th-18th century town houses, each with
# its own roof (hipped tile roofs with dormers, a baroque stepped gable, a mansard), shopfronts and
# parasols on the quay, the timber quay wall, moored wooden ships and the canal.
import random
d=D(); rg=random.Random(11)
Q=430          # quay level (foot of the facades)
W_=470         # water line
# (x0, x1, eave y, roof, floors, cols, shade)
houses=[(0,100,288,'hip',4,4,2),(100,228,266,'hip',4,6,1),(228,338,284,'hip',4,5,0),(338,404,276,'gable',4,3,3),
        (404,528,262,'hip',4,6,2),(528,616,282,'hip',4,4,0),(616,700,294,'hip',3,4,1),(700,800,300,'mansard',3,5,0)]
for i,(x0,x1,ev,roof,fl,cols,sh) in enumerate(houses):
    d.new_layer(f"h{i}")
    w=x1-x0; body=[(x0,Q),(x0,ev),(x1,ev),(x1,Q)]
    d.poly(body,W1,True); d.occ_poly(body)
    d.line(x0-2,ev,x1+2,ev,W2); d.line(x0,ev+6,x1,ev+6,W4)                    # cornice
    if roof=='hip':
        rt=ev-w*0.32
        r=[(x0-3,ev),(x0+w*0.16,rt),(x1-w*0.16,rt),(x1+3,ev)]; d.poly(r,W1,True); d.occ_poly(r)
        for k in range(1,int(w/7)): x=x0+k*7; d.line(x,ev-1,x+(x-(x0+x1)/2)*-0.05,max(rt+1,ev-(ev-rt)*(1 if x0+w*0.16<x<x1-w*0.16 else 0.6)),W4)
        nd=max(1,cols-2)
        for k in range(nd):                                                     # dormers
            dx=x0+w*(k+1)/(nd+1); dw=min(16,w/(nd+2))
            d.poly([(dx-dw/2,ev-2),(dx-dw/2,ev-(ev-rt)*0.62),(dx,ev-(ev-rt)*0.82),(dx+dw/2,ev-(ev-rt)*0.62),(dx+dw/2,ev-2)],W2,True)
            d.rect(dx-dw*0.28,ev-(ev-rt)*0.58,dw*0.56,(ev-rt)*0.42,W4)
        d.rect(x0+w*0.7,rt-16,9,16,W2); d.line(x0+w*0.7-2,rt-16,x0+w*0.7+11,rt-16,W3)   # chimney
    elif roof=='gable':
        # baroque stepped gable with volutes and a round window, like the blue house
        g=[(x0,ev),(x0+w*0.1,ev-14),(x0+w*0.2,ev-14),(x0+w*0.2,ev-40),(x0+w*0.32,ev-48),(x0+w*0.32,ev-72),(x0+w*0.4,ev-80),
           ((x0+x1)/2,ev-96),(x1-w*0.4,ev-80),(x1-w*0.32,ev-72),(x1-w*0.32,ev-48),(x1-w*0.2,ev-40),(x1-w*0.2,ev-14),(x1-w*0.1,ev-14),(x1,ev)]
        d.poly(g,W1,True); d.occ_poly(g)
        d.circle((x0+x1)/2,ev-62,6,W3); d.rect((x0+x1)/2-7,ev-38,14,20,W3)
        for sx in (x0+w*0.2,x1-w*0.2): d.circle(sx,ev-16,3,W4)
        d.line((x0+x1)/2,ev-96,(x0+x1)/2,ev-108,W3)
    else:   # mansard
        r=[(x0-3,ev),(x0+5,ev-28),(x1-5,ev-28),(x1+3,ev)]; d.poly(r,W1,True); d.occ_poly(r)
        r2=[(x0+5,ev-28),(x0+w*0.2,ev-40),(x1-w*0.2,ev-40),(x1-5,ev-28)]; d.poly(r2,W2,True); d.occ_poly(r2)
        for k in range(cols): dx=x0+w*(k+0.5)/cols; d.arch(dx-5,ev-4,10,18,W3)
    # windows: framed, with glazing bars and sills
    fh=(Q-ev-60)/fl; ww=w/cols*0.46
    for f in range(fl):
        for c in range(cols):
            wx=x0+w*(c+0.5)/cols-ww/2; wy=ev+14+f*fh
            d.rect(wx,wy,ww,fh*0.62,W3); d.line(wx+ww/2,wy,wx+ww/2,wy+fh*0.62,W4); d.line(wx,wy+fh*0.28,wx+ww,wy+fh*0.28,W4)
            d.line(wx-2,wy+fh*0.62+3,wx+ww+2,wy+fh*0.62+3,W4)
    for f in range(1,fl): d.line(x0,ev+8+f*fh,x1,ev+8+f*fh,W4)                # string courses
    # ground floor: shop windows, door, sign band (blank)
    gy=Q-46; d.line(x0,gy,x1,gy,W3); d.rect(x0+w*0.15,gy-14,w*0.7,9,W4)
    d.rect(x0+6,gy+6,w*0.4,26,W4); d.rect(x1-w*0.3,gy+4,w*0.2,42,W3)
    # paint colour as tone
    pat={1:(7,60),2:(9,90),3:(5,35)}.get(sh)
    if pat: d.hatch(x0+1,ev+7,x1-1,gy-1,gap=pat[0],w=W4,angle=pat[1])
# --- parasols and café on the quay
d.new_layer("cafe")
for cx in range(40,560,58):
    r=26; d.path(f"M{cx-r} {Q-6}Q{cx} {Q-24} {cx+r} {Q-6}Z",W2); d.occ_poly([(cx-r,Q-6),(cx,Q-22),(cx+r,Q-6)]); d.line(cx,Q-6,cx,Q+2,W3)
d.line(0,Q,800,Q,W1)
# --- the quay wall: timber fender planks, posts, a ladder
d.new_layer("quay")
d.rect(0,Q,560,W_-Q,W2); d.occ_poly([(0,Q),(560,Q),(560,W_),(0,W_)])
for y in range(Q+8,W_,8): d.line(0,y,560,y,W4)
for x in range(10,560,34): d.rect(x,Q,6,W_-Q,W3)
d.line(150,Q,150,W_,W3); d.line(160,Q,160,W_,W3)
for y in range(Q+6,W_,8): d.line(150,y,160,y,W4)
# --- ships moored in the canal (right side): two wooden sailing ships with masts and rigging
d.new_layer("ships")
def ship(x0,x1,mast_h,masts):
    deck=W_-8
    hull=[(x0,deck-18),(x1+20,deck-24),(x1,W_+8),(x0+12,W_+8)]
    d.poly(hull,W1,True); d.occ_poly(hull+[(x0,deck-30),(x1+20,deck-30)])
    d.line(x0+4,deck-8,x1+12,deck-12,W4); d.line(x0+8,W_,x1+4,W_-2,W4)
    for k in range(1,int((x1-x0)/14)): x=x0+k*14; d.line(x,deck-18-k*0.4,x,deck-26-k*0.4,W4)
    ms=[x0+(x1-x0)*(0.3+0.4*i) for i in range(masts)]; tops=[]
    for i,mx in enumerate(ms):
        top=deck-mast_h+i*24; tops.append((mx,top)); d.line(mx,deck-20,mx,top,W2)
        for yy,hw in ((top+mast_h*0.35,24),(top+mast_h*0.15,16)):
            d.line(mx-hw,yy,mx+hw,yy,W3); d.path(f"M{mx-hw} {yy}q{hw} 6 {2*hw} 0",W4)
        for dx in (-22,-12,12,22): d.line(mx,top+mast_h*0.1,mx+dx,deck-22,W4)
    d.line(x1+20,deck-24,x1+70,deck-60,W2); d.line(x1+70,deck-60,*tops[-1],W4); d.line(*tops[0],x0-4,deck-20,W4)
    if masts>1: d.line(*tops[0],*tops[1],W4)
ship(560,680,300,2); ship(690,760,240,1)
d.rect(260,W_-4,120,10,W3)                                                     # a small motor launch
# --- the canal with broken reflections of the facades
d.layer='back'; water(d,W_+2,600,seed=5,density=1.2)
d.new_layer("refl")
for x0,x1,ev,*_ in houses[:5]:
    for k in range(4): y=W_+14+k*13; d.line(x0+6+rg.uniform(0,6),y,x1-6-rg.uniform(0,6),y,W3 if k<2 else W4)
d.cloud(60,70,1.1); d.cloud(520,50,1.0); d.bird(640,120); d.bird(662,110,0.7)
save(d,"copenhagen-nyhavn")
