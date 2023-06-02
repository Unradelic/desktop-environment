var desktopIconList = null;
var keyboardFocus = null;

function initializeTooltips() {
	tooltipElements = document.querySelectorAll("[ttip]");
	for (var i = 0; i < tooltipElements.length; i++) {
		tippy(tooltipElements[i], {
			arrow: true,
			content: tooltipElements[i].getAttribute("ttip")
		});
	}
}
function initializeDesktop() {
	let desktopElements = document.getElementsByClassName("_env_desktop-element");
	let taskbarStart = document.getElementById("taskbar-apps");
	let appsMenu = document.getElementById("apps-menu");
	for (var i = 0; i < desktopElements.length; i++) {
		desktopElements[i].addEventListener("click", function (e) {
			let activeDesktopElements = document.getElementsByClassName("_env_desktop-element-active");
			for (var i = 0; i < activeDesktopElements.length; i++) {
				activeDesktopElements[i].classList.remove("_env_desktop-element-active");
			}
			this.classList.toggle("_env_desktop-element-active");
		});
		desktopElements[i].addEventListener("dblclick", function (e) {
			appsMenu.classList.remove("_env_taskbar-apps-opened");
			taskbarStart.classList.remove("_env_taskbar-apps-icon-opened");
			
			this.classList.toggle("_env_desktop-element-active");
			let fname = this.getAttribute("fname");
			let ftype = this.getAttribute("ftype");
			let fcontent = this.getAttribute("fcontent");
			let wsize = this.getAttribute("wsize");
			let fullscreen = false;
			if (wsize == null || wsize == "default") {
				wsize = [860, 720];
			}
			else if (wsize == "full") {
				wsize = [860, 720];
				fullscreen = true;
			}
			else {
				wsize = wsize.split(",");
				wsize = {
					width: wsize[0],
					height: wsize[1]
				};
			}
			if (ftype == "mp3") {
				wsize = {
					width: 570,
					height: 220
				};
			}
			let wpos = this.getAttribute("wpos");
			if (wpos == null || wpos == "center") {
				wpos = {
					x: window.innerWidth / 2 - wsize.width / 2,
					y: window.innerHeight / 2 - wsize.height / 2
				};
			}
			else {
				wpos = wpos.split(",");
				wpos = {
					x: wpos[0],
					y: wpos[1]
				};
			}
			newWindow(fname, {
				width: wsize.width,
				height: wsize.height,
				x: wpos.x,
				y: wpos.y,
				resizable: true,
				draggable: true,
				maximizable: true,
				closable: true,
				fullscreen: fullscreen,
				alwaysOnTop: false
			}, ftype, fcontent);
		});
	}
	let desktop = document.getElementById("desktop");
	desktop.addEventListener("mousedown", function (event) {
		let activeDesktopElements = document.getElementsByClassName("_env_desktop-element-active");
		for (var i = 0; i < activeDesktopElements.length; i++) {
			if (!event.target.closest("._env_desktop-element-active") && event.target != activeDesktopElements[i]) {
				activeDesktopElements[i].classList.remove("_env_desktop-element-active");
			}
		}
		if ((!event.target.closest("._env_taskbar-apps-opened") && !event.target.closest("._env_taskbar-apps")) && (event.target != appsMenu || event.target != this)) {
			appsMenu.classList.remove("_env_taskbar-apps-opened");
			taskbarStart.classList.remove("_env_taskbar-apps-icon-opened");
		}
		let activeWindow = document.getElementsByClassName("_env_window-active")[0];
		if (typeof activeWindow !== 'undefined' && !event.target.closest("._env_window-active") && event.target != activeWindow) {
			activeWindow.classList.remove("_env_window-active");
		}
	});
	desktopIconList = new Sortable(desktop, {
		group: "name",  // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
		sort: true,  // sorting inside list
		delay: 0, // time in milliseconds to define when the sorting should start
		delayOnTouchOnly: false, // only delay if user is using touch
		touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
		disabled: false, // Disables the sortable if set to true.
		store: null,  // @see Store
		animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
		easing: "cubic-bezier(1, 0, 0, 1)", // Easing for animation. Defaults to null. See https://easings.net/ for examples.
		filter: ".ignore-elements",  // Selectors that do not lead to dragging (String or Function)
		preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
		draggable: "._env_desktop-element",  // Specifies which items inside the element should be draggable

		dataIdAttr: 'data-id', // HTML attribute that is used by the `toArray()` method

		ghostClass: "sortable-ghost",  // Class name for the drop placeholder
		chosenClass: "sortable-chosen",  // Class name for the chosen item
		dragClass: "sortable-drag",  // Class name for the dragging item

		swapThreshold: 1, // Threshold of the swap zone
		invertSwap: false, // Will always use inverted swap zone if set to true
		invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
		direction: 'horizontal', // Direction of Sortable (will be detected automatically if not given)

		forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in

		fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
		fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
		fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.

		dragoverBubble: false,
		removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
		emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it
	});
	taskbarStart.onclick = function (e) {
		let startMenu = document.getElementById("apps-menu");
		startMenu.classList.toggle("_env_taskbar-apps-opened");
		taskbarStart.classList.toggle("_env_taskbar-apps-icon-opened");
	}
}
function initializeWindowCanvas() {
}
function newWindow(title, options, type, content) {
	let newWindow = document.createElement("div");
	newWindow.classList.add("_env_window");
	
	if (type == 'pdf') {
		content = '<iframe class="_env_window-content-iframe" src="' + content + '#toolbar=0&navpanes=0" style="width: 100%; height: 100%;"></iframe>';
	}
	else if (type == 'godot') {
		/* Extra controls could be added, like full-screen mode. */
		content = '<iframe class="_env_window-content-iframe" src="' + content + '" style="width: 100%; height: 100%;"></iframe>';
	}
	else if (type == 'web') {
		content = '<iframe class="_env_window-content-iframe" src="' + content + '" style="width: 100%; height: 100%;"></iframe>';
	}
	else if (type == 'mp3') {
		content = '<iframe class="_env_window-content-iframe" src="' + content + '" style="width: 100%; height: 100%;"></iframe>';
	}
	else if (type == 'python') {
		preContent = '<div class="_env_window-content-terminal">';
		fetchContent = "";
		fetch(content).then((r) => { r.text().then((d) => { fetchContent = d }) });
		console.log(fetchContent);
		preContent += '<py-script>' + fetchContent + '</py-script>';
		preContent = '</div>';
		content = preContent;
	}
	newWindow.innerHTML = `<div class="_env_window-winbar"><p class="_env_window-winbar-title">${title}</p><div class="_env_window-winbar-buttons">
			<button class="_env_window-winbar-button _env_window-winbar-button-minimize" title="Minimize">&#xf2d1;</button>
			<button class="_env_window-winbar-button _env_window-winbar-button-maximize" title="Maximize">&#xf2d0;</button>
			<button class="_env_window-winbar-button _env_window-winbar-button-close" title="Close" onclick="this.parentNode.parentNode.parentNode.remove();">&#xf00d;</button>
		</div>
	</div>
	<div class="_env_window-content">
		${content}
	</div>
	<div class="_env_window-footer"></div>`;
	if (options.height) {
		newWindow.style.height = options.height + "px";
	}
	if (options.width) {
		newWindow.style.width = options.width + "px";
	}
	if (options.x && options.y) {
		// newWindow.style.transform = "translate3d(" + options.x + "px, " + options.y + "px, 0)";
		newWindow.style.left = options.x + "px";
		newWindow.style.top = options.y + "px";
		newWindow.setAttribute("wpos", options.x + "," + options.y);
	}
	if (options.resizable) {
		newWindow.classList.add("_env_window-resizable");
	}
	if (options.draggable) {
		newWindow.classList.add("_env_window-draggable");
	}
	if (options.minimizable) {
		newWindow.classList.add("_env_window-minimizable");
	}
	if (options.maximizable) {
		newWindow.classList.add("_env_window-maximizable");
	}
	if (options.closable) {
		newWindow.classList.add("_env_window-closable");
	}
	if (options.alwaysOnTop) {
		newWindow.classList.add("_env_window-always-on-top");
	}
	let windows = document.getElementsByClassName("_env_window");
	for (let i = 0; i < windows.length; i++) {
		windows[i].classList.remove("_env_window-active");
	}
	newWindow.classList.add("_env_window-active");
	
	let domWindow = document.getElementById("desktop").appendChild(newWindow);
	
	if (options.fullscreen) {
		domWindow.classList.add("_env_window-fullscreen");
		if (domWindow.requestFullscreen) {
			domWindow.requestFullscreen();
		}
		else if (domWindow.webkitRequestFullscreen) {
			domWindow.webkitRequestFullscreen();
		}
		else if (domWindow.msRequestFullscreen) {
			domWindow.msRequestFullscreen();
		}
		function exitHandler() {
			if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
				domWindow.classList.remove("_env_window-fullscreen");
				domWindow.style.height = "860px";
				domWindow.style.width = "720px";
			}
		}
		if (document.addEventListener) {
			document.addEventListener('fullscreenchange', exitHandler, false);
			document.addEventListener('mozfullscreenchange', exitHandler, false);
			document.addEventListener('MSFullscreenChange', exitHandler, false);
			document.addEventListener('webkitfullscreenchange', exitHandler, false);
		}
	}
	
	initWindowEvents(domWindow);
	
}
function initWindowEvents(newWindow) {
	function toggleMaximize() {
		newWindow.classList.toggle("_env_window-maximized");
	}
	function closeWindow() {
		newWindow.classList.add("_env_window-closing");
		setTimeout(function () {
			newWindow.remove();
		}, 500);
	}
	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		window.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		window.onmousemove = elementDrag;
	}
  
	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		// newWindow.style.transform = "translate("+ (newWindow.offsetLeft - pos1) + "px, " + (newWindow.offsetTop - pos2) + "px)";
		newWindow.classList.add("_env_window-dragging");
		
		// newWindow.style.transform = "translate3d("+ (newWindow.offsetLeft - pos1) + "px, " + (newWindow.offsetTop - pos2) + "px, 0px)";
		newWindow.style.top = (newWindow.offsetTop - pos2) + "px";
		newWindow.style.left = (newWindow.offsetLeft - pos1) + "px";
	}
  
	function closeDragElement() {
		// stop moving when mouse button is released:
		window.onmouseup = null;
		window.onmousemove = null;
		newWindow.classList.remove("_env_window-dragging");
	}
	
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	let dragElem = newWindow.getElementsByClassName("_env_window-winbar")[0];
	dragElem.onmousedown = dragMouseDown;
	dragElem.ondblclick = toggleMaximize;
	let maximizeButton = newWindow.getElementsByClassName("_env_window-winbar-button-maximize")[0];
	maximizeButton.onclick = toggleMaximize;
	
	
	let closeButton = newWindow.getElementsByClassName("_env_window-winbar-button-close")[0];
	closeButton.onclick = closeWindow;
	
	newWindow.addEventListener("mousedown", function (e) {
		//bring this window to the front preserving other windows order
		let windows = document.getElementsByClassName("_env_window");
		for (let i = 0; i < windows.length; i++) {
			windows[i].classList.remove("_env_window-active");
		}
		newWindow.classList.add("_env_window-active");
	});
	
  }