{
    key.
    timestamp1
    event:keydown
}

{
    key.
    timestamp
    event:keydown
}

{
    key.
    timestamp2
    event:keyup
}

keydown delay = timestamp2-1
inter key delay(keywdown)
interkey key delay (key up)

t down --- h down --- t up --- h up

t down --- t up ------------------------------------- h down --- h up

t down --- h down --- h up --- t up

interkey -down-delay
interkey-up-delay


t to h 
h to t


raw data
mean m = a
sd s = 0
3a + 0
interkey-down thresholding....
interkey-up
< 
if greater than dynamic threshold--- ignore and dont use it to update mean and sd 
[a------[-------- b c d e f]... g h i j k l]

v1 -abcd
v2  = cdef
v3 = 
...

mean sd X to Y, keydown, interkey-down, interkey-up

x-y (mean, sd,------ mean, sd) != y-x (mean, sd, mean, sd)
     (interkey-down, interkey up)

a(mean, sd), b(mean, sd)...zamean, sd)
keydown

50 25 

for every window...

a-a(mean, sd, mean, sd) a-b(mean, sd, mean, sd) a-c(mean, sd, mean, sd)...a-" "(mean, sd, mean, sd) b-a(mean, sd, mean, sd) ... " "-" "(mean, sd, mean, sd) a(mean, sd), b(mean, sd)...zamean, sd)

csv..

------------------------------

thresholding..
3*mean + 15sd