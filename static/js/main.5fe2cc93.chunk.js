(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{106:function(e,t,n){e.exports=n(283)},111:function(e,t,n){},112:function(e,t,n){},113:function(e,t,n){},114:function(e,t,n){},280:function(e,t,n){},283:function(e,t,n){"use strict";n.r(t);var o=n(0),a=n.n(o),r=n(45),i=n.n(r),s=(n(111),n(112),n(101)),c=n(23),l=n(14),u=n(24),d=n(25),h=n(11),p=n(27),m=(n(113),function(e){function t(){return Object(c.a)(this,t),Object(u.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.col,o=t.row,r="gray"!==this.props.color?"node-visited":"";return a.a.createElement("div",{id:"node-".concat(o,"-").concat(n),className:"node ".concat(r),style:{backgroundColor:this.props.color},onMouseDown:function(t,n){return e.props.onMouseDown(e.props.row,e.props.col)},onMouseMove:function(t,n){return e.props.onMouseMove(e.props.row,e.props.col)}})}}]),t}(o.Component)),v=(n(114),function(e){function t(e){var n;return Object(c.a)(this,t),(n=Object(u.a)(this,Object(d.a)(t).call(this,e))).handleMouseDown=n.handleMouseDown.bind(Object(h.a)(n)),n.handleMouseMove=n.handleMouseMove.bind(Object(h.a)(n)),n}return Object(p.a)(t,e),Object(l.a)(t,[{key:"handleMouseDown",value:function(e,t){this.props.childMouseDown(this.props.row_id,this.props.col_id,e,t)}},{key:"handleMouseMove",value:function(e,t){this.props.childMouseMove(this.props.row_id,this.props.col_id,e,t)}},{key:"render",value:function(){var e=this;return a.a.createElement("div",{className:"cube"},this.props.col.map((function(t,n){return a.a.createElement("div",{key:"div-".concat(n)},t.map((function(t,o){return a.a.createElement(m,{key:"node-".concat(n,"-").concat(o),col:o,color:t.color,onMouseDown:e.handleMouseDown,onMouseMove:e.handleMouseMove,row:n})})))})))}}]),t}(o.Component)),f=n(102),g=n(293),M=n(295),b=(n(280),function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(u.a)(this,Object(d.a)(t).call(this))).handleChangeComplete=function(t){e.setState({currentColor:t.hex})},e.handleWidthSliderChangeComplete=function(t,n){e.setState({grid_width:n});var o=w(n,e.state.grid_height);e.setState({grid:o})},e.handleHeightSliderChangeComplete=function(t,n){e.setState({grid_height:n});var o=w(e.state.grid_width,n);e.setState({grid:o})},e.state={grid:[],mouseIsPressed:!1,currentColor:"#fff",grid_width:3,grid_height:3},e.handleMouseDown=e.handleMouseDown.bind(Object(h.a)(e)),e.handleMouseMove=e.handleMouseMove.bind(Object(h.a)(e)),e}return Object(p.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=w(this.state.grid_width,this.state.grid_height);this.setState({grid:e})}},{key:"handleMouseDown",value:function(e,t,n,o){var a=k(this.state.grid,e,t,n,o,this.state.currentColor);this.setState({grid:a,mouseIsPressed:!0})}},{key:"handleMouseMove",value:function(e,t,n,o){if(this.state.mouseIsPressed){var a=k(this.state.grid,e,t,n,o,this.state.currentColor);this.setState({grid:a})}}},{key:"handleMouseUp",value:function(){this.setState({mouseIsPressed:!1})}},{key:"render",value:function(){var e=this;return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{style:{height:"100px"}}),a.a.createElement("div",{className:"grid",onMouseUp:function(){return e.handleMouseUp()}},this.state.grid.map((function(t,n){return a.a.createElement("div",{key:n},t.map((function(o,r){return a.a.createElement(v,{key:"cube-".concat(n,"-").concat(r),row_id:n,col_id:r,row:t,col:o,childMouseDown:e.handleMouseDown,childMouseMove:e.handleMouseMove})})))}))),a.a.createElement("br",null),a.a.createElement("div",null,a.a.createElement(f.TwitterPicker,{colors:["#009B48","#B90000","#0045AD","#FF5900","#FFFFFF","#FFD500"],color:this.state.currentColor,onChangeComplete:this.handleChangeComplete})),a.a.createElement("br",null),a.a.createElement(g.a,{id:"discrete-slider",gutterBottom:!0},"Width"),a.a.createElement(M.a,{defaultValue:3,"aria-labelledby":"discrete-slider",onChangeCommitted:this.handleWidthSliderChangeComplete,valueLabelDisplay:"auto",step:1,marks:!0,min:1,max:10}),a.a.createElement(g.a,{id:"discrete-slider",gutterBottom:!0},"Height"),a.a.createElement(M.a,{defaultValue:3,"aria-labelledby":"discrete-slider",onChangeCommitted:this.handleHeightSliderChangeComplete,valueLabelDisplay:"auto",step:1,marks:!0,min:1,max:10}))}}]),t}(o.Component)),w=function(e,t){for(var n=[],o=0;o<t;o++){for(var a=[],r=0;r<e;r++)a.push(C());n.push(a)}return n},C=function(){for(var e=[],t=0;t<3;t++){for(var n=[],o=0;o<3;o++)n.push(y(o,t));e.push(n)}return e},y=function(e,t){return{col:e,row:t,color:"gray"}},k=function(e,t,n,o,a,r){var i=e.slice(),c=i[t][n].slice(),l=c[o][a],u=Object(s.a)({},l,{color:r});return c[o][a]=u,i[t][n]=c,i};var E=function(){return a.a.createElement("div",{className:"App"},a.a.createElement(b,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(a.a.createElement(E,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[106,1,2]]]);
//# sourceMappingURL=main.5fe2cc93.chunk.js.map