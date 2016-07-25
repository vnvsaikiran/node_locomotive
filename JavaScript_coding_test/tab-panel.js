function TabPanel(options){
	this.init = function(tabSection){
		prepareTabs(tabSection);
	}
	var TABS = {tabs: [], articles: [], info: {}};
	function prepareTabs(section){
		var uniqueId;
		var tabHeaderBar = document.createElement("div");
		tabHeaderBar.className = "tabHeader";
		var articles = section.getElementsByTagName("article"), tab;
		for(var a=0; a<articles.length; a++){
			uniqueId = new Date().getTime() + "-"+ a + "-tab";
			articles[a].style.display = "none";
			tab = articles[a].getElementsByTagName("h3")[0];
			if((options && ((!options.activeTab && a==0) || options.activeTab == a)) || (!options && a==0)){
				tab.className = "act";
				articles[a].style.display = "block";
			}
			TABS.tabs.push(tab);
			TABS.articles.push(articles[a]);
			TABS.info[uniqueId] = { tab:tab, article: articles[a] };
			attachTabEvent(tab, uniqueId);	
			tabHeaderBar.appendChild( tab );
		}		
		section.insertBefore(tabHeaderBar, articles[0]);
	}
	function attachTabEvent(tab, id){
		tab.addEventListener("click", function(e){
			for(var t=0; t<TABS.tabs.length; t++){
				TABS.tabs[t].className = TABS.tabs[t].className.replace(/act/, "");
				TABS.articles[t].style.display = "none";
			}
			TABS.info[id].tab.className = TABS.info[id].tab.className + " act";
			TABS.info[id].article.style.display = "block";
		});
		
	}
};
var tabDemo = function() {
	for(var i = 0; i < document.body.children.length; i++) {
		child = document.body.children[i];
		if(child.tagName.toLowerCase() != 'section') continue;

		t = new TabPanel();
		//t = new TabPanel({activeTab: 1});
		t.init(child);
		window.panels.push(t);
	}
};
var panels = [];
window.onload = tabDemo;