from lib import *
# Reference photo: File:Asahi Breweries headquarters building with the Asahi Flame and Skytree at blue hour with full moon, Sumida-ku, Tokyo, Japan.jpg by Basile Morin (CC BY-SA 4.0), https://commons.wikimedia.org/wiki/File:Asahi_Breweries_headquarters_building_with_the_Asahi_Flame_and_Skytree_at_blue_hour_with_full_moon,_Sumida-ku,_Tokyo,_Japan.jpg
import math, random
# Drawn from a reference photo (Wikimedia Commons, Tokyo Skytree from across the Sumida River at dusk):
# the Skytree behind the Asahi Beer Tower and the Super Dry Hall with its golden flame, an apartment
# tower, a glass cylinder tower, the elevated expressway and the river with boats.
# Mapping: x = 0.781 * x + 25, y = 0.781 * y.
d=D(); rg=random.Random(2); k_=0.781
def T(x,y): return (k_*x+25,k_*y)
def tP(pts): return [T(*p) for p in pts]
def L(x0,y0,x1,y1,w=W3): d.line(*T(x0,y0),*T(x1,y1),w)
def R(x0,y0,x1,y1,w=W2,occ=True):
    pts=tP([(x0,y1),(x0,y0),(x1,y0),(x1,y1)]); d.poly(pts,w,True)
    if occ: d.occ_poly(pts)
# --- the Skytree (furthest back)
d.layer='back'
cx=263
def hw(y):   # half-width of the lattice by photo y
    pts=[(75,1.5),(110,2.5),(200,5),(228,7),(300,9),(355,12),(450,17),(545,23)]
    for (a,wa),(b,wb) in zip(pts,pts[1:]):
        if a<=y<=b: return wa+(wb-wa)*(y-a)/(b-a)
    return 23
for sg in (-1,1): d.poly(tP([(cx+sg*hw(y),y) for y in range(80,546,5)]),W2)
y=355
while y<540:
    y2=y+max(8,hw(y)*0.7)
    L(cx-hw(y),y,cx+hw(y2),y2,W4); L(cx+hw(y),y,cx-hw(y2),y2,W4); L(cx-hw(y),y,cx+hw(y),y,W4); y=y2
y=110
while y<225:
    y2=y+8; L(cx-hw(y),y,cx+hw(y2),y2,W4); L(cx+hw(y),y,cx-hw(y2),y2,W4); y=y2
y=252
while y<300:
    y2=y+8; L(cx-hw(y),y,cx+hw(y2),y2,W4); L(cx+hw(y),y,cx-hw(y2),y2,W4); y=y2
# Tembo Galleria and Tembo Deck
d.poly(tP([(cx-16,228),(cx-18,238),(cx-16,250),(cx+16,250),(cx+18,238),(cx+16,228)]),W2,True)
for yy in (232,240,246): L(cx-17,yy,cx+17,yy,W4)
d.poly(tP([(cx-24,300),(cx-28,318),(cx-27,340),(cx-20,350),(cx+20,350),(cx+27,340),(cx+28,318),(cx+24,300)]),W2,True)
for yy in (308,318,328,338): L(cx-27,yy,cx+27,yy,W4)
for xx in range(cx-24,cx+26,6): L(xx,318,xx,338,W4)
d.poly(tP([(cx-3,75),(cx-3,82),(cx+3,82),(cx+3,75)]),W2,True); L(cx,75,cx,62,W3)
# --- left: glass cylinder tower with the slab behind
d.new_layer("left")
R(70,340,205,555,W2)
for y in range(350,555,10): L(72,y,203,y,W4)
d.path(f"M{T(98,555)[0]} {T(98,555)[1]}V{T(98,300)[1]}Q{T(137,288)[0]} {T(137,288)[1]} {T(176,300)[0]} {T(176,300)[1]}V{T(176,555)[1]}",W1)
d.occ_poly(tP([(98,555),(98,296),(176,296),(176,555)]))
for x in range(102,176,7): L(x,304,x,553,W4)
d.hatch(*T(150,300),*T(176,555),gap=4,w=W4,angle=86)
# --- the Asahi Beer Tower: glass grid, darker side face, the 'foam' crown
d.new_layer("asahi")
R(330,205,525,540,W1)
d.poly(tP([(525,205),(570,220),(570,530),(525,540)]),W1,True); d.occ_poly(tP([(525,205),(570,220),(570,530),(525,540)]))
for y in range(215,540,10): L(332,y,523,y,W4); L(525,y,570,y+ (220-205)*(530-y)/335*0.0,W4)
for x in range(345,525,16): L(x,207,x,538,W4)
d.hatch(*T(526,205),*T(570,540),gap=4,w=W4,angle=84)
crown=[(330,210),(330,180)]
for k in range(10):
    x=330+k*20; crown+= [(x+4,166-k*2),(x+16,166-k*2)]
crown+=[(530,150),(552,165),(570,195),(570,222),(525,205)]
d.poly(tP(crown),W2,True); d.occ_poly(tP(crown+[(330,210)]))
for k in range(10):
    x=330+k*20; L(x,208,x+10,166-k*2,W4); L(x+20,208,x+10,166-k*2,W4)
L(330,192,525,178,W3)
# --- apartment tower on the right
d.new_layer("apartments")
ap=tP([(592,520),(592,245),(615,245),(615,228),(690,228),(690,240),(812,250),(812,520)])
d.poly(ap,W1,True); d.occ_poly(ap)
for y in range(258,520,12): L(594,y,810,y,W3 if y%24==6 else W4)
for x in range(612,810,22): L(x,250,x,520,W4)
L(700,240,700,520,W3)
L(662,228,662,212,W3); L(656,212,668,212,W3)
# --- Asahi Super Dry Hall with the Flamme d'Or
d.new_layer("hall")
hall=tP([(560,530),(556,440),(800,428),(790,530)])
d.poly(hall,W1,True); d.occ_poly(hall); hatch_poly(d,hall,gap=5,angle=80)
flame=f"M{T(624,420)[0]} {T(624,420)[1]}C{T(610,380)[0]} {T(610,380)[1]} {T(660,370)[0]} {T(660,370)[1]} {T(720,378)[0]} {T(720,378)[1]}C{T(790,386)[0]} {T(790,386)[1]} {T(840,378)[0]} {T(840,378)[1]} {T(875,372)[0]} {T(875,372)[1]}C{T(840,400)[0]} {T(840,400)[1]} {T(780,430)[0]} {T(780,430)[1]} {T(700,436)[0]} {T(700,436)[1]}C{T(660,440)[0]} {T(660,440)[1]} {T(632,436)[0]} {T(632,436)[1]} {T(624,420)[0]} {T(624,420)[1]}Z"
d.path(flame,W1); d.occ_poly(tP([(615,440),(615,372),(875,372),(875,440)]))
d.path(f"M{T(640,396)[0]} {T(640,396)[1]}C{T(700,384)[0]} {T(700,384)[1]} {T(780,392)[0]} {T(780,392)[1]} {T(850,384)[0]} {T(850,384)[1]}",W4)
d.circle(*T(913,362),5,W3)        # the moon
# --- the elevated expressway on piers
d.new_layer("expressway")
deck=tP([(0,548),(960,518),(960,550),(0,590)])
d.poly(deck,W1,True); d.occ_poly(deck)
L(0,580,960,543,W3); L(0,556,960,526,W4)
for x in (35,225,462,762):
    yb=660; ytop=588-(x/960)*40
    R(x-12,ytop,x+12,yb,W2)
    d.poly(tP([(x-26,ytop-2),(x+26,ytop-4),(x+14,ytop+12),(x-14,ytop+14)]),W2)
    d.hatch(*T(x+2,ytop),*T(x+12,yb),gap=4,w=W4,angle=86)
# --- riverbank, trees, boats, the Sumida
d.new_layer("bank")
for x,r_ in ((100,26),(190,22),(300,20),(560,24),(660,22),(880,24)): leafy(d,*T(x,615),r_,14,seed=x)
L(0,660,960,660,W2); L(0,668,960,668,W3)
for x in range(0,960,14): L(x,660,x,668,W4)
def boat(x0,x1,y,roof=True):
    hull=tP([(x0,y),(x1,y),(x1-10,y+14),(x0+6,y+14)]); d.poly(hull,W2,True); d.occ_poly(hull)
    if roof:
        d.rect(*T(x0+10,y-18),k_*(x1-x0-24),k_*18,W3)
        for x in range(x0+16,x1-14,12): d.rect(*T(x,y-14),k_*7,k_*8,W4)
        d.path(f"M{T(x0+6,y-18)[0]} {T(x0+6,y-18)[1]}Q{T((x0+x1)/2,y-28)[0]} {T((x0+x1)/2,y-28)[1]} {T(x1-8,y-18)[0]} {T(x1-8,y-18)[1]}",W3)
    else:
        d.rect(*T(x0+20,y-16),k_*30,k_*16,W3)
boat(195,352,660); boat(422,520,656,roof=False)
d.layer='back'; water(d,T(0,672)[1],600,seed=12,density=1.2)
for x0,x1 in ((320,340),(810,830),(140,160)):
    for k in range(5): L(x0,690+k*12,x1,690+k*12,W4)
d.layer='bank'
d.bird(*T(420,90)); d.bird(*T(445,80),0.7)
save(d,"tokyo-skytree")
