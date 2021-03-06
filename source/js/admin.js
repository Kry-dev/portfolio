(function($) {
	"use strict";
	var preloader = require("./hm_modules/preloader.js"),
		adminTabs = require("./hm_modules/tabs.js"),
		tinyMceL10n = require("./hm_modules/tinymce_l10n.js"),
		popup = require("./hm_modules/popup.js"),
		pickMeUp = require("./hm_modules/pickMeUp.js");

	popup.init("#hm-popup", ".hm-popup__text", ".hm-popup__close");


	// ==============================
	// TODO: ADMIN HANDLERS
	// ==============================
	if($(".admin-page").length){
		adminTabs(".tabs-control__item", ".tabs-content__item");
		pickMeUp(".form__field_date");

		var tinymce_config = {
			selector: ".tinymce-field",
			plugins: "link, image",
			min_height: 150,
			menubar: false,
			toolbar1: "undo redo | bold italic | link image",
			toolbar2: "alignleft aligncenter alignright",
			setup: function (editor) {
				editor.on("change", function () {
					tinymce.triggerSave();
				});
			}
		};

		tinymce.init(tinymce_config);

		tinyMceL10n();



		// Image preview
		$(".form__field_file").on("change", function(){
			var input = this,
				preview;

			if($("#image-src").length > 0){
				preview = $("#image-src");
			} else {
				preview = $("<img id='image-src'/>");
				$(".form__field_image-preview").append(preview);
			}

			if (input.files && input.files[0]) {
				var reader = new FileReader();

				reader.onload = function(e){
					preview.attr("src", e.target.result);
				};

				reader.readAsDataURL(input.files[0]);
			}
		});



		// Skills handlers
		$(".skills").on("click", function(e){
			var clicked = $(e.target);

			if(clicked.is(".skills__remove")){
				$(clicked)
					.closest(".skills__block")
					.fadeOut(500, function(){
						$(this).remove();
					});
			}

			if(clicked.is(".skill__remove")){
				$(clicked)
					.closest(".skill")
					.fadeOut(300, function(){
						$(this).remove();
					});
			}

			if(clicked.is(".skill__new")){
				var button = clicked,
					counter = button.data("lastcount"),
					block_id = button.data("blockcount"),
					skill_wrap = $("<li class='skill'></li>"),
					skill_name = $("<input class='skill__name' type='text' placeholder='Технология "+(counter+1)+"' name='skills["+block_id+"][skills]["+counter+"][name]'/>"),
					skill_perc = $("<input class='skill__percentage' type='number' min='0' max='100' step='0.5' value='0' name='skills["+block_id+"][skills]["+counter+"][percentage]'/>"),
					skill_misc = $("<span class='skill__misc'><span class='skill__percent-sign'>%</span><span class='skill__remove fa fa-close'></span></span>");

				skill_wrap.append(skill_name, skill_perc, skill_misc);
				button.before(skill_wrap);
				button.data("lastcount", ++counter);
			}
		});



		$(".skills__block_new").on("click", function(){
			var empty_block = $(this),
				counter = empty_block.data("lastblockcount"),
				skills_wrap = $("<div class='skills__block'></div>"),
				skills_remove = $("<div class='skills__remove fa fa-close'></div>"),
				skills_heading = $("<input class='skills__heading' type='text' placeholder='Категория "+(counter+1)+"' name='skills["+counter+"][name]'/>"),
				skills_list = $("<ul class='skills__list'><li class='skill skill__new fa fa-plus' data-blockcount="+counter+" data-lastcount='0'></li></ul>");

			skills_wrap.append(skills_remove, skills_heading, skills_list);
			empty_block.before(skills_wrap);
			empty_block.data("lastblockcount", ++counter);

		});

		$("form").on("submit", function(e){
			var form = $(this);
			e.preventDefault();
			form.ajaxSubmit({
				type: "POST",
				url: "/admin",
				dataType: "json",
				success: function(resp){
					popup.showPopup(resp.message, 2500);
					if(resp.status=="saved"){
						form[0].reset();
					}
				},
				error: function(){
					popup.showPopup("Упс. На сервере произошла ошибка.<br/>Попробуйте позже.", 2500);
				}
			});
		});

	}


	preloader();

})(jQuery);