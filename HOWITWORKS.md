ok so for NFT #979 https://hologramxyz.s3.amazonaws.com/partnerships/MEGAETH/metadata/979 returns

{"name":"Fluffle #1426","image":"https://hologramxyz.s3.amazonaws.com/partnerships/MEGAETH/2d/l1/tribe29_hair1_ID1426_skin4_eyeball9_eyeliner23_eyebrow29.png","attributes":[],"type":"3d","format":"vrm","model_url":"https://hologramxyz.s3.amazonaws.com/partnerships/MEGAETH/3d/tribe29_hair1_ID1426_skin4_eyeball9_eyeliner23_eyebrow29.vrm"}

the filename is tribe29_hair1_ID1426_skin4_eyeball9_eyeliner23_eyebrow29

in model name you see ID1426

in the json file test.json 1426 is

"1426": {
"tribe": 29,
"skin": 4,
"hair": 1,
"eyeball": 9,
"eyeliner": 23,
"eyebrow": 29,
"head": 34,
"ear": -1,
"face": -1,
"tribe_display_name": "Innocent",
"skin_display_name": "Moonstone",
"hair_display_name": "Burgundy Curls",
"eyeball_display_name": "Light brown eye",
"eyeliner_display_name": "lower lash",
"eyebrow_display_name": -1,
"head_display_name": "Sacred Halo",
"ear_display_name": -1,
"face_display_name": -1
},

we have 4 possible extra traits other than the main model we have to load

{
"": {
"model": "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/3d/ear/",
"thumbnail": "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/ear/"
},
"face": {
"model": "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/3d/face/",
"2d": "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/face/"
},
"head": {
"model": "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/3d/head/",
"thumbnail": "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/head/"
},
"tribe": {
"model": "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/3d/tribe_clothes/",
"thumbnail": "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/clothes/"
}
}

for the previous example

MEGAETH/3d/ear/ -> none because -1

MEGAETH/3d/face/ -> none because -1

MEGAETH/3d/head/ -> 34

MEGAETH/3d/tribe_clothes/ -> 29

so in total we load base model, head and clothes
