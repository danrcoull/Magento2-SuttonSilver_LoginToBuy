<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace SuttonSilver\LoginToBuy\Block\Account;

use Magento\Customer\Model\Form;
use Magento\Store\Model\ScopeInterface;

/**
 * @api
 * @since 100.0.2
 */
class LoginToBuyPopup extends \Magento\Customer\Block\Account\AuthenticationPopup
{
    /**
     * @var array
     */
    protected $jsLayout;

    /**
     * @var \Magento\Framework\Serialize\Serializer\Json
     */
    private $serializer;
    protected $_scopeConfig;
    protected $_storeManager;

    /**
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param array $data
     * @param \Magento\Framework\Serialize\Serializer\Json|null $serializer
     * @throws \RuntimeException
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        array $data = [],
        \Magento\Framework\Serialize\Serializer\Json $serializer = null,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Store\Model\StoreManagerInterface $storeManager
    ) {
        parent::__construct($context, $data);
        $this->jsLayout = isset($data['jsLayout']) && is_array($data['jsLayout']) ? $data['jsLayout'] : [];
        $this->serializer = $serializer ?: \Magento\Framework\App\ObjectManager::getInstance()
            ->get(\Magento\Framework\Serialize\Serializer\Json::class);

        $this->_scopeConfig = $scopeConfig;
        $this->_storeManager = $storeManager;
    }

    /**
     * @return string
     */
    public function getJsLayout()
    {
        $hidePrice = $this->_scopeConfig->getValue('logintobuy/general/show_price', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
        $hideAddTo = $this->_scopeConfig->getValue('logintobuy/general/show_addtocart', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);

        $this->jsLayout['components']['loginToBuyPopup']['hideAddToCartEnabled'] = ($hideAddTo==0) ? true : false;
        $this->jsLayout['components']['loginToBuyPopup']['hidePriceEnabled'] = ($hidePrice==0) ? true : false;

        return $this->serializer->serialize($this->jsLayout);
    }

}
