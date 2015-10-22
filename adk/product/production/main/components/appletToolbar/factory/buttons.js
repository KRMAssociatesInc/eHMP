/*
==========================
DEPRECATED:  TO BE REMOVED
see appletToolbarView.js
==========================
*/
define([
	"jquery",
	"underscore",
	"api/Messaging",
	"api/ResourceService"
], function($, _, Messaging, ResourceService) {

	/****** Base Button Class *******/
	function ButtonClass(options) {
		this.btn = document.createElement("a");
		this.btn.className = 'btn';
		this.setClickHandler = function(options) {
			if (options.clickHandler) {
				this.clickHandler = options.clickHandler;
			}
		};
		this.toggleHandler = function(toggler) {
			var that = this;
			toggler.on('click focusin', function() {
				var bttn = $(this).parents().find('#' + that.btn.id);
				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				bttn.addClass('toolbar-btn-hover');
			});
		};

		//init
		this.btn.innerHTML = (options.innerHTML || 'New Button');
		if (options.buttonid) {
			this.btn.setAttribute('id', options.buttonid);
		}
		if (options.toggler) {
			this.toggleHandler(options.toggler);
		}

	}

	/****** Submenu Button Class *******/
	function SubmenuButton(options){
		this.submenuBtn = document.createElement("a");
		this.submenuBtn.className = 'btn btn-default dropdown-toggle';
		this.submenuBtn.innerHTML = (options.innerHTML || '<i class="fa fa-share-alt"></i>');
		this.submenuBtn.setAttribute('id',(options.buttonid || 'submenu-button-toolbar'));
		this.submenuBtn.setAttribute('data-toggle','dropdown');
		this.submenuBtn.setAttribute('aria-haspopup' ,'true');
		this.submenuBtn.setAttribute('tooltip-data-key', 'toolbar_submenu');
		//disable button if it doesn't have any submenu items.
		if(options.submenuItems.length === 0){
			this.submenuBtn.setAttribute('disabled',true);
		}
		this.setClickHandler = function(options) {
			if (options.clickHandler) {
				this.clickHandler = options.clickHandler;
			}
		};
		this.toggleHandler = function(toggler) {
			var that = this;
			toggler.on('click focusin', function() {
				var bttn = $(this).parents().find('#' + that.btn.id);
				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				bttn.addClass('toolbar-btn-hover');
			});
		};
		this.clickHandler = function() {
			//click handler
			$(this.submenuBtn).on('click', function(e) {
				e.preventDefault();
				var that = this;
				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				$(this).addClass('toolbar-btn-hover');
				$('[data-toggle=popover]').popover('hide');
                $(this).siblings('.dropdown-menu').toggle();

				//508 compliance
				setTimeout(function() {
					$(that).siblings('ul').find('li:eq(1) a')
						.trigger('focus')
						.trigger('hover');
					//$(that).siblings('ul').attr('aria-expanded', true);
					$(that).attr('aria-expanded', true);
				}, 10);

			});
		};

		//create submenu items list
		this.submenuItemList = document.createElement("ul");
		this.submenuItemList.className = 'dropdown-menu';
		//this.submenuItemList.setAttribute('aria-expanded' ,'false');
		this.submenuItemList.setAttribute('role', 'menu');

		//create submenu items
		this.submenuTitle = document.createElement('li');
		this.submenuTitle.className = 'appletToolbar-submenu-title';
		this.submenuTitle.innerHTML = options.submenuTitle;
		this.submenuItemList.appendChild(this.submenuTitle);
		_.each(options.submenuItems, function(menuitem) {
			var li = document.createElement('li');
			var anchor = document.createElement('a');
			anchor.href = menuitem.url;
			anchor.text = menuitem.displayText;
			li.appendChild(anchor);
			this.submenuItemList.appendChild(li);
		}, this);

		//create submenu shell and attach item list
		this.submenu = document.createElement('div');
		this.submenu.className = "btn-group dropdown";
		this.submenu.setAttribute("role","group");
		this.submenu.appendChild(this.submenuBtn);
		this.submenu.appendChild(this.submenuItemList);

		//init
		//if there is only one sub menu item, just go to that item
		//when submenu item is clicked.
		if (options.submenuItems.length === 1) {
			var url = options.submenuItems[0].url;
			this.clickHandler = function(){
				$(this.submenuBtn).on('click', function(e) {
					e.preventDefault();
					ADK.Navigation.navigate(url);
				});
			};
		}
		this.clickHandler();
		if (options.toggler) {
			this.toggleHandler(options.toggler);
		}
		this.btn = this.submenu;
	}

	/****** InfoButton Class *******/
	function InfoButton(options) {
		this.btn = document.createElement("a");
		this.btn.className = 'btn';
		this.btn.setAttribute('id', (options.buttonid || 'info-button-toolbar'));
		this.btn.setAttribute('tabindex', 0);
		this.btn.setAttribute('tooltip-data-key', 'toolbar_infobutton');
		this.btn.innerHTML = (options.innerHTML || '<i class="fa fa-info"></i>');
		this.clickHandler = function(options) {
			//click handler
			$(this.btn).on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				var that = this;
				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				$(this).addClass('toolbar-btn-hover');
				if ($(this).siblings('.dropdown').hasClass('open')) {
					$('.dropdown.open .dropdown-toggle').dropdown('toggle');
				}
				//options.targetElement.$el.find('[data-toggle=popover]').click();
				var currentPatient = ResourceService.patientRecordService.getCurrentPatient();
				var channelObject = {
					model: options.targetElement.model,
					uid: options.targetElement.model.get("uid"),
					patient: currentPatient
				};
				ADK.utils.infoButtonUtils.callProvider(channelObject);
				$(this).tooltip('remove');
			});
		};
		this.setClickHandler = function(options) {
			if (options.clickHandler) {
				this.clickHandler = options.clickHandler;
			}
		};
		this.toggleHandler = function(toggler) {
			var that = this;
			toggler.on('click focusin', function() {
				var bttn = $(this).parents().find('#' + that.btn.id);
				bttn.focus();
				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				bttn.addClass('toolbar-btn-hover');
				if (bttn.siblings('.dropdown').hasClass('open')) {
					$('.dropdown.open .dropdown-toggle').dropdown('toggle');
				}
			});
		};
		//init
		if (options.toggler) {
			this.toggleHandler(options.toggler);
		} else {
			this.toggleHandler(options.targetElement.$el.find('[data-toggle=popover],.right-side'));
		}
		this.clickHandler(options);
	}

	/****** QuickLook Button Class *******/
	function QuickLookButton(options) {
		this.btn = document.createElement("a");
		this.btn.className = 'btn';
		this.btn.setAttribute('id', (options.buttonid || 'quick-look-button-toolbar'));
		this.btn.setAttribute('tabindex', 0);
		this.btn.setAttribute('tooltip-data-key', 'toolbar_quicklook');
		this.btn.innerHTML = (options.innerHTML || '<i class="fa fa-eye"></i>');
		this.clickHandler = function(options) {
			//click handler
			$(this.btn).on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				var that = this;
				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				$(this).addClass('toolbar-btn-hover');
				if ($(this).siblings('.dropdown').hasClass('open')) {
					$('.dropdown.open .dropdown-toggle').dropdown('toggle');
				}
				options.targetElement.$el.find('[data-toggle=popover]').click();
				$(this).tooltip('remove');
			});
		};
		this.setClickHandler = function(options) {
			if (options.clickHandler) {
				this.clickHandler = options.clickHandler;
			}
		};
		this.toggleHandler = function(toggler) {
			var that = this;
			toggler.on('click focusin', function() {
				var bttn = $(this).parents().find('#' + that.btn.id);
				bttn.focus();
				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				bttn.addClass('toolbar-btn-hover');
				if (bttn.siblings('.dropdown').hasClass('open')) {
					$('.dropdown.open .dropdown-toggle').dropdown('toggle');
				}
			});
		};
		//init
		if (options.toggler) {
			this.toggleHandler(options.toggler);
		} else {
			this.toggleHandler(options.targetElement.$el.find('[data-toggle=popover],.right-side'));
		}
		this.clickHandler(options);
	}

	/****** DetailsView Button Class *******/
	function DetailViewButton(options) {
		this.btn = document.createElement("a");
		this.btn.className = 'btn';
		//this.btn.setAttribute('type','button');
		this.btn.setAttribute('id', (options.buttonid || 'detailView-button-toolbar'));
		this.btn.setAttribute('href', '#');
		this.btn.setAttribute('tooltip-data-key', 'toolbar_detailview');
		this.btn.innerHTML = (options.innerHTML || '<i class="fa fa-file-text-o"></i>');
		this.clickHandler = function(options) {
			$(this.btn).on('click', function(e) {
				var that = this;
				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				$(this).addClass('toolbar-btn-hover');
				$('[data-toggle=popover]').popover('hide');
				if ($(this).siblings('.dropdown').hasClass('open')) {
					$('.dropdown.open .dropdown-toggle').dropdown('toggle');
				}
				var currentPatient = ResourceService.patientRecordService.getCurrentPatient();
				var channelObject = {
					model: options.targetElement.model,
					uid: options.targetElement.model.get("uid"),
					patient: {
						icn: currentPatient.attributes.icn,
						pid: currentPatient.attributes.pid
					}
				};

				if(options.targetElement.applet){
					channelObject.applet =  options.targetElement.applet;
				}
				//$(this).tooltip('remove');
				Messaging.getChannel(options.targetElement.model.get("applet_id")).trigger('detailView', channelObject);
				//setTimeout(function(){$(that).focus();}, 10);
				e.preventDefault();
				e.stopPropagation();
			});
		};
		this.setClickHandler = function(options) {
			if (options.clickHandler) {
				this.clickHandler = options.clickHandler;
			}
		};
		this.toggleHandler = function(toggler) {
			var that = this;
			toggler.on('click focusin', function() {
				var bttn = $(this).parents().find('#' + that.btn.id);
				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				//bttn.addClass('toolbar-btn-hover');
				if (bttn.siblings('.dropdown').hasClass('open')) {
					$('.dropdown.open .dropdown-toggle').dropdown('toggle');
				}
			});
		};
		//init
		if (options.toggler) {
			this.toggleHandler(options.toggler);
		} else {
			if (options.targetElement.options.AppletID.indexOf("medication_review_v2") >= 0) {
				this.toggleHandler(options.targetElement.$el.find('.medsItemInnerList'));
			} else {
				this.toggleHandler(options.targetElement.$el.find('.info-display'));
			}
		}
		this.clickHandler(options);
	}

    /****** Add Item Button Class *******/
    function AddItemButton(options) {
        this.btn = document.createElement("a");
        this.btn.className = 'btn';
        //this.btn.setAttribute('type','button');
        this.btn.setAttribute('id', (options.buttonid || 'ordersView-button-toolbar'));
        this.btn.setAttribute('href', '#');
        this.btn.setAttribute('tooltip-data-key', 'Add Orders');
        this.btn.innerHTML = (options.innerHTML || '<i class="fa fa-plus"></i>');
        this.clickHandler = function(options) {
            $(this.btn).on('click', function(e) {
                var that = this;
                $('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
                $(this).addClass('toolbar-btn-hover');
                $('[data-toggle=popover]').popover('hide');
                if ($(this).siblings('.dropdown').hasClass('open')) {
                    $('.dropdown.open .dropdown-toggle').dropdown('toggle');
                }
                var currentPatient = ResourceService.patientRecordService.getCurrentPatient();
                var channelObject = {
                    model: options.targetElement.model,
                    // uid: options.targetElement.model.get("uid"),
                    // patient: {
                    //     icn: currentPatient.attributes.icn,
                    //     pid: currentPatient.attributes.pid
                    // }
                };

                if(options.targetElement.applet){
                    channelObject.applet =  options.targetElement.applet;
                }

                Messaging.getChannel(options.targetElement.model.get("applet_id")).trigger('addItem', channelObject);
                //setTimeout(function(){$(that).focus();}, 10);
                Messaging.getChannel('stackedGraph').trigger('delete', {model: model});
                e.preventDefault();
                e.stopPropagation();
            });
        };
        this.setClickHandler = function(options) {
            if (options.clickHandler) {
                this.clickHandler = options.clickHandler;
            }
        };
        this.toggleHandler = function(toggler) {
            var that = this;
            toggler.on('click focusin', function() {
                var bttn = $(this).parents().find('#' + that.btn.id);
                $('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
                //bttn.addClass('toolbar-btn-hover');
                if (bttn.siblings('.dropdown').hasClass('open')) {
                    $('.dropdown.open .dropdown-toggle').dropdown('toggle');
                }
            });
        };
        this.clickHandler(options);
    }
	/****** DetailsView Button Class *******/
	function DeleteStackedGraphButton(options) {
		this.btn = document.createElement("a");
		this.btn.className = 'btn';
		//this.btn.setAttribute('type','button');
		this.btn.setAttribute('title','Delete this graph');
		this.btn.setAttribute('href','#');
		this.btn.setAttribute('id', (options.buttonid || 'deleteView-button-toolbar'));
		this.btn.setAttribute('tooltip-data-key', 'toolbar_deletestackedgraph');
		this.btn.innerHTML = (options.innerHTML || '<i class="fa fa-times"></i>');
		var model = options.targetElement.model;

		this.clickHandler = function(options) {

			$(this.btn).on('click', function(e) {
				var that = this;

				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				$(this).addClass('toolbar-btn-hover');
				$('[data-toggle=popover]').popover('hide');
				if ($(this).siblings('.dropdown').hasClass('open')) {
					$('.dropdown.open .dropdown-toggle').dropdown('toggle');
				}
				$(this).tooltip('destroy');
				Messaging.getChannel(options.targetElement.options.AppletID).trigger('delete', {model: model});
				e.preventDefault();
				e.stopPropagation();
			});
		};
		this.setClickHandler = function(options) {
			if (options.clickHandler) {
				this.clickHandler = options.clickHandler;
			}
		};
		this.toggleHandler = function(toggler) {
			var that = this;
			toggler.on('click focusin', function() {
				var bttn = $(this).parents().find('#' + that.btn.id);
				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				//bttn.addClass('toolbar-btn-hover');
				if (bttn.siblings('.dropdown').hasClass('open')) {
					$('.dropdown.open .dropdown-toggle').dropdown('toggle');
				}
			});
		};
		//init
		if (options.toggler) {
			this.toggleHandler(options.toggler);
		} else {
			if (options.targetElement.options.AppletID.indexOf("medication_review_v2") >= 0) {
				this.toggleHandler(options.targetElement.$el.find('.medsItemInnerList'));
			} else {
				this.toggleHandler(options.targetElement.$el.find('.info-display'));
			}
		}
		this.clickHandler(options);
	}

	/****** TileSort Button Class *******/
	function TileSortButton(options) {
		var draggingClass = 'tilesort-keydown-dragging',
			selectedTileIndex;

		this.btn = document.createElement("a");
		this.btn.className = 'btn';
		this.btn.setAttribute('id', (options.buttonid || 'tilesort-button-toolbar'));
		this.btn.setAttribute('href', '#');
		this.btn.setAttribute('tooltip-data-key', 'toolbar_tilesortbutton');
		this.btn.innerHTML = (options.innerHTML || '<i class="fa fa-arrows-v"></i>');
		this.clickHandler = function(options) {
			//click handler
			$(this.btn).on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				var that = this;
				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				$(this).addClass('toolbar-btn-hover');
				if ($(this).siblings('.dropdown').hasClass('open')) {
					$('.dropdown.open .dropdown-toggle').dropdown('toggle');
				}
			});
			$(this.btn).on('focusout', function(e) {
				$(this).removeClass(draggingClass);
			});
			$(this.btn).on('keydown', function(e) {
				if (!$(this).hasClass(draggingClass)) {
                    var tile;
                    if(options.isStackedGraph){
                        tile = $(this).closest('.appletToolbar').parent('[draggable="true"]');
                    } else {
                        tile = $(this).closest('.appletToolbar').siblings('[draggable="true"]');
                    }
					if (tile.length) {
						switch (e.which) {
							case 13 :
							case 32 :
								e.preventDefault();
								e.stopPropagation();

								$(this).addClass(draggingClass);

								var startTile;

                                if(options.isStackedGraph){
                                    startTile = $(this).closest('.row');
                                } else {
                                    startTile = $(this).closest('.gistItem');
                                }

								selectedTileIndex = startTile.index();
								startTile.trigger('dragstart');

								$(this).tooltip('destroy');
								break;
						}
					}
				} else {
					e.preventDefault();
					e.stopPropagation();

					var itemList;

                    if(options.isStackedGraph){
                        itemList = $(this).closest('.row').parent();
                    } else {
                        itemList = $(this).closest('.gistItem').parent();
                    }

                    var itemListLen = $(itemList).children().length;

					switch (e.which) {
						case 38 : // up arrow
						case 87 : // up arrow
							if (selectedTileIndex > 0) {
								$(itemList).children().eq(selectedTileIndex-1).before($(itemList).children().eq(selectedTileIndex));
								selectedTileIndex--;
							}
							// drops out of focus after move
							$(this).focus();
							$(this).addClass(draggingClass);
							break;
						case 40 : // down arrow
						case 90 : // down arrow
							if (selectedTileIndex < itemListLen) {
								$(itemList).children().eq(selectedTileIndex+1).after($(itemList).children().eq(selectedTileIndex));
								selectedTileIndex++;
							}
							// drops out of focus after move
							$(this).focus();
							$(this).addClass(draggingClass);
							break;
						case 13 :
						case 32 :
							$(this).removeClass(draggingClass);

							var selectedTile;

                            if(options.isStackedGraph){
                                selectedTile = $(this).closest('.row');
                            } else {
                                selectedTile = $(this).closest('.gistItem');
                            }

							$(selectedTile).trigger('drop');
							$(selectedTile).focus();
							break;
					}

					$(this).focus();
				}
			});
		};
		this.setClickHandler = function(options) {
			if (options.clickHandler) {
				this.clickHandler = options.clickHandler;
			}
		};
		this.toggleHandler = function(toggler) {
			var that = this;
			toggler.on('click focusin', function() {
				var bttn = $(this).parents().find('#' + that.btn.id);
				bttn.focus();
				$('.toolbar-btn-hover').removeClass('toolbar-btn-hover');
				bttn.addClass('toolbar-btn-hover');
				if (bttn.siblings('.dropdown').hasClass('open')) {
					$('.dropdown.open .dropdown-toggle').dropdown('toggle');
				}
			});
		};

		//init
		if (options.toggler) {
			this.toggleHandler(options.toggler);
		} else {
			this.toggleHandler(options.targetElement.$el.find('[data-toggle=popover],.right-side'));
		}
		this.clickHandler(options);
	}
	return {
		genericButton: ButtonClass,
		quickLookButton: QuickLookButton,
		detailsViewButton: DetailViewButton,
        addItemButton: AddItemButton,
		subMenuButton: SubmenuButton,
		infoButton: InfoButton,
		deleteStackedGraphButton: DeleteStackedGraphButton,
		tileSortButton: TileSortButton
	};
});