(function( $, undefined ) {
  if(typeof(window.mmc) == 'undefined') window.mmc = {};
  window.mmc.shop = {
    debug: false,
    cart_created: false,
    cart_scrolled: false,
    vart_visible:false,
    lastItemIndex: 0,
    settings: {
    	'formName': 'projectCart'
    },
    availability_strings: {},
    messages: {
      inline_reward_cart_error_max_available: 'inline_reward_cart_error_max_available',
      inline_reward_cart_error_free_amount: 'inline_reward_cart_error_free_amount',
      inline_reward_cart_error_options: 'inline_reward_cart_error_options'
    },
    showCart: function(item) {
          if(this.debug) console.log('showCart');
          var cart              = $('#project-cart');
          var gaugeBlock        = $('#gauge-block');
          var topInvestors      = $('#best-investors-wrapper');
          var $rewardsBlock     = $('#project-rewards');
		
          cart.removeClass('hidden');
          if (item)
          {
            item.addClass('addedToCart');
            setTimeout(function()
            {
              item.removeClass('addedToCart')
            },500);
          }
          gaugeBlock.stop().slideUp();
          topInvestors.hide();
          window.mmc.shop.scrollUpdate();
          window.mmc.shop.vart_visible = true;
          if($rewardsBlock.length && $('#mobile-rewards-tooltip').css('display') == 'block')
          {
            if(this.debug) console.log('mobile cart');
            $('body').animate({'scrollTop': $('#mobile-rewards-tooltip').position().top +'px'},'slow');
          }
      },
    hideCart: function() {
          $('#project-cart').stop().slideUp();
          $('#gauge-block').show();
          $('#gauge-block-wrapper').css({'height':'auto'});
          $('#best-investors-wrapper').show();
          
          var cart_total = parseInt($('#project-cart span.total_value').text());
          if(cart_total > 0)
          {
            $('#gauge-block .bt-invest').hide();
            $('#gauge-block .cart-button').css({'display':'inline-block'});
          }
          else
          {
            $('#gauge-block .bt-invest').show();
            $('#gauge-block .cart-button').hide();
          }
          window.mmc.shop.vart_visible = false;
      },	
    createCart: function(){
          window.mmc.shop.vart_visible = true;
          if(window.mmc.shop.cart_created) {
            $('#gauge-block').hide();
            $('#project-cart').show();
            window.mmc.shop.scrollUpdate();
            return;
          }
          $('#project-cart').detach().prependTo('#gauge-block-wrapper');
          $('#gauge-block').hide();
          window.mmc.shop.cart_created = true;
          window.mmc.shop.scrollUpdate();
      },
    scrollUpdate: function(){
          if(!window.mmc.shop.cart_created || !window.mmc.shop.vart_visible) return;
          if ($(document).scrollTop() > $('#gauge-block-wrapper').offset().top)
          {
            if(!window.mmc.shop.cart_scrolled)
            {
              window.mmc.shop.cart_scrolled = true;
              var cartHeight = $('#project-cart').height();
              $('#project-cart').addClass('stick');
              $('#gauge-block-wrapper').css({'height':cartHeight+'px'});
            }
          }
          else
          {
            if(window.mmc.shop.cart_scrolled)
            {
              $('#project-cart').removeClass('stick');
              $('#gauge-block-wrapper').css({'height':'auto'});
              window.mmc.shop.cart_scrolled = false;
            }
          }
		  },
    refreshDisplay: function(){
          var maxHeight = $(window).height() / 4;
          if($('#project-cart .cart-content').height() > maxHeight)
          {
            $('#project-cart .cart-content-wrapper').addClass('scroll').css({'height':maxHeight+'px'});
          }
          else
          {
            $('#project-cart .cart-content-wrapper').removeClass('scroll').css({'height':'auto'});
          }
    },
    addItem: function(item, addedFromElement) {
          var cartContainer  = $('#project-cart .block');
          var cartItems      = $('#project-cart .items');
          var currency       = item['currency'];
          var spinner_active = true;
          var formName       = window.mmc.shop.settings.formName;

          if(window.mmc.shop.debug) console.log(item, 'from :', addedFromElement);
          
          //analytics add to cart action

          if(typeof(_gaq) != 'undefined') _gaq.push(['_trackEvent', 'Cart', 'Add item', item['label'],, false]);

          if(window.mmc.shop.debug) console.log('addItem id:'+item['id']+' label:'+item['label']+' price:'+item['price']+' max:'+item['max']+' promocode:'+item['promocode']+' currency:'+item['currency']);
                    
          if (item['option'])
          {
            var x = 0;
            var rowOptionId    = '';
            var rowOptionTitle = '';
            while(x<=item['option'].length-1)
            {
              rowOptionId    += item['option'][x]['optionId'];
              rowOptionTitle += ' - '+item['option'][x]['optionLabel'];
              x++;
            }
            var currentItem = $('#project-cart .items #item_'+item['id']+'_option_'+rowOptionId);
            var alreadyOption = $('#project-cart .items #item_'+item['id']+'_option_'+rowOptionId);
          }
          else 
          {
            var currentItem = $('#project-cart .items #item_'+item['id']);
          }

          //increment Qty
          if (item['option'])
          {
            if ((currentItem.length > 0) && (alreadyOption.length > 0))
            {
              var itemIndex = currentItem.attr('data-itemIndex');
              var itemQty = parseInt(currentItem.find('input:text').val());

              if( (parseInt(item['max']) >= 0) 
                 && (itemQty+1 > parseInt(item['max']))
                 ){
                //user tried to buy too much, abort
                return;
              }
              
              // increment item Qty
              currentItem.find('input.item_qty').val(itemQty+1);

              //walk through options
              optionCartHtml = $('<span class="options_container"></span>');
              x = 0;
              while (x<=item['option'].length-1) 
              {
                optionCartHtml.append('<input type="hidden" class="option_'+item['option'][x]['optionId']+'" value="'+item['option'][x]['optionId']+'" name="'+formName+'[items]['+itemIndex+'][parameters][rewards_param_'+item['option'][x]['paramId']+'][option_id][]"/>');
                x++;
              }
              currentItem.append(optionCartHtml);
            }
            //or add new row
            else 
            {
              var itemIndex = this.lastItemIndex;//$('li.item', cartItems).length;

              //walk through options
              optionCartHtml = $('<span class="options_container"></span>');
              x = 0;
              while (x<=item['option'].length-1) 
              {
                optionCartHtml.append('<input type="hidden" class="option_'+item['option'][x]['optionId']+'" value="'+item['option'][x]['optionId']+'" name="'+formName+'[items]['+itemIndex+'][parameters][rewards_param_'+item['option'][x]['paramId']+'][option_id][]"/>');
                x++;
              }

              itemCartHtml  = $('<li id="item_'+item['id']+'_option_'+rowOptionId+'" class="item list-group-item" data-itemIndex="'+itemIndex+'">'
                            + '<label>'+item['label']+rowOptionTitle+'</label>'
                            + '<div class="actions clearfix">'
                            + '<span class="value pledge-value"><span class="val">'+item['price']+'</span> '+currency+'</span>'
                            + '<span class="delete-action"><i class="icon-trash"></i></span>'
                            + '<div class="spinbox">'
                            + '<input type="text"   name="'+formName+'[items]['+itemIndex+'][qty]" value="1" class="form-control item_qty"/>'
                            + '</div>'
                            + '</div>'
                            + '<input type="hidden" name="'+formName+'[items]['+itemIndex+'][label]" value="'+item['label']+'"/>'
                            + '<input type="hidden" name="'+formName+'[items]['+itemIndex+'][id]" value="'+item['id']+'"/>'
                            + '<input type="hidden" name="'+formName+'[items]['+itemIndex+'][price]" value="'+item['price']+'" class="item_price"/>'
                            + '<input type="hidden" name="'+formName+'[items]['+itemIndex+'][max]" value="'+parseInt(item['max'])+'" class="qty_max"/>'
                            + '<input type="hidden" name="'+formName+'[items]['+itemIndex+'][promocode]" value="'+item['promocode']+'" class="item_promocodes"/>'
                            + '</li>');

              this.lastItemIndex++;

              if(addedFromElement && addedFromElement.attr('id'))
              {
                itemCartHtml.attr('data-addedFrom', addedFromElement.attr('id'));
              }

              cartItems.prepend(itemCartHtml.append(optionCartHtml));
            }
            
            var currentItem = $('#project-cart .items #item_'+item['id']+'_option_'+rowOptionId);
            var spinner_param = {"start":1,"min":0};
            if(parseInt(item['max']) >= 0){
              spinner_param.max = parseInt(item['max']);
            }
            setTimeout(
              function(){
                require(['jQueryUi'], function()
                {
                  $('#item_'+item['id']+'_option_'+rowOptionId+' .spinbox input.item_qty').spinner(spinner_param);
                });
              },
              500
            );
          }
          else
          {
            var qty_max = 0;
            
            if (currentItem.length > 0)
            {
              qty_max = parseInt($('input.qty_max', currentItem).val());
              var itemQty = parseInt($('input:text', currentItem).val());
              var itemPromocodes = ($('input.item_promocodes', currentItem).val() != '') ? $('input.item_promocodes', currentItem).val().split(',') : [];
              
              if(item['promocode'] != '')
              {
                // disable spinner for multiple promocodes fix
                spinner_active = false;
                
                var check_length   = (itemPromocodes.length > 0);
                var check_in_array = $.inArray(item['promocode'], itemPromocodes) > -1;
                var check_max      = (itemQty+1 > parseInt(item['max']));
                
                if(window.mmc.shop.debug){
                  console.log('check item check_length: '+check_length+', check_in_array: '+check_in_array+', check_max: '+check_max+' for promocode '+item['promocode']);
                }

                if(check_length && check_in_array && check_max)
                {
                  // One unique promocode allows "item['max']" maximum quantity for the same reward
                  alert(window.mmc.shop.messages['inline_reward_cart_error_max_available']);
                  return;
                }
                else
                {
                  // If the reward is the same but the promocode is different,
                  // add the new promocode to the list of promocodes of existing item

                  itemPromocodes.push(item['promocode']);
                  
                  // increase max quantity (because of multiple promocodes)
                  qty_max += parseInt(item['max']);
                  $('input.qty_max', currentItem).val(qty_max);

                  // save the new list of promocode
                  $('input.item_promocodes', currentItem).val(itemPromocodes.join(','));
                }
              }
              else if((qty_max >= 0) && (itemQty+1 > parseInt(item['max'])))
              {
                if(window.mmc.shop.debug) console.log('max item reached without promocodes');
                alert(window.mmc.shop.messages['inline_reward_cart_error_max_available']);
                return;
              }
              $('input.item_qty', currentItem).val(itemQty+1);
              $('.qty-label', addedFromElement).html('x ' + (parseInt(itemQty) + 1));
            }
            //or add new row
            else 
            {
              if(item['promocode'] != '') spinner_active = false;              
              qty_max = parseInt(item['max']);

              var itemIndex = this.lastItemIndex;//var itemIndex = $('li.item', cartItems).length;

              itemCartHtml  = $('<li id="item_'+item['id']+'" class="item list-group-item" data-itemIndex="'+itemIndex+'">'
                            + '<label>'+item['label']+'</label>'
                            + '<div class="actions clearfix">'
                            + '<span class="value pledge-value"><span class="val">'+item['price']+'</span> '+currency+'</span>'
                            + '<span class="delete-action"><i class="icon-trash"></i></span>'
                            + '<div class="spinbox">'
                            + '<input type="text"   name="'+formName+'[items]['+itemIndex+'][qty]"  value="1" class="form-control item_qty"/>'
                            + '</div>'
                            + '</div>'
                            + '<input type="hidden" name="'+formName+'[items]['+itemIndex+'][label]" value="'+item['label']+'"/>'
                            + '<input type="hidden" name="'+formName+'[items]['+itemIndex+'][id]" value="'+item['id']+'"/>'
                            + '<input type="hidden" name="'+formName+'[items]['+itemIndex+'][price]" value="'+item['price']+'" class="item_price"/>'
                            + '<input type="hidden" name="'+formName+'[items]['+itemIndex+'][max]" value="'+qty_max+'" class="qty_max"/>'
                            + '<input type="hidden" name="'+formName+'[items]['+itemIndex+'][promocode]" value="'+item['promocode']+'" class="item_promocodes"/>'
                            +'</li>');

              if(addedFromElement && addedFromElement.attr('id'))
              {
                itemCartHtml.attr('data-addedFrom', addedFromElement.attr('id'));
              }

              cartItems.prepend(itemCartHtml);
              this.lastItemIndex++;
              
              $('.qty-label', addedFromElement).html('x ' + 1);
            }
            
            var currentItem = $('#project-cart #item_'+item['id']);
            
            if(spinner_active)
            {
              var spinner_param = {"start":1,"min":0};
              if(qty_max >= 0)
              {
                spinner_param.max = parseInt(qty_max);
              }
              setTimeout(
                function(){
                  require(['jQueryUi'], function()
                  {
                    $('#item_'+item['id']+' .spinbox input.item_qty').spinner(spinner_param);
                  });
                },
                500
              );
            }
            else
            {
              setTimeout(
                function(){
                  $('#item_'+item['id']+' .spinbox input.item_qty').attr('disabled','disabled');
                  $('#item_'+item['id']+' .spinbox .ui-spinner').hide();
                },
                500
              );
            }
          }

          window.mmc.shop.refreshCartTotals();
          window.mmc.shop.showCart(currentItem);
          
          if(addedFromElement)
          {
            // scroll to the source reward after item was added
            setTimeout(
              function(){
                var scrollMargin = 20;
                var elementScroll = addedFromElement.parents('.reward').offset().top - $('#project-cart').height() - scrollMargin;
                if($(document).scrollTop() > elementScroll)
                {
                  $('body').animate({'scrollTop': elementScroll+'px'},'slow');
                }
                if(typeof(window.mmc.events) != 'undefined') window.mmc.events.notify('addedToCart',item);
              },
              500
            );
          }
          else
          {
            if(typeof(window.mmc.events) != 'undefined') window.mmc.events.notify('addedToCart',item);
          }
      },
    addFreeValue: function(amount, addedFromElement){
      if(isNaN(amount) ||!(amount > 0)){
        alert(window.mmc.shop.messages['inline_reward_cart_error_free_amount']);
        return;
      }
      var freeRewardItem = $('#project-cart .rewards_free');

      freeRewardItem.removeClass('hidden').addClass('addedToCart');
      setTimeout(function()
      {
        freeRewardItem.removeClass('addedToCart')
      },500);

      var current_amount = $('input.item_price', freeRewardItem).val();
      var new_amount = amount + parseInt($('input.item_price', freeRewardItem).val());
      $('span.val', freeRewardItem).text(new_amount);
      $('input.item_price', freeRewardItem).val(parseInt(new_amount));
      window.mmc.shop.createCart();
      window.mmc.shop.showCart();
      window.mmc.shop.refreshCartTotals();
      
      if(addedFromElement)
      {
        // scroll to the source reward after item was added
        setTimeout(
          function(){
            var scrollMargin = 20;
            var scrollToElement = (addedFromElement.closest('li').length) ? addedFromElement.closest('li') : addedFromElement;
            var scrollPos = scrollToElement.offset().top - $('#project-cart').height() - scrollMargin;
            if($(document).scrollTop() > scrollPos)
            {
              $('body').animate({'scrollTop': scrollPos+'px'},'slow');
            }
            if(typeof(window.mmc.events) != 'undefined') window.mmc.events.notify('addedFreeValue',{'amount':amount});
          },
          500
        );
      }
      else
      {
        if(typeof(window.mmc.events) != 'undefined') window.mmc.events.notify('addedFreeValue',{'amount':amount});
      }
    },
    removeItem: function(item) {
        item.addClass('removedFromCart');
        
        if(item.hasClass('rewards_free'))
        {
          $('span.val', item).text(0);
          $('input.item_price', item).val(0);
          
          setTimeout(function()
          {
            item.removeClass('removedFromCart').hide();
            window.mmc.shop.refreshCartTotals();
          },300);
          return;
        }        
        setTimeout(function()
        {
          item.remove();
          window.mmc.shop.refreshCartTotals();
        },300);
    },
    removeItemFromForm: function(form){

    },
    refreshCartTotals: function(){
          var cartItems = $('#project-cart .items');
          var totals = 0;
          var cart_promocodes = '';

          cartItems.find('li').each(function(index, element){
            var itemQty          = $(this).find('input.item_qty').val();
            var itemPrice        = $(this).find('input.item_price').val();
            var promocodes       = ($(this).find('input.item_promocodes').length) ? $(this).find('input.item_promocodes').val() : '';
            var itemOptions      = $(this).find('.options_container');
            var rowTotal         = itemQty*itemPrice;

            if(promocodes != '')
            {
              if(cart_promocodes != '') cart_promocodes += ',';
              cart_promocodes += promocodes;
            }

            //options
            if (itemOptions.length > 0)
            {
              if (itemOptions.length != itemQty)
              {
                var itemOption = itemOptions.first();
                itemOptions.remove();
                var x     = 0;
                var items = '';
                while (x<=itemQty-1)
                {
                  items += '<span class="options_container">'+itemOption.html()+'</span>';
                  x++;
                }
                $(this).append(items);
              }
            }
            totals = totals + rowTotal;

            if($(this).attr('data-addedFrom'))
            {
              var rewardForm = $('#' + $(this).attr('data-addedFrom'));
              $('.qty-label', rewardForm).html('x '+itemQty);
            }

            if (itemQty == 0){
              window.mmc.shop.removeItem($(this));
            }

          });
          //only rewards Total
          var withRewardsTotal = totals;
          var freeHugs = $("#project-cart li.rewards_free input.item_price").val();
          withoutRewardsTotal = withRewardsTotal - freeHugs;

          $('#project-cart .total_value').text(withRewardsTotal);

          if(withRewardsTotal > 0)
          {
            $('#project-cart-content').removeClass('hidden');
            $('#project-cart-submit').removeClass('hidden');
            $('#project-cart-footer').addClass('hidden');
          }
          else
          {
            $('#project-cart-content').addClass('hidden');
            $('#project-cart-submit').addClass('hidden');
            $('#project-cart-footer').removeClass('hidden');

            this.scrollToRewards();
          }

          window.mmc.shop.refreshDisplay();
      },
    scrollToRewards: function(){
      // scroll to rewards :

      var scrollMargin =  $('#project-cart').height();
      var scrollToElement = $('#project-rewards');

      var scrollPos = scrollToElement.offset().top - $('#project-cart').height() - scrollMargin;
      $('body').animate({'scrollTop': scrollPos+'px'},'slow');
    }
      ,
    //legacy
    performAddToCartRequest : function(){
          window.mmc.shop.refreshCartTotals();

          var form = $('#project-cart form');
          var url  = form.attr('action');
          $('#project-cart .error').addClass('hidden');
          $.post(
              url, 
              form.serialize(), 
              function(data) {
                if(data.mmc_response_type == 'error'){
                  $('#project-cart .error').html(data.content).removeClass('hidden');
                }else{
                  
                  var url = (typeof(data.redirect_url) != 'undefined') ? data.redirect_url : '/cart';
                  if(window.mmc.shop.debug) console.log('redirect to :'+url);
                  else document.location.href = url;
                }
              },
              'json'
            );
      },
    performAddToCartRequestThenRedirect : function(lurl, rurl){

      },
    submitRewardForm: function(form)
    {
      var item          = [];
      var formName      = window.mmc.shop.settings.formName;

      item['id']        = $('input[name="'+formName+'[items][0][id]"]', form).val();
      item['label']     = $('input[name="'+formName+'[items][0][label]"]', form).val();
      item['price']     = $('input[name="'+formName+'[items][0][price]"]', form).val();
      item['max']       = $('input[name="'+formName+'[items][0][max]"]', form).val();
      item['currency']  = $('input[name="'+formName+'[items][0][currency]"]', form).val();
      item['promocode'] = ($('input[name="'+formName+'[items][0][promocode]"]', form).length)? $('input[name="'+formName+'[items][0][promocode]"]', form).val() : '';
      
      var selects = $('select',form);
      
      var allowSubmit = true;
      if (selects.length > 0)
      {
        var options_selected = true;
        item['option'] = [];

        selects.each(function(index){
          item['option'][index] = {
            'paramId': parseInt($(this).attr('data-id')),
            'optionId': parseInt($(this).val()),
            'optionLabel': $(this).find('option:selected').attr('data-optionlabel')
          };
          if(!(parseInt($(this).val()) > 0)) options_selected = false;
        });
        
        if(!options_selected)
        {
          alert(window.mmc.shop.messages['inline_reward_cart_error_options']);
          allowSubmit = false;
        }
      }
      
      if(allowSubmit){
        window.mmc.shop.createCart();
        window.mmc.shop.addItem(item, form);
      }
    },
    parseAltRewardForm: function(form)
    {
      form.submit(function(){
        var item = {'id':0};
        var option_checked = $('input:checked', form);
      	var formName      = window.mmc.shop.settings.formName;
        
        if(option_checked.length)
        {
          var selected = option_checked.parent();
          item['id']        = $('input[name="'+formName+'[items][0][id]"]', selected).val();
	      item['label']     = $('input[name="'+formName+'[items][0][label]"]', selected).val();
	      item['price']     = $('input[name="'+formName+'[items][0][price]"]', selected).val();
	      item['max']       = $('input[name="'+formName+'[items][0][max]"]', selected).val();
	      item['currency']  = $('input[name="'+formName+'[items][0][currency]"]', selected).val();
	      item['promocode'] = ($('input[name="'+formName+'[items][0][promocode]"]', selected).length)? $('input[name="'+formName+'[items][0][promocode]"]', selected).val() : '';
        }
        
        if(!item['id']) alert(window.mmc.shop.messages['inline_reward_cart_error_options']);
        else
        {
          window.mmc.shop.createCart();
          window.mmc.shop.addItem(item, form);
        }
        return false;
      });
    },
    parseRewardForm: function(form)
    {
      var selects = $('select',form);
      var total_sold      = $('input[name="stocksold"]',form).val();
      var total_available = $('input[name="stockavailable"]',form).val();
      var per_user        = $('input[name="per_user"]',form).val();
      
      if(total_available <= 0) total_available = Infinity; // illimited stocks
      
      selects.on('change',function()
      {
        var smallest_available = total_available;
        var sold = 0;
        // Get smallest stock with each select:

        $('option:selected', form).each(function(i){
          var available = parseInt($(this).attr('data-stockavailable'));
          sold += parseInt($(this).attr('data-stocksold'));
          
          if(available <= 0) available = Infinity; // illimited stocks
          
          if(available < smallest_available)
          {
            smallest_available = available;
          }
        });

        if(smallest_available == Infinity) $('small.availability', form).html(window.mmc.shop.availability_strings['unlimited']);
        else if(per_user > 0) $('small.availability', form).html(window.mmc.shop.availability_strings['userlimited']);
        else $('small.availability', form).html(window.mmc.shop.availability_strings['standard']);
        
        $('span.sold', form).text(sold);
        $('span.available', form).text(smallest_available);
        $('span.per_user', form).text(per_user);
      });
      
      $(form).submit(function(){
        window.mmc.shop.submitRewardForm(form);
        return false;
      });

      $('.reward-remove', form).on('click', function(){
        window.mmc.shop.removeItemFromForm(form);
        return false;
      })
    },
    addFromHash: function(hash)
    {
      //free reward added
      
      var reg = new RegExp("freereward-", "g");
      var arr = window.location.hash.split(reg);
      if(arr.length > 1 && parseInt(arr[1]) > 0)
      {
        var val = parseInt(arr[1]);
        if(val > 0)
        {
          window.mmc.shop.addFreeValue(val);
        }
      }
      else
      {
        var reg = new RegExp("reward-", "g");
        var arr = window.location.hash.split(reg);
        if(arr.length > 1 && parseInt(arr[1]) > 0)
        {
          // item reward added
          var form = $('#reward-'+parseInt(arr[1])+'-form');
          if(form.length)
          {
            window.mmc.shop.submitRewardForm(form);
          }
        }
      }
    },
    init: function(){
    	  var formName = window.mmc.shop.settings.formName;

    		$('#gauge-block form').on('submit', function(){
	        window.mmc.shop.createCart();
	        window.mmc.shop.showCart();
          window.mmc.shop.scrollToRewards();
	        return false;
	      });
	      
	      $('#gauge-block .cart-button').click(function(){
	        window.mmc.shop.showCart();
	        $('#project-cart').removeClass('stick');
	        $('#gauge-block-wrapper').css({'height':'auto'});
	        return false;
	      });

    	  window.mmc.shop.availability_strings['unlimited']   = $('small.availability-unlimited').html();
	      window.mmc.shop.availability_strings['standard']    = $('small.availability-standard').html();
	      window.mmc.shop.availability_strings['limited']     = $('small.availability-limited').html();
	      window.mmc.shop.availability_strings['userlimited'] = $('small.availability-userlimited').html();
	      
	      window.mmc.shop.messages['inline_reward_cart_error_max_available'] = $('#inline_reward_cart_error_max_available').text();
	      window.mmc.shop.messages['inline_reward_cart_error_free_amount'] = $('#inline_reward_cart_error_free_amount').text();
	      window.mmc.shop.messages['inline_reward_cart_error_options'] = $('#inline_reward_cart_error_options').text();
	      window.mmc.shop.messages['inline_reward_cart_show_cart'] = $('#inline_reward_cart_show_cart').text();
	      
	      $('#project-cart .close-action').click(function(){
	        window.mmc.shop.hideCart();
	        return false;
	      });
	      
	      $(document).on('click', '#project-cart .ui-spinner-button', function(){
	        window.mmc.shop.refreshCartTotals();
	      });

	      $(document).on('click', '#project-cart .delete-action', function() {
	        window.mmc.shop.removeItem($(this).closest('li'));
	      });
	        
	      $('.reward-form').each(function()
	      {
	        window.mmc.shop.parseRewardForm($(this));
	      });

	      $('.reward-alt-form').each(function()
	      {
	        window.mmc.shop.parseAltRewardForm($(this));
	      });

	      $('.reward-free-form').on('submit', function()
	      {
	        var amount_input = $('input[name="'+formName+'[rewards_free]"]', this);
	        window.mmc.shop.addFreeValue(parseInt(amount_input.val()), $(this).parents('div.reward'));
	        return false;
	      });
	      
	      
	      if(window.location.hash.match("\#reward-([0-9]*)") || window.location.hash.match("\#freereward-([0-9]*)"))
	      {
	        window.mmc.shop.addFromHash(window.location.hash);
	      }
	      
	      
	      $(window).scroll(function(){
	        window.mmc.shop.scrollUpdate();
	      });


        var cart = $('#project-cart');
        cart.css({'width':$('#gauge-block').parent().width()+'px'});

        $(window).on('resize', function(){
          cart.css({'width':$('#gauge-block').parent().width()+'px'});
        });
    }
  };
})( jQuery );