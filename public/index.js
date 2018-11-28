let gDb
let gProperties={}
let gImageNum=15
let gCreateTimer
//設定をロード
function loadProperty(aCallBack){
	gDb=new nedb({
		filename: __dirname+"/../database/database.db",
		autoload:true
	})
	gDb.find({},(e,doc)=>{
		for(tProperty of doc){
			gProperties[tProperty._id]=tProperty
		}
		if(aCallBack!=null)
			aCallBack()
	})
}
//指定したpropertyの設定の値を範囲内でランダムに取得
function getPropertyRandom(aProperty){
	let tProperty=gProperties[aProperty]
	return Number(tProperty.min)+(tProperty.max-tProperty.min)*Math.random()
}
//オブジェクトを降らし始める
function start(){
	create()
	let tSetNext=()=>{
		let tRate=getPropertyRandom("BirthRate")
		gCreateTimer=setTimeout(()=>{
			create()
			tSetNext()
		},1000/tRate)
	}
	tSetNext()
}
//降らせるオブジェクト生成
function createObject(){
	let tObject=document.createElement("img")
	let tImageNum=Math.floor(gImageNum*Math.random())
	let tImageColor=gProperties["color"].color
	if(tImageColor=="mix")tImageColor=(Math.random()<0.5) ? "white" : "blue"
	tObject.src=__dirname+"/../image/"+tImageColor+"/"+tImageNum+".png"
	tObject.style.width=getPropertyRandom("Size")+"px"
	tObject.style.opacity=getPropertyRandom("Opacity")
	tObject.classList.add("fallObject")
	return tObject
}
//オブジェクトを生成して降らせる
function create(){
	let tObject=createObject()
	let tSize=Number(tObject.style.width.slice(0,-2))
	tObject.style.top=-tSize+"px"
	let tLeft=screen.width*Math.random()-tSize/2
	tObject.style.left=tLeft+"px"
	document.getElementsByTagName("body")[0].appendChild(tObject)
	setTimeout(()=>{
		//落下
		let tFallSpeed=getPropertyRandom("FallSpeed")
		let tFallDuration=(screen.height+tSize)/tFallSpeed
		tObject.style.transition="all "+tFallDuration+"s 0s linear"
		tObject.style.top=screen.height+tSize+"px"
		//回転
		let tRotateSpeed=getPropertyRandom("RotateSpeed")
		tRotateSpeed=(Math.random()<0.5)?tRotateSpeed:-tRotateSpeed
		tObject.style.transform="rotateZ("+tRotateSpeed*tFallSpeed+"deg)"
		//横移動
		let tHorizontalSpeed=getPropertyRandom("HorizontalSpeed")
		tHorizontalSpeed=(Math.random()<0.5)?tHorizontalSpeed:-tHorizontalSpeed
		tObject.style.left=tLeft+tHorizontalSpeed*tFallDuration+"px"
		//削除
		setTimeout(()=>{
			tObject.remove()
		},tFallDuration*1000)
	},100)
}
window.onload=()=>{
	loadProperty(()=>{
		start()
	})
}
renderer.on("readProperty",()=>{
	loadProperty()
})
