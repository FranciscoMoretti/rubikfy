(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{108:function(e,t,n){e.exports=n(289)},113:function(e,t,n){},114:function(e,t,n){},115:function(e,t,n){},116:function(e,t,n){},284:function(e,t,n){},286:function(e,t,n){},289:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(46),i=n.n(o),s=(n(113),n(114),n(66)),c=n(17),l=n(9),h=n(18),u=n(19),d=n(10),p=n(20),g=(n(115),function(e){function t(){return Object(c.a)(this,t),Object(h.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.col,a=t.row,o="gray"!==this.props.color?"node-visited":"";return r.a.createElement("div",{id:"node-".concat(a,"-").concat(n),className:"node ".concat(o),style:{backgroundColor:this.props.color},onMouseDown:function(t,n){return e.props.onMouseDown(e.props.row,e.props.col)},onMouseMove:function(t,n){return e.props.onMouseMove(e.props.row,e.props.col)}})}}]),t}(a.Component)),m=(n(116),function(e){function t(e){var n;return Object(c.a)(this,t),(n=Object(h.a)(this,Object(u.a)(t).call(this,e))).handleMouseDown=n.handleMouseDown.bind(Object(d.a)(n)),n.handleMouseMove=n.handleMouseMove.bind(Object(d.a)(n)),n}return Object(p.a)(t,e),Object(l.a)(t,[{key:"handleMouseDown",value:function(e,t){this.props.childMouseDown(this.props.row_id,this.props.col_id,e,t)}},{key:"handleMouseMove",value:function(e,t){this.props.childMouseMove(this.props.row_id,this.props.col_id,e,t)}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"cube"},this.props.col.map((function(t,n){return r.a.createElement("div",{key:"div-".concat(n),className:"cube-row"},t.map((function(t,a){return r.a.createElement(g,{key:"node-".concat(n,"-").concat(a),col:a,color:t.color,onMouseDown:e.handleMouseDown,onMouseMove:e.handleMouseMove,row:n})})))})))}}]),t}(a.Component)),f=n(103),v=n(299),w=n(301),C=n(67),b=n.n(C),M=n(104),y=n.n(M),j=(n(283),n(284),function(e){function t(){var e,n;Object(c.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(h.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={src:null,crop:{unit:"%",width:30,aspect:n.props.width/n.props.height}},n.onSelectFile=function(e){if(e.target.files&&e.target.files.length>0){var t=new FileReader;t.addEventListener("load",(function(){return n.setState({src:t.result})})),t.readAsDataURL(e.target.files[0])}},n.onImageLoaded=function(e){n.imageRef=e},n.onCropComplete=function(e){n.makeClientCrop(e)},n.onCropChange=function(e,t){n.setState({crop:e})},n}return Object(p.a)(t,e),Object(l.a)(t,[{key:"makeClientCrop",value:function(e){var t;return b.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:if(!(this.imageRef&&e.width&&e.height)){n.next=5;break}return n.next=3,b.a.awrap(this.getCroppedImg(this.imageRef,e,"newFile.jpeg"));case 3:t=n.sent,this.setState({croppedImageUrl:t});case 5:case"end":return n.stop()}}),null,this)}},{key:"getCroppedImg",value:function(e,t,a){var r=this,o=document.createElement("canvas"),i=e.naturalWidth/e.width,s=e.naturalHeight/e.height;o.width=t.width,o.height=t.height;var c=o.getContext("2d");c.drawImage(e,t.x*i,t.y*s,t.width*i,t.height*s,0,0,this.props.width,this.props.height);var l=c.getImageData(0,0,this.props.width,this.props.height).data;function h(e){var t=e.toString(16);return 1===t.length?"0"+t:t}for(var u=n(285).from({green:"#009B48",red:"#B90000",blue:"#0045AD",orange:"#FF5900",white:"#FFFFFF",yellow:"#FFD500"}),d=function(e){return"undefined"===String(e)?"undefined":u(e).value},p=[],g=0,m=0,f=l.length;g<f;g+=4,m+=1)p[m]=d("#"+h(l[g])+h(l[g+1])+h(l[g+2]));return this.props.onImageCropped(p),new Promise((function(e,t){o.toBlob((function(t){t?(t.name=a,window.URL.revokeObjectURL(r.fileUrl),r.fileUrl=window.URL.createObjectURL(t),e(r.fileUrl)):console.error("Canvas is empty")}),"image/jpeg")}))}},{key:"render",value:function(){var e=this.state,t=e.crop,n=e.croppedImageUrl,a=e.src;return t.aspect=this.props.width/this.props.height,r.a.createElement("div",{className:"image-croper"},r.a.createElement("div",null,r.a.createElement("input",{type:"file",acfcept:"image/*",onChange:this.onSelectFile})),a&&r.a.createElement(y.a,{src:a,crop:t,ruleOfThirds:!0,onImageLoaded:this.onImageLoaded,onComplete:this.onCropComplete,onChange:this.onCropChange}),n&&r.a.createElement("img",{alt:"Crop",style:{maxWidth:"100%"},src:n}))}}]),t}(a.PureComponent)),O=(n(286),function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(h.a)(this,Object(u.a)(t).call(this))).handleChangeComplete=function(t){e.setState({currentColor:t.hex})},e.handleWidthSliderChangeComplete=function(t,n){e.setState({grid_width:n});var a=E(n,e.state.grid_height);e.setState({grid:a})},e.handleHeightSliderChangeComplete=function(t,n){e.setState({grid_height:n});var a=E(e.state.grid_width,n);e.setState({grid:a})},e.handleImageCropped=function(t){e.setState({hexImg:t});var n=D(e.state.grid,e.state.grid_width,e.state.grid_height,e.state.hexImg);e.setState({grid:n})},e.state={grid:[],mouseIsPressed:!1,currentColor:"#fff",grid_width:3,grid_height:3,image:0,hexImg:[]},e.handleMouseDown=e.handleMouseDown.bind(Object(d.a)(e)),e.handleMouseMove=e.handleMouseMove.bind(Object(d.a)(e)),e.handleImageCropped=e.handleImageCropped.bind(Object(d.a)(e)),e}return Object(p.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=E(this.state.grid_width,this.state.grid_height);this.setState({grid:e})}},{key:"handleMouseDown",value:function(e,t,n,a){var r=I(this.state.grid,e,t,n,a,this.state.currentColor);this.setState({grid:r,mouseIsPressed:!0})}},{key:"handleMouseMove",value:function(e,t,n,a){if(this.state.mouseIsPressed){var r=I(this.state.grid,e,t,n,a,this.state.currentColor);this.setState({grid:r})}}},{key:"handleMouseUp",value:function(){this.setState({mouseIsPressed:!1})}},{key:"render",value:function(){var e=this;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:{height:"100px"}}),r.a.createElement("div",{className:"grid",style:{height:"".concat(this.state.grid_height/this.state.grid_width*50,"vw")},onMouseUp:function(){return e.handleMouseUp()}},this.state.grid.map((function(t,n){return r.a.createElement("div",{key:n,className:"grid-row"},t.map((function(a,o){return r.a.createElement(m,{key:"cube-".concat(n,"-").concat(o),row_id:n,col_id:o,row:t,col:a,childMouseDown:e.handleMouseDown,childMouseMove:e.handleMouseMove})})))}))),r.a.createElement("br",null),r.a.createElement("div",null,r.a.createElement(f.TwitterPicker,{colors:["#009B48","#B90000","#0045AD","#FF5900","#FFFFFF","#FFD500"],color:this.state.currentColor,onChangeComplete:this.handleChangeComplete})),r.a.createElement("br",null),r.a.createElement(v.a,{id:"discrete-slider",gutterBottom:!0},"Width"),r.a.createElement(w.a,{defaultValue:3,"aria-labelledby":"discrete-slider",onChangeCommitted:this.handleWidthSliderChangeComplete,valueLabelDisplay:"auto",step:1,marks:!0,min:1,max:10}),r.a.createElement(v.a,{id:"discrete-slider",gutterBottom:!0},"Height"),r.a.createElement(w.a,{defaultValue:3,"aria-labelledby":"discrete-slider",onChangeCommitted:this.handleHeightSliderChangeComplete,valueLabelDisplay:"auto",step:1,marks:!0,min:1,max:10}),r.a.createElement(j,{onImageCropped:this.handleImageCropped,width:3*this.state.grid_width,height:3*this.state.grid_height}))}}]),t}(a.Component)),E=function(e,t){for(var n=[],a=0;a<t;a++){for(var r=[],o=0;o<e;o++)r.push(k());n.push(r)}return n},k=function(){for(var e=[],t=0;t<3;t++){for(var n=[],a=0;a<3;a++)n.push(F(a,t));e.push(n)}return e},F=function(e,t){return{col:e,row:t,color:"gray"}},I=function(e,t,n,a,r,o){var i=e.slice(),c=i[t][n].slice(),l=c[a][r],h=Object(s.a)({},l,{color:o});return c[a][r]=h,i[t][n]=c,i},D=function(e,t,n,a){for(var r=3*t,o=2*t*3,i=3*t*3,s=e.slice(),c=0;c<n;c++)for(var l=c*i,h=0;h<t;h++){var u=3*h,d=s[c][h],p=[a.slice(l+u,l+u+3),a.slice(l+u+r,l+u+r+3),a.slice(l+u+o,l+u+o+3)];s[c][h]=S(d,p)}return s},S=function(e,t){for(var n=e.slice(),a=0;a<3;a++)for(var r=0;r<3;r++){var o=n[a][r],i=Object(s.a)({},o,{color:t[a][r]});n[a][r]=i}return n};var _=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(O,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(_,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[108,1,2]]]);
//# sourceMappingURL=main.a3f1d18c.chunk.js.map