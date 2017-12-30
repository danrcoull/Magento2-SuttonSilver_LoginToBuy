/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'ko',
    'Magento_Ui/js/form/form',
    'Magento_Customer/js/action/login',
    'Magento_Customer/js/customer-data',
    'Magento_Ui/js/modal/modal',
    'mage/translate',
    'mage/url',
    'mage/validation'
], function ($, ko, Component, loginAction, customerData, modal, $t, url) {
    'use strict';


    return Component.extend({
        registerUrl: window.loginToBuyPopup.customerRegisterUrl,
        forgotPasswordUrl: window.loginToBuyPopup.customerForgotPasswordUrl,
        autocomplete: window.loginToBuyPopup.autocomplete,
        modalWindow: null,
        isLoading: ko.observable(false),
        defaults: {
            template: 'SuttonSilver_LoginToBuy/login-to-buy-popup'
        },
        initialize: function () {
            var self = this;

            this._super();

            url.setBaseUrl(window.loginToBuyPopup.baseUrl);
            loginAction.registerLoginCallback(function () {
                self.isLoading(false);
            });

            console.log(self.isActive());
            if(self.isActive())
            {
                self.hidePrice().hideAddToCart();
                self.bindClick();
            }

        },
        bindClick : function(){
            var self = this;

            $('.login-to-add, .tocart').on('click',function(e){
                e.preventDefault();
                self.showModal();
            })
        },
        hideAddToCart: function(){
            var self = this;
            if(self.hideAddToCartEnabled)
            {
                var content= "<div class='product-item-actions'>" +
                    "<div class='actions-primary'>" +
                    "<a href='#' class='login-to-add'>Login To Add To Cart</a>"+
                    "</div></div>";

                $('.product-item-actions, .box-tocart').replaceWith(content);
                $('.product-social-links').hide();

            }

            return self;
        },

        hidePrice: function(){
            var self = this;
            if(self.hidePriceEnabled)
            {
                $('.price-box').remove();
            }
            return self;
        },


        /** Init popup login window */
        setModalElement: function (element) {
            console.log(element);
            if (this.modalWindow == null) {
                var options = {
                    'type': 'popup',
                    'modalClass': 'popup-authentication',
                    'focus': '[name=username]',
                    'responsive': true,
                    'innerScroll': true,
                    'trigger': '',
                    'buttons': []
                };

                this.modalWindow = element;
                modal(options, $(this.modalWindow));
            }
        },

        /** Is login form enabled for current customer */
        isActive: function () {
            var customer = customerData.get('customer');
            return customer() != false; //eslint-disable-line eqeqeq
        },

        /** Show login popup window */
        showModal: function () {
            if (this.modalWindow) {
                $(this.modalWindow).modal('openModal');
            }
        },

        /**
         * Provide login action
         *
         * @return {Boolean}
         */
        login: function (formUiElement, event) {
            var loginData = {},
                formElement = $(event.currentTarget),
                formDataArray = formElement.serializeArray();

            event.stopPropagation();
            formDataArray.forEach(function (entry) {
                loginData[entry.name] = entry.value;
            });

            if (formElement.validation() &&
                formElement.validation('isValid')
            ) {
                this.isLoading(true);
                loginAction(loginData);
            }

            return false;
        }
    });
});
