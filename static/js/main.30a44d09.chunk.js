(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{265:function(e,o,t){},266:function(e,o,t){"use strict";t.r(o);var n=t(0),r=t.n(n),a=t(88),s=t.n(a),c=(t(96),t(97),t(90)),i=t(15),u=t(16),l=t(18),h=t(17),d=t(11),p=t(19),v=(t(98),function(e){function o(){return Object(i.a)(this,o),Object(l.a)(this,Object(h.a)(o).apply(this,arguments))}return Object(p.a)(o,e),Object(u.a)(o,[{key:"render",value:function(){var e=this,o=this.props,t=o.col,n=o.row,a="gray"!==this.props.color?"node-visited":"";return r.a.createElement("div",{id:"node-".concat(n,"-").concat(t),className:"node ".concat(a),style:{backgroundColor:this.props.color},onMouseDown:function(o,t){return e.props.onMouseDown(e.props.row,e.props.col)},onMouseMove:function(o,t){return e.props.onMouseMove(e.props.row,e.props.col)}})}}]),o}(n.Component)),f=(t(99),function(e){function o(e){var t;return Object(i.a)(this,o),(t=Object(l.a)(this,Object(h.a)(o).call(this,e))).handleMouseDown=t.handleMouseDown.bind(Object(d.a)(t)),t.handleMouseMove=t.handleMouseMove.bind(Object(d.a)(t)),t}return Object(p.a)(o,e),Object(u.a)(o,[{key:"handleMouseDown",value:function(e,o){this.props.childMouseDown(this.props.row_id,this.props.col_id,e,o)}},{key:"handleMouseMove",value:function(e,o){this.props.childMouseMove(this.props.row_id,this.props.col_id,e,o)}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"cube"},this.props.col.map((function(o,t){return r.a.createElement("div",{key:"div-".concat(t)},o.map((function(o,n){return r.a.createElement(v,{key:"node-".concat(t,"-").concat(n),col:n,color:o.color,onMouseDown:e.handleMouseDown,onMouseMove:e.handleMouseMove,row:t})})))})))}}]),o}(n.Component)),M=t(89),m=(t(265),function(e){function o(){var e;return Object(i.a)(this,o),(e=Object(l.a)(this,Object(h.a)(o).call(this))).handleChangeComplete=function(o){e.setState({currentColor:o.hex})},e.state={grid:[],mouseIsPressed:!1,currentColor:"#fff"},e.handleMouseDown=e.handleMouseDown.bind(Object(d.a)(e)),e.handleMouseMove=e.handleMouseMove.bind(Object(d.a)(e)),e}return Object(p.a)(o,e),Object(u.a)(o,[{key:"componentDidMount",value:function(){var e=w();this.setState({grid:e})}},{key:"handleMouseDown",value:function(e,o,t,n){var r=j(this.state.grid,e,o,t,n,this.state.currentColor);this.setState({grid:r,mouseIsPressed:!0})}},{key:"handleMouseMove",value:function(e,o,t,n){if(this.state.mouseIsPressed){var r=j(this.state.grid,e,o,t,n,this.state.currentColor);this.setState({grid:r})}}},{key:"handleMouseUp",value:function(){this.setState({mouseIsPressed:!1})}},{key:"render",value:function(){var e=this;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"grid",onMouseUp:function(){return e.handleMouseUp()}},this.state.grid.map((function(o,t){return r.a.createElement("div",{key:t},o.map((function(n,a){return r.a.createElement(f,{key:"cube-".concat(t,"-").concat(a),row_id:t,col_id:a,row:o,col:n,childMouseDown:e.handleMouseDown,childMouseMove:e.handleMouseMove})})))}))),r.a.createElement("br",null),r.a.createElement("div",null,r.a.createElement(M.TwitterPicker,{colors:["#009B48","#B90000","#0045AD","#FF5900","#FFFFFF","#FFD500"],color:this.state.currentColor,onChangeComplete:this.handleChangeComplete})))}}]),o}(n.Component)),w=function(){for(var e=[],o=0;o<3;o++){for(var t=[],n=0;n<3;n++)t.push(b());e.push(t)}return e},b=function(){for(var e=[],o=0;o<3;o++){for(var t=[],n=0;n<3;n++)t.push(y(n,o));e.push(t)}return e},y=function(e,o){return{col:e,row:o,color:"gray"}},j=function(e,o,t,n,r,a){var s=e.slice(),i=s[o][t].slice(),u=i[n][r],l=Object(c.a)({},u,{color:a});return i[n][r]=l,s[o][t]=i,s};var O=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(m,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(O,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},91:function(e,o,t){e.exports=t(266)},96:function(e,o,t){},97:function(e,o,t){},98:function(e,o,t){},99:function(e,o,t){}},[[91,1,2]]]);
//# sourceMappingURL=main.30a44d09.chunk.js.map