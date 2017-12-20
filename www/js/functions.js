var leadpages_input_data = {};

$(function () { // document.ready
	var TemplateLauncher = {
		init:function() {
			TemplateLauncher.router();
		},
		getEnvironment:function() {
	    var environments = {
	      'preview': 'preview',
	      'builder': 'builder',
	      'production': 'production',
	      'screenshot': 'screenshot',
	      'local': 'local'
	    };
		
      var env;
      if (window.location.pathname.indexOf('preview') !== -1) {
        env = environments.preview; // preview
			} else if(window.location.pathname === '/facebook-tab-app/') {
				env = environments.production; // production / facebook tab
      } else if(window.location.hostname === 'my.leadpages.net') {
        env = environments.builder;  // builder
      } else if (window._phantom || window.callPhantom) {
        env = environments.screenshot; // screenshot service
      } else if(window.location.hostname === 'localhost') {
        env = environments.local;  // localhost
      } else {
        env = environments.production; // production / published LeadPage
      }

      return env;
		},
		router: function() {	  
	    var setBodyClasses = function () {
	      var body = $('body');
	      var environment = TemplateLauncher.getEnvironment();
	      switch (environment) {
        case 'production':
          body.addClass('env-production');
					TemplateLauncher.likeButton();
					TemplateLauncher.shareButtons();
          break;
        case 'preview' :
          body.addClass('env-preview');					
          break;
        case 'builder':
          body.addClass('env-builder');
          break;	        
        case 'local':
          body.addClass('env-local');
          break;
	      };
	    };
	    setBodyClasses();
		},	
		likeButton:function() {
			var url = ( LeadPageData['likeButton']['value'] ? LeadPageData['likeButton']['value'] : document.URL);

			$('.like-button').replaceWith('<div class="fb-like" data-href="' + url + '" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>');
		},
		shareButtons:function() {
			var url = ( LeadPageData['likeButton']['value'] ? LeadPageData['likeButton']['value'] : document.URL);
			
			$('.share').click(function(event){
		      event.preventDefault();
		      var service = $(this).data('service');
		      switch(service) {
		          case 'facebook':
		              url = ( LeadPageData['facebookShareURL']['value'] ? LeadPageData['facebookShareURL']['value'] : document.URL);
		              window_size = "width=585,height=368";
		              go = 'http://www.facebook.com/sharer/sharer.php?u=' + url;
		              break;
		          case 'twitter':
		              url = ( LeadPageData['twitterShareURL']['value'] ? LeadPageData['twitterShareURL']['value'] : document.URL);
		              window_size = "width=585,height=261";
		              go = 'http://www.twitter.com/intent/tweet?url=' + url;
		              break;
		          case 'google':
		              url = ( LeadPageData['googleShareURL']['value'] ? LeadPageData['googleShareURL']['value'] : document.URL);
		              window_size = "width=517,height=511";
		              go = 'http://plus.google.com/share?url=' + url;
		              break;
		          case 'linkedin':
		              url = ( LeadPageData['linkedInShareURL']['value'] ? LeadPageData['linkedInShareURL']['value'] : document.URL);
		              window_size = "width=520,height=570";
		              go = 'http://www.linkedin.com/shareArticle?mini=true&url=' + url;
		              break;
		          default:
		              return false;
		      }
		      window.open(go, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,' + window_size);
		  });
		}
	}
  TemplateLauncher.init()
});


















