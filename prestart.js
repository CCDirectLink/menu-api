/*
 * CCMenuAPI - API for cross-modloader menu button adding
 * Written starting in 2019 by 20kdc
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

const CCMenuUI = window.mainMenuAPI;
CCMenuUI.TitleOverlayGui = ig.GuiElementBase.extend({
	init: function () {
		this.parent();
		this.setSize(ig.system.width, ig.system.height);

		// interact/group stuff
		this.interact = new ig.ButtonInteractEntry();
		this.group = new sc.ButtonGroup();
		this.interact.pushButtonGroup(this.group);

		this.hook.transitions = {};
		this.hook.transitions.DEFAULT = {
			state: {},
			time: 0.5,
			timeFunction: KEY_SPLINES.EASE
		};
		this.hook.transitions.HIDDEN = {
			state: {
				offsetY: ig.system.height
			},
			time: 0.5,
			timeFunction: KEY_SPLINES.EASE
		};
		this.doStateTransition("HIDDEN", true);
	},
	takeControl: function () {
		this.doStateTransition("DEFAULT");
		ig.interact.addEntry(this.interact);
	},
	loseControl: function () {
		ig.interact.removeEntry(this.interact);
		this.doStateTransition("HIDDEN");
	}
});

// Utility class for any mod that wants to add a GUI for itself.

// Inject a button to access mod-specific settings
sc.TitleScreenButtonGui.inject({
	_CCMenuUIModsButton: null,
	init: function () {
		this.parent();
		CCMenuUI.titleButtonGui = this;
		CCMenuUI.modsGui = new CCMenuUI.ModsGui();
		this._CCMenuUIModsButton = new sc.ButtonGui("+", 32);
		this._CCMenuUIModsButton.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_BOTTOM);
		this._CCMenuUIModsButton.setPos(160, 40);
		this._CCMenuUIModsButton.hook.transitions = {
			DEFAULT: {
				state: {
				},
				time: 0.4,
				timeFunction: KEY_SPLINES.LINEAR
			},
			HIDDEN: {
				state: {
					offsetX: -192,
					alpha: 0
				},
				time: 0.4,
				timeFunction: KEY_SPLINES.LINEAR
			}
		};
		this._CCMenuUIModsButton.onButtonPress = () => {
			if (this.getChildGuiIndex(CCMenuUI.modsGui) == -1)
				this.addChildGui(CCMenuUI.modsGui);
			CCMenuUI.titleLoseControl();
			CCMenuUI.modsGui.takeControl();
		};
		this._CCMenuUIModsButton.doStateTransition("HIDDEN", true);
		this.insertChildGui(this._CCMenuUIModsButton, 0);
		this.buttonGroup.addFocusGui(this._CCMenuUIModsButton, 1, 4);
	},
	hide: function(a) {
		this.parent(a);
		this._CCMenuUIModsButton.doStateTransition("HIDDEN", a);
	},
	show: function() {
		this.parent();
		this._CCMenuUIModsButton.doStateTransition("DEFAULT", false);
	}
});

CCMenuUI.ModsGui = CCMenuUI.TitleOverlayGui.extend({
	init: function () {
		this.parent();
		var back = new sc.ButtonGui("Back");
		back.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_TOP);
		back.setPos(12, 12);
		back.onButtonPress = () => {
			this.loseControl();
			CCMenuUI.titleTakeControl();
		};
		this.group.addFocusGui(back, 0, 0);
		this.addChildGui(back);

		// and now for...
		this.buttonWidth = Math.floor((ig.system.width - 12) / 2);
		this.listBox = new sc.ButtonListBox(0, 0, 20, 2, 0, this.buttonWidth, this.interact);
		var border = 4;
		this.listBox.setPos(border, 36 + border);
		this.listBox.setSize(ig.system.width - (border * 2), (ig.system.height - 36) - ((border * 2) + 8));
		this.listBox.setButtonGroup(this.group);
		this.addChildGui(this.listBox);
		for (var i = 0; i < CCMenuUI.buttons.length; i++) {
			var bt = new sc.ButtonGui(CCMenuUI.buttons[i].text, this.buttonWidth);
			bt.onButtonPress = CCMenuUI.buttons[i].runnable;
			this.listBox.addButton(bt, true);
			this.group.insertFocusGui(bt, i % 2, 1 + Math.floor(i / 2));
		}
	}
});

