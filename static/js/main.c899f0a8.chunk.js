(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{108:function(e,t,n){e.exports=n(289)},113:function(e,t,n){},114:function(e,t,n){},115:function(e,t,n){},116:function(e,t,n){},284:function(e,t,n){},285:function(e,t,n){},289:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(46),i=n.n(r),s=(n(113),n(114),n(102)),c=n(17),l=n(9),u=n(18),h=n(19),d=n(12),p=n(20),m=(n(115),function(e){function t(){return Object(c.a)(this,t),Object(u.a)(this,Object(h.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.col,a=t.row,r="gray"!==this.props.color?"node-visited":"";return o.a.createElement("div",{id:"node-".concat(a,"-").concat(n),className:"node ".concat(r),style:{backgroundColor:this.props.color},onMouseDown:function(t,n){return e.props.onMouseDown(e.props.row,e.props.col)},onMouseMove:function(t,n){return e.props.onMouseMove(e.props.row,e.props.col)}})}}]),t}(a.Component)),g=(n(116),function(e){function t(e){var n;return Object(c.a)(this,t),(n=Object(u.a)(this,Object(h.a)(t).call(this,e))).handleMouseDown=n.handleMouseDown.bind(Object(d.a)(n)),n.handleMouseMove=n.handleMouseMove.bind(Object(d.a)(n)),n}return Object(p.a)(t,e),Object(l.a)(t,[{key:"handleMouseDown",value:function(e,t){this.props.childMouseDown(this.props.row_id,this.props.col_id,e,t)}},{key:"handleMouseMove",value:function(e,t){this.props.childMouseMove(this.props.row_id,this.props.col_id,e,t)}},{key:"render",value:function(){var e=this;return o.a.createElement("div",{className:"cube"},this.props.col.map((function(t,n){return o.a.createElement("div",{key:"div-".concat(n)},t.map((function(t,a){return o.a.createElement(m,{key:"node-".concat(n,"-").concat(a),col:a,color:t.color,onMouseDown:e.handleMouseDown,onMouseMove:e.handleMouseMove,row:n})})))})))}}]),t}(a.Component)),f=n(103),v=n(299),w=n(301),C=n(66),b=n.n(C),M=n(104),y=n.n(M),j=(n(283),n(284),function(e){function t(){var e,n;Object(c.a)(this,t);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(n=Object(u.a)(this,(e=Object(h.a)(t)).call.apply(e,[this].concat(o)))).state={src:null,crop:{unit:"%",width:30,aspect:16/9}},n.onSelectFile=function(e){if(e.target.files&&e.target.files.length>0){var t=new FileReader;t.addEventListener("load",(function(){return n.setState({src:t.result})})),t.readAsDataURL(e.target.files[0])}},n.onImageLoaded=function(e){n.imageRef=e},n.onCropComplete=function(e){n.makeClientCrop(e)},n.onCropChange=function(e,t){n.setState({crop:e})},n}return Object(p.a)(t,e),Object(l.a)(t,[{key:"makeClientCrop",value:function(e){var t;return b.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:if(!(this.imageRef&&e.width&&e.height)){n.next=5;break}return n.next=3,b.a.awrap(this.getCroppedImg(this.imageRef,e,"newFile.jpeg"));case 3:t=n.sent,this.setState({croppedImageUrl:t});case 5:case"end":return n.stop()}}),null,this)}},{key:"getCroppedImg",value:function(e,t,n){var a=this,o=document.createElement("canvas"),r=e.naturalWidth/e.width,i=e.naturalHeight/e.height;return o.width=t.width,o.height=t.height,o.getContext("2d").drawImage(e,t.x*r,t.y*i,t.width*r,t.height*i,0,0,t.width,t.height),new Promise((function(e,t){o.toBlob((function(t){t?(t.name=n,window.URL.revokeObjectURL(a.fileUrl),a.fileUrl=window.URL.createObjectURL(t),e(a.fileUrl)):console.error("Canvas is empty")}),"image/jpeg")}))}},{key:"render",value:function(){var e=this.state,t=e.crop,n=e.croppedImageUrl,a=e.src;return o.a.createElement("div",{className:"image-croper"},o.a.createElement("div",null,o.a.createElement("input",{type:"file",acfcept:"image/*",onChange:this.onSelectFile})),a&&o.a.createElement(y.a,{src:a,crop:t,ruleOfThirds:!0,onImageLoaded:this.onImageLoaded,onComplete:this.onCropComplete,onChange:this.onCropChange}),n&&o.a.createElement("img",{alt:"Crop",style:{maxWidth:"100%"},src:n}))}}]),t}(a.PureComponent)),k=(n(285),function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(u.a)(this,Object(h.a)(t).call(this))).handleChangeComplete=function(t){e.setState({currentColor:t.hex})},e.handleWidthSliderChangeComplete=function(t,n){e.setState({grid_width:n});var a=E(n,e.state.grid_height);e.setState({grid:a})},e.handleHeightSliderChangeComplete=function(t,n){e.setState({grid_height:n});var a=E(e.state.grid_width,n);e.setState({grid:a})},e.state={grid:[],mouseIsPressed:!1,currentColor:"#fff",grid_width:3,grid_height:3,image:0},e.handleMouseDown=e.handleMouseDown.bind(Object(d.a)(e)),e.handleMouseMove=e.handleMouseMove.bind(Object(d.a)(e)),e}return Object(p.a)(t,e),Object(l.a)(t,[{key:"quantizeImage",value:function(e){var t=n(286).from({green:"#009B48",red:"#B90000",blue:"#0045AD",orange:"#FF5900",white:"#FFFFFF",yellow:"#ff0"});return console.log(t("#009B48")),console.log(t("#ffe")),t("#009B48").value}},{key:"componentDidMount",value:function(){var e=E(this.state.grid_width,this.state.grid_height);this.setState({grid:e})}},{key:"handleMouseDown",value:function(e,t,n,a){var o=D(this.state.grid,e,t,n,a,this.state.currentColor);this.setState({grid:o,mouseIsPressed:!0})}},{key:"handleMouseMove",value:function(e,t,n,a){if(this.state.mouseIsPressed){var o=D(this.state.grid,e,t,n,a,this.state.currentColor);this.setState({grid:o})}}},{key:"handleMouseUp",value:function(){this.setState({mouseIsPressed:!1})}},{key:"render",value:function(){var e=this;return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{style:{height:"100px"}}),o.a.createElement("div",{className:"grid",onMouseUp:function(){return e.handleMouseUp()}},this.state.grid.map((function(t,n){return o.a.createElement("div",{key:n},t.map((function(a,r){return o.a.createElement(g,{key:"cube-".concat(n,"-").concat(r),row_id:n,col_id:r,row:t,col:a,childMouseDown:e.handleMouseDown,childMouseMove:e.handleMouseMove})})))}))),o.a.createElement("br",null),o.a.createElement("div",null,o.a.createElement(f.TwitterPicker,{colors:["#009B48","#B90000","#0045AD","#FF5900","#FFFFFF","#FFD500"],color:this.state.currentColor,onChangeComplete:this.handleChangeComplete})),o.a.createElement("br",null),o.a.createElement(v.a,{id:"discrete-slider",gutterBottom:!0},"Width"),o.a.createElement(w.a,{defaultValue:3,"aria-labelledby":"discrete-slider",onChangeCommitted:this.handleWidthSliderChangeComplete,valueLabelDisplay:"auto",step:1,marks:!0,min:1,max:10}),o.a.createElement(v.a,{id:"discrete-slider",gutterBottom:!0},"Height"),o.a.createElement(w.a,{defaultValue:3,"aria-labelledby":"discrete-slider",onChangeCommitted:this.handleHeightSliderChangeComplete,valueLabelDisplay:"auto",step:1,marks:!0,min:1,max:10}),o.a.createElement(j,null))}}]),t}(a.Component)),E=function(e,t){for(var n=[],a=0;a<t;a++){for(var o=[],r=0;r<e;r++)o.push(O());n.push(o)}return n},O=function(){for(var e=[],t=0;t<3;t++){for(var n=[],a=0;a<3;a++)n.push(F(a,t));e.push(n)}return e},F=function(e,t){return{col:e,row:t,color:"gray"}},D=function(e,t,n,a,o,r){var i=e.slice(),c=i[t][n].slice(),l=c[a][o],u=Object(s.a)({},l,{color:r});return c[a][o]=u,i[t][n]=c,i};var S=function(){return o.a.createElement("div",{className:"App"},o.a.createElement(k,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(S,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[108,1,2]]]);
//# sourceMappingURL=main.c899f0a8.chunk.js.map