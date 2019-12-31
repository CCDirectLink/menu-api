/*
 * CCMenuAPI - API for cross-modloader menu button adding
 * Written starting in 2019 by 20kdc
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

window.mainMenuAPI = {
	TitleOverlayGui: null,
	titleButtonGui: null,
	ModsGui: null,
	modsGui: null,
	// Makes the title screen lose control for your custom UI.
	titleLoseControl: function () {
		ig.bgm.pause("SLOW");
		ig.interact.removeEntry(this.titleButtonGui.buttonInteract);
		this.titleButtonGui.background.doStateTransition("DEFAULT");
	},
	// Gives the title screen control again.
	titleTakeControl: function () {
		this.titleButtonGui.background.doStateTransition("HIDDEN");
		ig.interact.addEntry(this.titleButtonGui.buttonInteract);
		ig.bgm.resume("SLOW");
	},
	buttons: []
};

