let gDb
//現在の値を表示
function init(){
	gDb=new nedb({
		filename: __dirname+"/../database/database.db",
		autoload:true
	})
	let tTable=document.querySelector("#formTable tbody")
	for(t of tTable.children){
		let tData=t
		let tPropety=tData.children[0].textContent
		gDb.find({_id:tPropety},(e,doc)=>{
			tData.children[2].children[0].value=doc[0].min
			tData.children[2].children[1].value=doc[0].max
		})
	}
	let tForm=document.getElementsByTagName("form")[0]
	gDb.find({_id:"color"},(e,doc)=>{
		tForm.color.value=doc[0].color
	})
}
//設定を記憶
function setProperty(){
	let tTable=document.querySelector("#formTable tbody")
	let tPropertyNum=tTable.children.length+1
	let tSettedNum=0
	let tPropertySetted=()=>{//1つのpropertyの記録が終わった
		tSettedNum++
		if(tPropertyNum==tSettedNum)
			editEnd()
	}
	for(tData of tTable.children){
		let tPropety=tData.children[0].textContent
		let tMinValue=tData.children[2].children[0].value
		let tMaxValue=tData.children[2].children[1].value
		gDb.update({_id:tPropety},{min:tMinValue,max:tMaxValue},()=>{tPropertySetted()})
	}
	let tForm=document.getElementsByTagName("form")[0]
	gDb.update({_id:"color"},{color:tForm.color.value},()=>{tPropertySetted()})
}
function editEnd(){
	renderer.send("editEnd")
}

window.onload=()=>{
	init()
	let tStyle=getComputedStyle(document.getElementById("editor"),null)
	let tWidth=Number(tStyle.width.slice(0,-2))
	let tHeight=Number(tStyle.height.slice(0,-2))
	renderer.send("resize",{width:tWidth+40,height:tHeight+40})
}
