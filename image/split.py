import cv2

img=cv2.imread("wo.png",-1)
size=480
imgNumber=0
ys=[0,668,1325,1983]
for y in ys:
    for i in range(8):
        clp=img[y:y+size, size*i:size*i+size]
        cv2.imwrite("white/"+str(imgNumber)+".png", clp)
        imgNumber=imgNumber+1
